# Toxicity Evidence

A research companion to **Toxicity Detection for Generative AI Systems: A Survey of Evidence and Governance Validity**, by Kun Xu, Yushu Zhang, Xiangli Xiao, Shuren Qi, Tao Wang, Barbara Carminati, Elena Ferrari, and Yuming Fang.

The survey asks when toxicity evidence can justify a particular action in a generative AI system. This companion makes the bibliography inspectable and turns the proposed SCOPE framework into reusable records. It does not add empirical safety results or certify systems.

Website: [xukun12138.github.io/toxicity-evidence/](https://xukun12138.github.io/toxicity-evidence/). Repository: [xukun12138/toxicity-evidence](https://github.com/xukun12138/toxicity-evidence).

## What you can do

- **Start with the overview:** the home page introduces the research question, an interactive SCOPE concept diagram, and direct routes to the paper, bibliography, worksheet, examples, and reusable materials.
- **Explore literature:** search 183 cited records by title, author, or text; filter by year or where a paper is cited in the manuscript; export the filtered selection as BibTeX, CSV, or JSON.
- **Build a SCOPE record:** specify a source result and target claim, assess policy, channel, observation, probability, and enforcement separately, and export the worksheet.
- **Inspect four worked profiles:** follow why functional accuracy, refusal detection, one-output risk, or static component screening does not automatically justify a stronger action claim.
- **Reuse protocols:** download a [transport-test protocol](downloads/transport-test-protocol.md), [governance reporting checklist](downloads/governance-checklist.md), [blank evidence card](data/evidence-card-template.json), and [populated examples](data/evidence-card-examples.json).
- **Trace provenance:** inspect source hashes, manuscript locations, original BibTeX, and known limitations rather than relying on a paper ranking.

Read the [manuscript](downloads/manuscript.pdf) for the complete argument. The companion is a resource snapshot associated with the manuscript, not a claim of exhaustive literature coverage.

## Preview locally

This is a static site with no build step. From the repository root, run:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. Use an HTTP server instead of opening `index.html` through `file://`, because the site loads its JSON data with browser requests. Stop the server with `Ctrl+C`.

The search and worksheet run in the browser. Worksheet entries are not submitted to this project's server. Export a record before closing or reloading the page; the page does not promise persistent storage. Following a third-party resource link or title search opens that external service under its own policies.

## Files

```text
index.html, style.css, app.js   Static interface
data/                          Bibliography, definitions, cases, provenance
downloads/                     Manuscript and editable protocols
tools/                         Reproducible data-generation scripts
.github/ISSUE_TEMPLATE/         Structured correction and resource proposals
```

The LaTeX project is an external input to the extraction tools and is not required to browse this repository. Personal filesystem paths and private source archives are not part of the public companion.

## Scope and interpretation

The manuscript's literature cutoff is **23 August 2026**. The companion snapshot is associated with the **24 September 2026** revision. These dates describe the review and resource version, not independent verification dates for every publication.

The latest manuscript states that all **183 cited works** contribute to its descriptive corpus maps. Its **113-work** channel–carrier subset is a specific figure subset. Unused preamble macros still contain older 181/180 totals; they do not define a separate synthesis corpus. See [reference metadata](data/reference-metadata.json) for the extraction counts and source hashes.

Important distinctions:

- **Citation locations are locations.** A section tag does not prove systematic coverage, study quality, a primary corpus stratum, or direct toxicity evidence.
- **Evidence roles belong to claims.** A methods paper can explain a mechanism without measuring the retained toxicity endpoint.
- **Status and quality are separate.** Direct means the claim stays within the evaluated domain; it does not mean the evidence is strong. SCOPE is a proposed appraisal framework requiring empirical validation.
- **Examples are illustrative.** The stronger claims in C1–C4 are constructed by the survey for analysis, not quotations from the cited authors. None demonstrates a completed empirical bridge. C3 specifies no action; C4 retains the original NSFW endpoint without asserting a mapping to targeted social harm.
- **Missing information stays missing.** The supplied bibliography contains no DOI or URL fields. Those fields remain null; title-search links are discovery aids, not verified paper links.

The resource does not reconstruct historical search/exclusion logs, a complete item-level verification log, independent recoding, or the publication-to-stratum assignments used in the manuscript figures. No aggregate safety score, leaderboard, or toxicity prevalence estimate is inferred from bibliography counts.

## Update the data

The scripts use Python 3.10+ and the standard library. Supply the external LaTeX project containing `manuscript.tex` and `sample-base.bib`:

```sh
python tools/extract_references.py --source /path/to/latex-project --out data
python tools/build_companion_data.py --source /path/to/latex-project --out data
```

The first script extracts active citations, ignoring comments, and regenerates the bibliography exports, section locations, and hashes. The second writes curated SCOPE definitions, four examples, and evidence-card assets while checking the source hash. Their summaries require human review if the substantive framework or cases change; rerunning a script cannot validate a new interpretation.

Review the resulting diff, confirm the keys and counts against the revised manuscript, check the original endpoint and source locations for every changed case, and preview the site. Do not label newly proposed resources part of the manuscript bibliography until the manuscript actually cites them. The scripts generate only their documented files; separately curated source-project links should be verified against primary project pages when updated.

## Corrections and contributions

Use the [issue tracker](https://github.com/xukun12138/toxicity-evidence/issues) for metadata corrections or proposed resources. Supply a primary source and exact evidence location. Read [CONTRIBUTING.md](CONTRIBUTING.md) before adding a claim-level record or changing a worked example.

## Citation

The paper is presented here as a research manuscript. No journal acceptance, DOI, volume, or page assignment is implied.

```bibtex
@unpublished{Xu2026ToxicityEvidence,
  title = {Toxicity Detection for Generative AI Systems: A Survey of Evidence and Governance Validity},
  author = {Xu, Kun and Zhang, Yushu and Xiao, Xiangli and Qi, Shuren and Wang, Tao and Carminati, Barbara and Ferrari, Elena and Fang, Yuming},
  year = {2026},
  note = {Research manuscript; companion snapshot 24 September 2026}
}
```

## Licensing by material

The website code and data-generation scripts are released under the MIT license in [LICENSE](LICENSE). That code license does **not** grant rights to the manuscript, figures, third-party papers, datasets, models, or project assets. The manuscript remains subject to its authors' and any applicable publisher rights. Bibliographic records preserve attribution and source information; third-party resources remain under their respective licenses. Consult those licenses before redistributing underlying materials. Links and citations do not transfer ownership or imply endorsement.
