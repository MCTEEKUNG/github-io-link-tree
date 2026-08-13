# Calibration Diagnostics

Generated at: 2026-07-25T14:05:17+00:00

## Status: DO_NOT_PROMOTE

This report is read-only. It does not replace production artifacts or change the forecast contract schema.

Higher ROC-AUC is useful, but it is not sufficient for promotion because the product serves probabilities and risk levels.
Public leads 2-4 must preserve probability skill and calibration versus production.

## Inputs

- Production pairs: `outputs\candidates\logistic_balanced_cal_v2_isotonic\production_comparable_pairs.csv`
- v2 Platt pairs: `outputs\candidates\logistic_balanced_cal_v2\candidate_pairs.csv`
- v2 Isotonic pairs: `outputs\candidates\logistic_balanced_cal_v2_isotonic\candidate_pairs.csv`

## Metrics By Model And Lead

| model_name | lead_week | n | base_rate | brier_score | brier_skill_score | roc_auc | ece | reliability_component | resolution_component | uncertainty_component |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| logistic_balanced_cal_v2_isotonic | 2 | 25179 | 0.198 | 0.137 | 0.179 | 0.789 | 0.065 | 0.007 | 0.027 | 0.159 |
| logistic_balanced_cal_v2_isotonic | 3 | 24101 | 0.197 | 0.161 | 0.036 | 0.767 | 0.068 | 0.021 | 0.017 | 0.158 |
| logistic_balanced_cal_v2_isotonic | 4 | 23023 | 0.195 | 0.148 | 0.103 | 0.742 | 0.083 | 0.012 | 0.019 | 0.157 |
| logistic_balanced_cal_v2_isotonic | 5 | 21945 | 0.187 | 0.157 | 0.012 | 0.737 | 0.052 | 0.020 | 0.011 | 0.152 |
| logistic_balanced_cal_v2_isotonic | 6 | 20867 | 0.188 | 0.141 | 0.114 | 0.744 | 0.036 | 0.004 | 0.012 | 0.152 |
| logistic_balanced_cal_v2_platt | 2 | 25179 | 0.198 | 0.137 | 0.184 | 0.792 | 0.079 | 0.009 | 0.031 | 0.159 |
| logistic_balanced_cal_v2_platt | 3 | 24101 | 0.197 | 0.140 | 0.158 | 0.767 | 0.075 | 0.008 | 0.025 | 0.158 |
| logistic_balanced_cal_v2_platt | 4 | 23023 | 0.195 | 0.146 | 0.117 | 0.742 | 0.106 | 0.016 | 0.028 | 0.157 |
| logistic_balanced_cal_v2_platt | 5 | 21945 | 0.187 | 0.141 | 0.111 | 0.757 | 0.104 | 0.017 | 0.028 | 0.152 |
| logistic_balanced_cal_v2_platt | 6 | 20867 | 0.188 | 0.137 | 0.141 | 0.777 | 0.102 | 0.016 | 0.031 | 0.152 |
| production_logistic_balanced_cal | 2 | 25179 | 0.198 | 0.143 | 0.145 | 0.725 | 0.053 | 0.005 | 0.020 | 0.159 |
| production_logistic_balanced_cal | 3 | 24101 | 0.197 | 0.142 | 0.149 | 0.731 | 0.061 | 0.005 | 0.021 | 0.158 |
| production_logistic_balanced_cal | 4 | 23023 | 0.195 | 0.145 | 0.121 | 0.733 | 0.086 | 0.014 | 0.026 | 0.157 |
| production_logistic_balanced_cal | 5 | 21945 | 0.187 | 0.140 | 0.121 | 0.743 | 0.090 | 0.015 | 0.027 | 0.152 |
| production_logistic_balanced_cal | 6 | 20867 | 0.188 | 0.136 | 0.145 | 0.753 | 0.085 | 0.010 | 0.026 | 0.152 |

## Lead-Specific Calibrator Selection

| lead_week | best_candidate_variant | candidate_bss | candidate_ece | candidate_auc | candidate_n | selection_reason |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | logistic_balanced_cal_v2_platt | 0.184 | 0.079 | 0.792 | 25179 | selected by BSS, then ECE, then AUC |
| 3 | logistic_balanced_cal_v2_platt | 0.158 | 0.075 | 0.767 | 24101 | selected by BSS, then ECE, then AUC |
| 4 | logistic_balanced_cal_v2_platt | 0.117 | 0.106 | 0.742 | 23023 | selected by BSS, then ECE, then AUC |
| 5 | logistic_balanced_cal_v2_platt | 0.111 | 0.104 | 0.757 | 21945 | selected by BSS, then ECE, then AUC |
| 6 | logistic_balanced_cal_v2_platt | 0.141 | 0.102 | 0.777 | 20867 | selected by BSS, then ECE, then AUC |

## Candidate Recommendation

| lead_week | best_candidate_variant | production_bss | candidate_bss | production_ece | candidate_ece | production_auc | candidate_auc | recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | logistic_balanced_cal_v2_platt | 0.145 | 0.184 | 0.053 | 0.079 | 0.725 | 0.792 | needs_more_evaluation |
| 3 | logistic_balanced_cal_v2_platt | 0.149 | 0.158 | 0.061 | 0.075 | 0.731 | 0.767 | needs_more_evaluation |
| 4 | logistic_balanced_cal_v2_platt | 0.121 | 0.117 | 0.086 | 0.106 | 0.733 | 0.742 | needs_more_evaluation |
| 5 | logistic_balanced_cal_v2_platt | 0.121 | 0.111 | 0.090 | 0.104 | 0.743 | 0.757 | needs_more_evaluation |
| 6 | logistic_balanced_cal_v2_platt | 0.145 | 0.141 | 0.085 | 0.102 | 0.753 | 0.777 | needs_more_evaluation |

## Reliability Bins

Full bin table written to `reports\calibration_bins_by_lead.csv`.
Rows include 150 model/lead/bin combinations with empty bins preserved.

## Brier Decomposition

Full decomposition table written to `reports\brier_decomposition_by_lead.csv`.
Murphy decomposition is reported as reliability, resolution, uncertainty, and the residual needed to match the exact Brier Score.
