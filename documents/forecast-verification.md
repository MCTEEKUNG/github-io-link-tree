# Forecast Verification Loop

This project serves forecasts as a static contract:

```text
docs/forecast_provinces.json
  -> GitHub Pages
  -> Vercel frontend / LINE OA
```

Frontend and LINE OA must not run the model. They only fetch and display the
published JSON contract.

## Why Forecasts Cannot Be Verified Immediately

Each prediction is a future lead-window forecast. It is not a same-day weather
claim.

Example:

```text
issue_date:       2026-07-01
lead_week:        2
valid_start_date: 2026-07-15
valid_end_date:   2026-07-21
```

The forecast can only be verified after `valid_end_date` has passed and actual
observation data is available for the whole window.

`observed_event` is true when at least one observed heatwave day occurs inside
`valid_start_date..valid_end_date` for the same province.

## issue_date vs generated_at

These fields are intentionally different:

```text
issue_date   = forecast initialization/base date used to calculate lead windows
generated_at = timestamp when the JSON contract was generated or published
```

Verification windows must derive from `issue_date`, not `generated_at`.

Frontend copy should expose both values in plain language:

```text
Forecast base date: 18 Jun 2026
Published: 24 Jun 2026
```

Do not use `generated_at` to shift `valid_start_date` or `valid_end_date`.

## Contract Ingestion

Run contract ingestion after a forecast is published:

```bash
python -m scripts.verification.inspect_contract
python -m scripts.verification.ingest_forecast_contract --decision-threshold 0.5
```

The current contract does not contain `valid_start_date` or `valid_end_date`.
The ingestion job derives them from:

```text
valid_start_date = issue_date + lead_week * 7 days
valid_end_date   = valid_start_date + 6 days
```

The contract SHA-256 hash is stored as `contract_hash`, so re-ingesting the same
JSON is idempotent and does not duplicate predictions.

The current contract has a `model` field such as `logistic_balanced_cal`. Store
that as `model_version`. If the selected experiment/feature set is known
outside the contract, pass it as `feature_set_name`, for example:

```bash
python -m scripts.verification.ingest_forecast_contract \
  --decision-threshold 0.5 \
  --feature-set-name baseline_mjo
```

This keeps algorithm/calibration identity (`model_version`) separate from the
ablation or feature-set label (`feature_set_name`) without changing the public
contract schema.

## Observation Ingestion

If actual observations are not yet produced by an automated job, provide:

```text
data/processed/observations_daily.csv
```

Required columns:

```text
province_id
province_name
date
observed_heatwave
tmax
t90_threshold
heat_index
source
```

Then run:

```bash
python -m scripts.verification.ingest_observations
```

`tmax_minus_t90` is derived during ingestion when `tmax` and `t90_threshold`
are present.

## Verification Job

Run:

```bash
python -m scripts.verification.verify
python -m scripts.verification.export_summary
```

The verification categories are:

```text
forecast_event=true  and observed_event=true  -> hit
forecast_event=true  and observed_event=false -> false_alarm
forecast_event=false and observed_event=true  -> miss
forecast_event=false and observed_event=false -> correct_negative
not enough observation data                  -> insufficient_observation
valid window not ended                       -> pending
```

The summary also separates pending reasons:

```json
{
  "pending_by_reason": {
    "window_not_ended": 385,
    "waiting_for_observations": 0,
    "insufficient_observation": 0
  }
}
```

`window_not_ended` means the forecast is still in the future. `waiting_for_observations`
means the window ended but no actual data has been ingested yet.
`insufficient_observation` means partial observation coverage is present but does
not meet the configured coverage threshold.

`forecast_event` is derived from:

```text
probability >= decision_threshold
```

## Frontend Display Rules

Use `docs/verification_summary.json` for accuracy widgets.

Show `pending` separately from verified results. Pending forecasts are not
correct and not wrong; their valid forecast window has not finished yet.

Recommended UI labels:

```text
Verified: included in accuracy metrics
Pending: waiting for future forecast window / observation data
Insufficient observation: valid window ended but actual data is incomplete
```

Recommended explanation:

```text
Accuracy is calculated only after the forecast valid window has ended and
observed weather data is available. Pending forecasts are not counted as
correct or incorrect.
```

Thai:

```text
ระบบจะประเมินความแม่นยำเฉพาะพยากรณ์ที่พ้นช่วงเวลาคาดการณ์แล้ว
และมีข้อมูลอากาศจริงพร้อมเท่านั้น รายการที่ยัง pending จะไม่ถูกนับว่า
“ถูก” หรือ “ผิด”
```

## LINE OA Display Rules

LINE OA should display the current forecast probability and risk level from
`docs/forecast_provinces.json`.

It should not show a forecast as wrong or right until verification exists in
`docs/verification_summary.json`.

Suggested message shape:

```text
จังหวัด: Bangkok
Lead: 2 สัปดาห์
ความน่าจะเป็น: 21.3%
ระดับความเสี่ยง: Elevated
สถานะ accuracy: pending until 2026-07-21
```

## Metrics

For verified predictions only:

```text
precision = hit / (hit + false_alarm)
recall    = hit / (hit + miss)
F1        = 2 * precision * recall / (precision + recall)
Brier     = mean((probability - observed_event)^2)
```

Additional rates:

```text
hit_rate         = hit / verified_count
false_alarm_rate = false_alarm / (false_alarm + correct_negative)
miss_rate        = miss / (miss + hit)
```

The summary export includes:

```text
overall metrics
metrics_by_lead_week
metrics_by_province
metrics_by_month
pending_count
verified_count
last_verified_at
```

## Supabase Production Schema

Apply:

```text
supabase/migrations/202607030001_heatwave_verification_loop.sql
```

The tables are:

```text
forecast_runs
forecast_predictions
observations
verification_results
```

The migration also defines aggregate metrics views by lead week, province, and
month. Tables have RLS enabled. Keep writes server-side only; do not expose
service-role credentials in frontend or LINE code.
