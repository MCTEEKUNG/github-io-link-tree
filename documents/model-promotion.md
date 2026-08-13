# Model Promotion Workflow

## Current Production Rule

The production frontend and LINE OA do not run model code. They only fetch the
static forecast contract:

```text
docs/forecast_provinces.json
-> GitHub Pages
-> Vercel frontend / LINE OA
```

The currently deployed production-serving model is:

- `model`: `logistic_balanced_cal`
- artifacts: `models/heatwave_prov_lead2.pkl` through `models/heatwave_prov_lead6.pkl`
- geography: 77 provinces
- contract leads: 2, 3, 4, 5, 6
- public display leads: 2, 3, 4

## Research Artifact vs Production-Serving Model

A research artifact is a model produced by the experimentation pipeline. It may
be useful evidence, but it is not automatically deployable.

The current refreshed research candidate is:

- feature set: `baseline_mjo`
- algorithm: LightGBM
- artifact: `models/best_model.pkl`
- target: `target_l2`
- scope: modeling-table research artifact

It is not production yet because it does not currently provide the full
province-level serving surface required by production:

- 77-province forecast output
- public leads 2, 3, and 4
- compatible `forecast_provinces.json`
- operational backtest scorecard using the same verification style as production
- province-level stability evidence

## Why Production Is Still `logistic_balanced_cal`

`logistic_balanced_cal` is the model family currently wired into the operational
province forecast pipeline. It has:

- one artifact per served lead week
- calibrated probabilities
- province-level base rates
- historical operational verification outputs
- a passing forecast contract and readiness gate

Until a candidate model proves it can satisfy the same operational contract and
match or beat the production evidence, production should remain on
`logistic_balanced_cal`.

## Why Public Display Uses Leads 2-4

The contract keeps leads 2-6 so verification and backtesting can continue across
the full horizon. Public UX should display only leads 2-4 because the operational
backtest supports those leads most clearly:

- Lead 2: strong skill
- Lead 3: strong skill
- Lead 4: modest but positive skill
- Lead 5: no operational skill in the current OOS backtest
- Lead 6: positive BSS but weak discrimination

This avoids showing weak long-range warnings as if they were equally actionable.

## Research Validation vs Operational Backtest

Research validation answers: "does this feature set/model look promising on the
modeling table under a time-based split?"

Operational backtest answers: "if this model had issued province-level forecasts
on historical issue dates, would those forecasts have verified correctly after
their future valid windows closed?"

Production promotion must use the second question. A high validation PR-AUC on
`target_l2` is useful, but it is not enough to replace the production model
because production requires:

- province-level rows for all 77 provinces
- lead-specific forecast windows derived from `issue_date`
- public leads 2, 3, and 4
- probabilities calibrated enough to beat production Brier/BSS/ECE
- stable province-level behavior
- a compatible `forecast_provinces.json` serving surface

## Candidate Operational Backtest Command

Prepare candidate operational evidence with:

```bash
python scripts/candidate_operational_backtest.py
```

Default outputs:

```text
reports/candidate_operational_backtest.md
reports/candidate_operational_scorecard.csv
reports/candidate_vs_production.csv
reports/candidate_province_stability.csv
```

The default command evaluates the current `models/best_model.pkl`. Because the
current `baseline_mjo` artifact is still only `target_l2` and not province-level,
the expected status is:

```text
NOT_COMPATIBLE
```

For a future compatible candidate, provide operational forecast pairs:

```bash
python scripts/candidate_operational_backtest.py \
  --candidate-artifact models/candidate_prov.pkl \
  --candidate-pairs outputs/candidate_verification/pairs.csv \
  --candidate-contract outputs/candidate_forecast_provinces.json \
  --candidate-supported-leads 2,3,4,5,6 \
  --candidate-geography "province-level serving"
```

`--candidate-pairs` must contain:

```text
issue_date, province_id, lead, probability, base_rate, y_obs
```

Optional but supported:

```text
valid_start_date, valid_end_date
```

If valid-window dates are absent, the command derives:

```text
valid_start_date = issue_date + lead * 7 days
valid_end_date   = valid_start_date + 6 days
```

The command reports:

