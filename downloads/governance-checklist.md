# Governance reporting checklist

Use this fillable record to connect a toxicity evaluation to a specific decision and its continuing review. It draws on the survey's SCOPE reporting table, action-evidence table, component-assurance table, and Sections 8–10. Its requirements are proposed safeguards, not universal deployment thresholds or a validated certification standard.

For each item, record evidence or mark **unknown**, **not tested**, or **not applicable** with a reason. A checked box means the information is documented; it does not by itself show that a system is safe.

## Record identity

| Field | Value |
| --- | --- |
| Record ID / version / date | TO COMPLETE |
| Target claim and intended use | TO COMPLETE |
| System / model / guard / component versions | TO COMPLETE |
| Policy version and policy owner | TO COMPLETE |
| Evaluation owner and independent reviewer | TO COMPLETE |
| Intended action and action owner | TO COMPLETE |
| Evidence locations | TO COMPLETE |
| Review date / expiry / retest triggers | TO COMPLETE |

## 1. Define the policy event

- [ ] Harm categories, affected targets, context, severity, and exclusions are explicit.
- [ ] Benign-sensitive uses such as quotation, counterspeech, clinical discussion, or reclaimed language are represented where relevant.
- [ ] Source and target category mappings preserve exclusions and indeterminate cases.
- [ ] Adjacent safety labels are not silently pooled as toxicity.
- [ ] Annotator instructions, perspectives, disagreement, and adjudication are recorded.

Evidence and unresolved policy questions: `TO COMPLETE`.

## 2. Bind the evidence to the executed system

- [ ] The record names exposed prompts, history, image, retrieval, tool, decoding, fine-tuning, and component channels relevant to the claim.
- [ ] Available information and observation unit match the governed event and intervention timing.
- [ ] Population, input distribution, languages, sample units, seeds, versions, budgets, stopping, and uncertainty are documented.
- [ ] Detector, judge, guard, and mitigation roles are distinguished.
- [ ] Shared data or models across generation, attacks, training rewards, guards, and evaluation are disclosed.
- [ ] Untested channels, compositions, populations, and access regimes remain explicitly outside the claim.

Configuration fingerprint and residual gaps: `TO COMPLETE`.

## 3. Validate the decision-relevant measurement

- [ ] Harmful misses and benign-sensitive false positives are reported at the intended threshold, with uncertainty.
- [ ] Calibration is evaluated for the actual output, session, or budgeted event used in the decision.
- [ ] Relevant policy, language, group, and channel slices are reported without hiding sparse-sample uncertainty.
- [ ] Independent adjudication audits predicted-safe and predicted-unsafe cases, with selection probabilities when needed.
- [ ] Request harm, output harm, refusal detection, and refusal appropriateness remain separate outcomes.
- [ ] Discrimination, calibration, semantic uncertainty, and harmful-event probability are not treated as interchangeable.

Evidence quality, known judge errors, and unmeasured quantities: `TO COMPLETE`.

## 4. Specify the action and its consequences

Selected action(s): `allow / annotate / warn / regenerate / refuse / block / abstain / human review / restrict component / monitor / other: TO COMPLETE`.

| Decision field | Record |
| --- | --- |
| Threshold or routing rule and its rationale | TO COMPLETE |
| Miss cost, false-alarm cost, severity, and affected groups | TO COMPLETE |
| Reversibility, exceptions, appeal, and escalation | TO COMPLETE |
| Review capacity, reviewer expertise, error, delay, and exposure | TO COMPLETE |
| Automated versus reviewed subsets and their conditional losses | TO COMPLETE |
| Utility, service denial, and regeneration / retry burden | TO COMPLETE |
| Why the evidence is sufficient for this action | TO COMPLETE |
| Which stronger action remains unsupported | TO COMPLETE |

- [ ] Review is evaluated on the cases actually routed to it, not assumed perfect.
- [ ] Improved performance on the unreviewed subset is not presented as improved total workflow performance without joint evidence.
- [ ] Changing capacity or routing is assessed as a change to subset composition and losses, not just mixture weights.
- [ ] Abstention that withholds an automated decision is distinguished from assigning a human reviewer.

## 5. If components are governed

Mark this section **not applicable** if the claim involves no reusable component.

- [ ] Identity, integrity, parser/tensor schema, and claimed base compatibility are recorded separately from semantic or behavioral evidence.
- [ ] Static similarity is used only within its tested meaning; it is not assumed to be calibrated toxicity probability or release assurance.
- [ ] Tested bases, loaders/tokenizers, order, scales, triggers, co-components, and seeds define an admissible activation envelope.
- [ ] Executed behavioral audits include selected and cleared files, with benign controls.
- [ ] Suppression, preserved utility, prompt recovery, component changes, and relearning are distinguished where relevant.
- [ ] Access restrictions are enforceable under the recipient's actual ability to change weights or remove a mitigation.
- [ ] Attestation is configuration-bound and includes expiry, quarantine, revocation, and retest conditions.

Component-specific evidence and release boundary: `TO COMPLETE`.

## 6. Monitor with an observation plan

- [ ] Allowed, blocked, and deferred cases are covered by an audit plan with recorded selection probabilities and appropriate access safeguards.
- [ ] Exposure denominators and policy versions remain comparable over time.
- [ ] Appeals, incidents, severe misses, subgroup burdens, reviewer disagreement, and overturns have named owners.
- [ ] Selected complaints or appealed removals are not treated as an unbiased sample of all outcomes.
- [ ] Reduced incident counts after stricter blocking are not automatically interpreted as better detection.
- [ ] Material policy, interface, model, component, or adversarial changes trigger new evidence or a narrower reuse claim.
- [ ] The responsible owner can initiate retesting, recalibration, annotation, quarantine, revocation, or policy review.

| Signal | Sampling / denominator | Trigger | Owner | Response / deadline |
| --- | --- | --- | --- | --- |
| TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |
| TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |

## 7. State the claim that remains

**Supported claim:** `TO COMPLETE`.

**S / C / O / P / E support status and reasons:** `TO COMPLETE`.

**Unreported evidence versus demonstrated failure:** `TO COMPLETE`.

**Residual uncertainty, limits, and next comparison:** `TO COMPLETE`.

**Owner sign-off and next review:** `TO COMPLETE`.

Completing this record does not establish policy legitimacy, future robustness, or operational benefit. Those remain separate questions requiring appropriate evidence.
