# Contributing

Help improve the resource by correcting metadata, adding a verified primary link, proposing a relevant resource, or improving a claim-level record. This repository is a companion to a specific survey snapshot; it is not an automatically expanding claim of exhaustive coverage.

## Metadata correction

Use the **Metadata correction** issue form. Provide the existing bibliography key, the exact field, the current and proposed values, and a primary publication record supporting the change. Distinguish publication year from preprint posting year, and identify which version is being cited. Do not replace a missing paper URL with an unlabeled search result.

## Resource proposal

Use the **Propose a resource** form. Include the publication title, authors, year, primary paper or project URL, relationship to the survey, and the intended endpoint. Distinguish a toxicity experiment from a contextual safety mechanism. A proposal is not automatically added to the manuscript's bibliography count or assigned a support status.

## Claim-level records

Start from `data/evidence-card-template.json`. A useful record states:

1. A specific source result with its exact section, table, or artifact location.
2. The original policy endpoint, tested object/configuration, observation unit, and sampling or attack regime.
3. A specific target claim and action, with changed SCOPE coordinates identified.
4. A reason for each support status, separately from evidence-quality limitations.
5. The missing comparison or completed transport evidence, including tolerance and uncertainty when bridged support is proposed.

Preserve unknowns, indeterminate cases, sampling denominators, benign-sensitive controls, and endpoint differences. Do not infer that an unreported property failed, that a static signal certifies release, or that a low score establishes zero risk. Do not attribute a constructed extension to a source author. Clearly mark a new worked example as an illustration until its interpretation has been reviewed.

## Code or data pull requests

- Keep changes small and explain the concrete correction or user benefit.
- State the source and evidence location for factual changes.
- Regenerate derived bibliography data from the external LaTeX source when appropriate; preserve provenance hashes and citation keys.
- Keep manuscript changes separate from companion-only changes. The website does not silently revise the paper's scientific claims.
- Preview the static site over HTTP and check search, filters, exports, navigation, and relevant downloads for affected functionality.
- Include no credentials, private correspondence, personal filesystem paths, or unlicensed source archives.
- Respect the separate rights of manuscript, figures, and third-party materials. The site's code license does not license their underlying content.

Maintainer review should check accuracy, endpoint consistency, provenance, and usefulness. Acceptance of a resource does not constitute endorsement of its safety claims or implementation.