- compatibility checks
- metrics by lead
- Brier Score
- Brier Skill Score
- ROC-AUC
- ECE
- reliability bins with observed event rate by probability bin
- province-level stability summary
- candidate vs production comparison on public leads 2-4

Backtest status values:

- `NOT_COMPATIBLE`: missing province scope, public leads, valid probabilities,
  compatible forecast rows, leakage/freshness pass, or package metadata.
- `NEEDS_MORE_EVALUATION`: candidate is structurally plausible but lacks
  operational scorecard evidence, or improves some public leads while degrading
  others.
- `COMPATIBLE_NOT_BETTER_THAN_PRODUCTION`: candidate is compatible but does not
  beat or match production on public-lead metrics.
- `READY_FOR_PROMOTION_REVIEW`: candidate is compatible and beats or matches
  production on public leads 2-4, subject to human review.

## Promotion Readiness Command

Run the default report for the current research candidate:

```bash
python scripts/model_promotion_readiness.py
```

Default output:

```text
reports/model_promotion_readiness.md
```

By default, this command now reads the candidate backtest outputs:

```text
reports/candidate_operational_scorecard.csv
reports/candidate_province_stability.csv
```

If those files are missing or empty, promotion readiness remains
`DO_NOT_PROMOTE` or `NEEDS_MORE_EVALUATION` depending on the other gates.

For a future province-level candidate, provide its operational evidence:

```bash
python scripts/model_promotion_readiness.py \
  --candidate-artifact models/candidate_prov.pkl \
  --candidate-scorecard outputs/candidate_verification/scorecard.csv \
  --candidate-province-metrics outputs/candidate_verification/province_metrics.csv \
  --candidate-contract outputs/candidate_forecast_provinces.json \
  --candidate-model-name candidate_model_v1 \
  --candidate-feature-set-name baseline_mjo_nino34 \
  --candidate-supported-leads 2,3,4,5,6 \
  --candidate-geography "province-level serving" \
  --out reports/model_promotion_readiness_candidate_v1.md
```

## Promotion Status Values

`PROMOTE`

All hard gates pass, operational metrics beat or match production on public
leads 2-4, and province-level stability is demonstrated.

`DO_NOT_PROMOTE`

At least one hard gate fails. Examples:

- not province-level
- missing public leads 2-4
- incompatible forecast contract
- leakage failure
- freshness failure
- degradation on public lead BSS, AUC, or ECE

`NEEDS_MORE_EVALUATION`

The model is plausible but lacks required evidence, such as an operational
scorecard or province-level stability report.

## Required Promotion Evidence

A candidate must include:

- candidate model name
- candidate feature set name
- algorithm
- artifact path
- target definition
- supported leads
- geography/scope
- training data min/max date
- package versions
- leakage check status
- data freshness status
- operational backtest metrics
- province-level stability metrics
- compatible `forecast_provinces.json` output

Before replacing `logistic_balanced_cal`, the candidate must have a candidate
operational backtest report with `READY_FOR_PROMOTION_REVIEW` and a promotion
readiness report with `PROMOTE`.

## Metric Criteria

For public leads 2, 3, and 4, the candidate should beat or match production on:

- Brier Skill Score (higher is better)
- AUC/discrimination (higher is better)
- ECE/calibration (lower is better)

The candidate must not degrade public leads 2-4 even if it improves hidden leads
5-6.

Higher AUC alone is not enough for promotion. AUC only says whether the model
ranks higher-risk cases above lower-risk cases. The product serves probability
values and risk levels to users, so the probability scale itself must also be
trustworthy. A candidate with better AUC but worse Brier Skill Score or worse ECE
can still create misleading public risk levels.

Before replacing `logistic_balanced_cal`, public leads 2-4 must show probability
skill and calibration that are at least as good as production:

- BSS must not degrade on any public lead.
- ECE must not degrade on any public lead.
- AUC should beat or match production, but it is a tie-breaker only after
  probability skill and calibration are acceptable.

## Calibration Diagnostics

Use the calibration diagnostics report to compare production against candidate
calibration variants side by side:

```bash
python scripts/calibration_diagnostics.py
```

Default outputs:

```text
reports/calibration_diagnostics.md
reports/calibration_bins_by_lead.csv
reports/brier_decomposition_by_lead.csv
```

The diagnostics compare:

