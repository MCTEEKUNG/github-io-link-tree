# Model Metrics

| feature_set               | model | split      | target    | n_features | n    | base_rate | precision | recall | f1     | tn  | fp | fn  | tp | roc_auc | pr_auc |
| ------------------------- | ----- | ---------- | --------- | ---------- | ---- | --------- | --------- | ------ | ------ | --- | -- | --- | -- | ------- | ------ |
| baseline                  | lgbm  | holdout    | target_l2 | 15         | 135  | 0.0000    | 0.0000    | 0.0000 | 0.0000 | 135 | 0  | 0   | 0  |         |        |
| baseline_mjo              | lgbm  | holdout    | target_l2 | 21         | 135  | 0.0000    | 0.0000    | 0.0000 | 0.0000 | 135 | 0  | 0   | 0  |         |        |
| baseline_mjo_nino34       | lgbm  | holdout    | target_l2 | 27         | 135  | 0.0000    | 0.0000    | 0.0000 | 0.0000 | 135 | 0  | 0   | 0  |         |        |
| baseline_mjo_nino34_super | lgbm  | holdout    | target_l2 | 28         | 135  | 0.0000    | 0.0000    | 0.0000 | 0.0000 | 135 | 0  | 0   | 0  |         |        |
| baseline_nino34           | lgbm  | holdout    | target_l2 | 21         | 135  | 0.0000    | 0.0000    | 0.0000 | 0.0000 | 135 | 0  | 0   | 0  |         |        |
| baseline                  | lgbm  | test       | target_l2 | 15         | 735  | 0.2912    | 0.3548    | 0.0514 | 0.0898 | 501 | 20 | 203 | 11 | 0.6891  | 0.3988 |
| baseline_mjo              | lgbm  | test       | target_l2 | 21         | 735  | 0.2912    | 0.4412    | 0.0701 | 0.1210 | 502 | 19 | 199 | 15 | 0.7151  | 0.4291 |
| baseline_mjo_nino34       | lgbm  | test       | target_l2 | 27         | 735  | 0.2912    | 0.6916    | 0.3458 | 0.4611 | 488 | 33 | 140 | 74 | 0.7097  | 0.5457 |
| baseline_mjo_nino34_super | lgbm  | test       | target_l2 | 28         | 735  | 0.2912    | 0.6701    | 0.3037 | 0.4180 | 489 | 32 | 149 | 65 | 0.7044  | 0.5552 |
| baseline_nino34           | lgbm  | test       | target_l2 | 21         | 735  | 0.2912    | 0.6981    | 0.3458 | 0.4625 | 489 | 32 | 140 | 74 | 0.6908  | 0.5320 |
| baseline                  | lgbm  | validation | target_l2 | 15         | 1096 | 0.3549    | 0.4380    | 0.1362 | 0.2078 | 639 | 68 | 336 | 53 | 0.6004  | 0.4136 |
| baseline_mjo              | lgbm  | validation | target_l2 | 21         | 1096 | 0.3549    | 0.3564    | 0.0925 | 0.1469 | 642 | 65 | 353 | 36 | 0.6129  | 0.4237 |
| baseline_mjo_nino34       | lgbm  | validation | target_l2 | 27         | 1096 | 0.3549    | 0.1538    | 0.0051 | 0.0100 | 696 | 11 | 387 | 2  | 0.6146  | 0.3954 |
| baseline_mjo_nino34_super | lgbm  | validation | target_l2 | 28         | 1096 | 0.3549    | 0.0526    | 0.0026 | 0.0049 | 689 | 18 | 388 | 1  | 0.6244  | 0.4023 |
| baseline_nino34           | lgbm  | validation | target_l2 | 21         | 1096 | 0.3549    | 0.0000    | 0.0000 | 0.0000 | 685 | 22 | 389 | 0  | 0.6254  | 0.4020 |

## Feature Importance

| feature                   | importance |
| ------------------------- | ---------- |
| sm1_mean30                | 1237       |
| sm3_mean30                | 1193       |
| sm3_trend                 | 956        |
| sm1_trend                 | 804        |
| mjo_rmm2                  | 726        |
| heat_index_c_mean7_lag1   | 709        |
| mjo_rmm1                  | 693        |
| tmax_minus_t90_mean7_lag1 | 647        |
| sm3_mean7                 | 621        |
| sm1_mean7                 | 612        |
| mjo_amp                   | 601        |
| dewpoint_c                | 585        |
| sm3                       | 577        |
| sm1                       | 538        |
| tmax_minus_t90_lag1       | 354        |
| relative_humidity         | 354        |
| heat_index_c_lag1         | 305        |
| hot_t90_mean7_lag1        | 206        |
| mjo_cos                   | 139        |
| mjo_sin                   | 130        |
| mjo_active                | 13         |
