# Model Promotion Readiness Report

Generated at: 2026-07-03T13:06:35+00:00

## Status: DO_NOT_PROMOTE

This report is read-only. It does not train, publish, replace artifacts, or change the current forecast contract schema.

## Candidate Model

| Field | Value |
|---|---|
| Model name | `logistic_balanced_cal_v2_isotonic` |
| Feature set | `province_plus_lagged_thermal_nino34_v2_isotonic` |
| Algorithm | LogisticRegression(class_weight=balanced) + Isotonic calibration |
| Artifact | `models\candidates\logistic_balanced_cal_v2_isotonic_lead2.pkl` |
| Target definition | province weekly heatwave event by lead week |
| Supported leads | [2, 3, 4, 5, 6] |
| Geography/scope | province-level serving |
| Training data min date | 1994-01-30 |
| Training data max date | 2023-07-31 |
| Feature count | unknown |

## Current Production Model

| Field | Value |
|---|---|
| Model name | `logistic_balanced_cal` |
| Feature set | `production_province_features` |
| Algorithm | Logistic regression + class balancing + calibration |
| Artifact | `models/heatwave_prov_lead2.pkl ... models/heatwave_prov_lead6.pkl` |
| Target definition | province weekly heatwave event by lead week |
| Supported leads | [2, 3, 4, 5, 6] |
| Geography/scope | 77 provinces |
| Training data min date | unknown |
| Training data max date | unknown |
| Feature count | 28 |

## Promotion Gates

| Gate | Status | Detail |
|---|---|---|
| province_serving | PASS | candidate declares province-level serving scope |
| supported_public_leads | PASS | candidate supports public leads 2, 3, 4 |
| contract_compatibility | PASS | candidate contract validates: outputs\candidates\logistic_balanced_cal_v2_isotonic\forecast_provinces.json |
| leakage | PASS | leakage report passed: reports\feature_leakage_report.md |
| freshness | PASS | freshness report has no stale rows: reports\data_freshness_report.md |
| province_stability | FAIL | unstable province BSS: median=0.062, bad_frac=32.9% |
| operational_backtest | NEEDS_MORE_EVALUATION | mixed public-lead result; degradation needs review: L2 ece, L3 bss, L3 ece, L4 bss |

## Operational Metric Comparison

Promotion requires the candidate to beat or match production on public leads 2-4.

| Lead | Metric | Candidate | Production | Pass? |
|---:|---|---:|---:|---|
| 2 | bss | 0.179436 | 0.145083 | yes |
| 2 | auc | 0.788944 | 0.725466 | yes |
| 2 | ece | 0.065380 | 0.053061 | no |
| 3 | bss | 0.035771 | 0.149175 | no |
| 3 | auc | 0.767111 | 0.731277 | yes |
| 3 | ece | 0.067598 | 0.060798 | no |
| 4 | bss | 0.102734 | 0.121134 | no |
| 4 | auc | 0.741680 | 0.732698 | yes |
| 4 | ece | 0.083309 | 0.085958 | yes |

## Package Versions

| Package | Version |
|---|---|
| python | `3.12.10` |
| pandas | `3.0.1` |
| numpy | `2.4.2` |
| scikit-learn | `1.8.0` |
| lightgbm | `4.6.0` |
| xarray | `2025.11.0` |

## Artifact Inspection Warning

could not inspect pickle metadata: Can't get attribute 'IsotonicCandidateCalibrator' on <module '__main__' from 'C:\\Users\\ASUS\\DeepSeek_Heatwave\\scripts\\model_promotion_readiness.py'>

## Future Contract Metadata

If a candidate is promoted in a future schema migration, include this metadata in the promoted contract or its release manifest:

```json
{
  "model_version": "logistic_balanced_cal_v2_isotonic",
  "feature_set_name": "province_plus_lagged_thermal_nino34_v2_isotonic",
  "training_data_max_date": "2023-07-31",
  "evaluation_report": "reports\\model_promotion_readiness.md",
  "promoted_at": "2026-07-03T13:06:35.701888+00:00",
  "git_commit_sha": "b30538569b62db0f6402f41ff8582a63d9f6e91a",
  "package_versions": {
    "python": "3.12.10",
    "pandas": "3.0.1",
    "numpy": "2.4.2",
    "scikit-learn": "1.8.0",
    "lightgbm": "4.6.0",
    "xarray": "2025.11.0"
  },
  "contract_hash": "84fa4b99d601f99264a2f1a507990fd5db2d5d7635c5841f80f579a02b33749a"
}
```

## Decision Rule

- `PROMOTE`: all hard gates pass, operational metrics beat or match production on public leads 2-4, and province-level stability is demonstrated.
- `DO_NOT_PROMOTE`: any hard compatibility, leakage, freshness, or public-lead metric gate fails.
- `NEEDS_MORE_EVALUATION`: the candidate is plausible but lacks required operational evidence.