- `production_logistic_balanced_cal`
- `logistic_balanced_cal_v2_platt`
- `logistic_balanced_cal_v2_isotonic`

For each model and lead, the report includes:

- Brier Score
- Brier Skill Score
- ROC-AUC
- ECE
- reliability component
- resolution component
- uncertainty component
- base rate
- n

The lead-specific calibrator selection ranks candidate calibrators by:

1. BSS first
2. ECE second
3. AUC as tie-breaker
4. minimum sample-size threshold

The recommendation table is intentionally conservative:

- `candidate_promising`: candidate beats or matches production on BSS, ECE, and
  AUC for that lead.
- `needs_more_evaluation`: candidate improves some evidence, such as AUC, but
  still has probability skill or calibration degradation.
- `keep_production`: candidate loses the main probability-skill comparison.

## Shadow Candidates

A shadow candidate is a forecast contract that is ingested into the backend
verification loop for evaluation, but is not published as the public forecast.
This lets the team collect operational evidence for candidate models without
changing what users see.

Shadow runs are distinguished from production by:

- `forecast_runs.status = shadow`
- `model_version`
- `feature_set_name`
- `contract_url` or local contract path in the run metadata/report
- `contract_hash`

Example:

```bash
python scripts/verification/ingest_forecast_contract.py \
  --contract outputs/candidates/logistic_balanced_cal_v2/forecast_provinces.json \
  --run-status shadow \
  --model-version logistic_balanced_cal_v2_platt \
  --feature-set-name province_plus_lagged_thermal_nino34_v2
```

Shadow forecasts may be verified using the same observation and verification
jobs as production. The difference is serving: shadow forecasts must not be
exported to `docs/forecast_provinces.json`, GitHub Pages, Vercel, or LINE OA.
They are backend evidence only.

The public verification summary excludes shadow runs by default:

```bash
python -m scripts.verification.export_summary
```

Internal comparison exports can explicitly include shadow candidate comparison:

```bash
python -m scripts.verification.export_summary --include-shadow \
  --out reports/internal_verification_with_shadow.json
```

If the live Supabase/Postgres schema has a status check constraint that does
not include `shadow`, add a small migration before ingesting shadow runs into
Supabase. The local SQLite verification store already supports `shadow`.

## Probability Repair / Blending

Probability repair is a report-only experiment for improving the probability
scale of a candidate without changing the production model. The current blend
experiment tests:

```text
p_blend = alpha_lead * p_v2_platt + (1 - alpha_lead) * p_production
```

Alpha is selected separately per lead on a calibration window only, then scored
on a later held-out operational evaluation window. This prevents choosing alpha
from the same rows used to report the final result.

Run:

```bash
python scripts/probability_repair_experiment.py
```

Default outputs:

```text
reports/probability_repair_experiment.md
reports/probability_repair_scorecard.csv
reports/lead_specific_blend_weights.csv
reports/shadow_candidate_status.md
```

The repair experiment may report:

- `DO_NOT_PROMOTE`
- `NEEDS_MORE_EVALUATION`
- `CANDIDATE_PROMISING_FOR_REVIEW`

It never changes promotion status automatically. A blend is only promising if:

- no public lead 2, 3, or 4 degrades BSS versus production
- no public lead 2, 3, or 4 degrades ECE beyond tolerance
- probabilities remain in `[0, 1]`
- public lead metrics are stable by province group/region
- candidate contracts remain compatible

Production remains `logistic_balanced_cal` until there is a formal promotion
decision and the production artifacts/contract metadata are intentionally
updated.

## Future Contract Metadata

Do not change the current production contract schema without a planned
migration. When a future model is actually promoted, include the following
metadata in the promoted contract or its release manifest:

```json
{
  "model_version": "candidate_model_v1",
  "feature_set_name": "baseline_mjo_nino34",
  "training_data_max_date": "YYYY-MM-DD",
  "evaluation_report": "reports/model_promotion_readiness_candidate_v1.md",
  "promoted_at": "YYYY-MM-DDTHH:MM:SSZ",
  "git_commit_sha": "...",
  "package_versions": {
    "python": "...",
    "pandas": "...",
    "numpy": "...",
    "scikit-learn": "...",
    "lightgbm": "...",
    "xarray": "..."
  },
  "contract_hash": "sha256..."
}
```
