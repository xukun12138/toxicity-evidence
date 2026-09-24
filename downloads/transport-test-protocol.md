# SCOPE transport-test protocol

Use this worksheet to plan a comparison before extending a result to a new policy, channel, observation unit, probability regime, or action. It operationalizes the proposal in the survey's Sections 3.1–3.3 and the domain-specific evaluation discussions in Sections 4–10. It is not a completed study or a validated certification standard.

Replace each `TO COMPLETE`. Keep unknowns explicit. A proposed test cannot be marked as a successful empirical bridge.

## 1. State the inference

| Field | Record |
| --- | --- |
| Protocol ID and version | TO COMPLETE |
| Responsible investigator / reviewer | TO COMPLETE |
| Source paper, version, and exact evidence location | TO COMPLETE |
| Original result and uncertainty | TO COMPLETE |
| Original endpoint, including exclusions | TO COMPLETE |
| Supported source claim | TO COMPLETE |
| Proposed target claim and action | TO COMPLETE |
| Why this extension matters | TO COMPLETE |

Do not attribute a constructed stronger claim to the original authors. If the source measures an adjacent endpoint such as NSFW content, retain that name; document a category-level mapping before interpreting it as targeted social harm.

## 2. Compare the five coordinates

| Coordinate | Source condition | Target condition | Held fixed or changed? | Evidence needed |
| --- | --- | --- | --- | --- |
| **S — Safety policy**: categories, target, context, severity, benign-sensitive cases | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |
| **C — Control channel and carrier**: access routes, actor, components, composition | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |
| **O — Observation and adjudication unit**: event, information available, judge | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |
| **P — Probability regime**: population, sampling, version, attack, budget, stopping | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |
| **E — Enforcement action**: threshold, loss, review capacity, safeguards | TO COMPLETE | TO COMPLETE | TO COMPLETE | TO COMPLETE |

List all jointly changed coordinates: `TO COMPLETE`. Evidence for separate coordinate changes does not automatically validate their combination.

## 3. Prespecify the comparison

| Design choice | Record before examining comparative results |
| --- | --- |
| Source and target model / guard / component fingerprints | TO COMPLETE |
| Endpoint and policy crosswalk; excluded or indeterminate categories | TO COMPLETE |
| Population, inclusion rules, languages, and policy-relevant slices | TO COMPLETE |
| Matched cases and conditions; explanation where matching is impossible | TO COMPLETE |
| Harmful cases and benign-sensitive controls | TO COMPLETE |
| Threshold or decision rule being evaluated | TO COMPLETE |
| Primary error or loss measure, direction, and denominator | TO COMPLETE |
| Acceptable degradation, **δ**, with policy or operational justification | TO COMPLETE |
| Absolute error or loss requirement for the target action | TO COMPLETE |
| Sampling unit, planned size, and precision rationale | TO COMPLETE |
| Seeds, repeat count, query budget, and stopping rule | TO COMPLETE |
| Analysis method and uncertainty interval | TO COMPLETE |
| Missing observations, technical failures, and exclusions | TO COMPLETE |

Prespecify harmful misses and benign-sensitive false positives separately. A bound supporting δ addresses transport; preserving an inadequate source result still cannot justify the target action.

## 4. Audit observation and adjudication

- [ ] The judged event matches the target claim: output, session, repeated-access event, or executed composition.
- [ ] Judges receive the context needed by the policy, with the same information available to a deployed decision when timing matters.
- [ ] Request harmfulness, response harmfulness, refusal occurrence, and refusal appropriateness remain distinct where relevant.
- [ ] Judge rules are frozen before inspecting comparative results.
- [ ] Shared data or models across generator, attacker, reward model, guard, and final judge are recorded.
- [ ] An independently adjudicated subset includes predicted-safe and predicted-unsafe cases, with system identities concealed where feasible.
- [ ] Indeterminate cases and substantive annotator disagreement are retained.
- [ ] Sampling weights are recorded if severe, ambiguous, or disagreement cases are oversampled.

Judge audit and error estimates: `TO COMPLETE`.

## 5. Preserve units and access assumptions

Complete the relevant rows; mark others **not applicable** with a reason.

| Setting | Required accounting |
| --- | --- |
| Repeated generation | Distinguish unique prompts, outputs per prompt, total outputs, and sessions. Quantify uncertainty at the prompt or session level where outputs are dependent. |
| Adaptive search | State actor access, optimization unit, budget, stopping, failures, and success adjudication. A discovered counterexample establishes reachability under those conditions, not deployment prevalence. |
| Multi-turn decisions | Evaluate prefixes available at each decision point; record intervention time and harmful information already released. |
| Filter / regeneration stack | Count all attempted requests; distinguish rejected requests, exhausted regeneration budgets, technical failures, delivered harm, and harm among delivered outputs. |
| Component composition | Record bases, tokenizers/loaders, component order and strength, triggers, co-components, seeds, and admissible execution settings. Audit scanner-selected and scanner-cleared files. |
| Human review | Compare automated and human decisions on the actual routed cases; include reviewer error, waiting time, exposure, and unequal burdens. |

Selected accounting and assumptions: `TO COMPLETE`.

The conversion `1 − (1 − r)^n` concerns fixed independent trials at a stated configuration. Do not substitute adaptive or dependent attempts into it without an appropriate analysis. An empirical maximum is not the unrestricted adversarial supremum.

## 6. Record results without expanding the claim

| Result | Value / evidence location |
| --- | --- |
| Source and target sample counts, exclusions, and failures | TO COMPLETE |
| Harmful misses with uncertainty | TO COMPLETE |
| Benign-sensitive false positives with uncertainty | TO COMPLETE |
| Difference in the prespecified error or loss measure with uncertainty | TO COMPLETE |
| Judge error and sensitivity analysis | TO COMPLETE |
| Policy / language / group / channel slices | TO COMPLETE |
| Target absolute requirement met? Evidence | TO COMPLETE |
| Tolerance δ supported, contradicted, or unresolved? | TO COMPLETE |
| Limitations and untested joint changes | TO COMPLETE |

An inconclusive interval does not establish equivalence. Zero observed failures do not imply zero risk; any non-discovery bound must state sampling, independence, adjudication, and stopping assumptions.

## 7. Issue a bounded conclusion

**What the comparison supports:** `TO COMPLETE`.

**Which extension remains unsupported or unreported:** `TO COMPLETE`.

**S / C / O / P / E status and reason:** `TO COMPLETE`.

**Action, safeguards, accountable owner, and expiry:** `TO COMPLETE`.

**Retest triggers:** `TO COMPLETE` (for example, material policy, model, interface, component, composition, or adversarial-access changes).

Direct, bridged, unsupported, and unreported describe coordinate support. Keep judge validity, precision, coverage, and replication as separate evidence-quality judgments.
