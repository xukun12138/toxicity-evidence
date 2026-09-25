# SCOPE companion data

This package turns the supplied survey into searchable references, an explicit claim-appraisal vocabulary, and reusable evidence records. It adds no empirical experiment, paper-level evidence rating, or certification claim.

## Data files

| File | Contents and intended use |
| --- | --- |
| `references.json` | All 183 uniquely cited works. Filter by publication year or **citation location**; search title, author, venue, and key. Every record includes the exact source BibTeX. |
| `references.csv` | Portable bibliography table with manuscript section locations. |
| `references.bib` | Original BibTeX records for actually cited works, in first-citation order. |
| `reference-metadata.json` | Source hashes, extraction counts, missing-link policy, and corpus-count notes. |
| `manuscript-sections.json` | Numbered first-level sections, labels, and source lines. |
| `scope-definitions.json` | Five coordinates, support-status definitions, evidence roles, failure classes, and framework limits. |
| `worked-cases.json` | The four illustrative claim extensions in §3.3, with source endpoints, reasoning, limitations, and proposed transport tests. |
| `evidence-card-template.json` | Blank reusable record for a specific claim and its proposed extension. |
| `evidence-card-examples.json` | Four populated illustrations using the same record shape. These are manuscript summaries, not independent study audits. |
| `evidence-card.schema.json` | JSON Schema for the record shape and coordinate-status vocabulary. Structural validation is not substantive validation. |
| `authors.json` | Public author profiles, academic contact details, portrait thumbnails and original source URLs, image hashes, and primary sources; independently dated from the literature snapshot. |

## What the counts mean

The latest manuscript's body states that **all 183 cited works** are included in its descriptive corpus maps. Active-citation extraction finds 183 unique keys in 165 citation commands and 183 bibliography records. The body reports 182 peer-reviewed publications and one technical report; that publication-status statement is preserved as a manuscript claim, not newly verified here.

The 113-work count concerns only the channel–carrier display subset. The supplied source does not provide item-level assignments for its three descriptive maps, so this package does **not** reconstruct them, treat citation sections as those assignments, or label all cited papers direct toxicity evidence.

The unchanged preamble still defines `CorpusTotal=181` and `PeerTotal=180`. Those two macros are unused in the body, which explicitly states 183 and 182. They are a bookkeeping discrepancy, not evidence of a separate 181-work synthesis corpus. `CorpusCutoff` is used and declares **23 August 2026**. This is the survey cutoff, not a claim that the companion was updated or independently verified on that date.

## Provenance and missing information

- Bibliographic text is transcribed from `sample-base.bib`; the exact original BibTeX is retained for citation export. Display authors retain the original author ordering and source name style.
- DOI and URL fields are absent from every supplied record, so they remain `null`. `discovery_url` is explicitly an exact-title scholarly search, not a verified publication link. It must be labeled **Search title**, not **Read paper** in an interface.
- `sections` and `citation_locations` describe where a work is mentioned, including captions and tables. They are not coverage rankings, systematic review codes, evidence-strength ratings, or primary strata.
- Evidence roles apply to claims. The companion does not assign one permanent role to each paper or infer a successful bridge from co-citation.
- The worked cases deliberately extend source claims; they do not attribute those stronger statements to the cited authors. C3 is hypothetical and therefore has no primary reference key of its own.
- C4 retains the source NSFW endpoint. A direct S coordinate does not establish a mapping to targeted social harm. Its reported metric inconsistency is kept separate from coordinate support.
- No successful empirical bridge, inter-rater reliability result, reproduced search history, or item-level verification log is added by these materials.
- Source line numbers and SHA-256 hashes identify the specific LaTeX version used for extraction. Regenerate against the final revised file before publishing if its content changes.

## Use an evidence card

1. Copy the blank template and state a specific target claim plus its proposed action.
2. Record the original endpoint, tested configuration, result, sampling unit, and source location before interpreting the extension.
3. Compare source and target conditions for S, C, O, P, and E; justify every support status.
4. Keep judge validity, precision, coverage, and replication separate from the support profile.
5. Specify a transport comparison and prespecified tolerance where an extension needs evidence. A planned comparison is not a completed bridge.

`null` means unfilled or unestablished information; it never means zero risk, no limitations, or successful validation. Preserve indeterminate and unreported cases. The template is an aid for a proposed framework, not a certification checklist.

## Reproduce extraction

Python 3.10+ and its standard library are sufficient. No network, bibliography editing, or additional package installation is needed.

```sh
python extract_references.py --source /path/to/latex/project --out /path/to/resource_data
python build_companion_data.py --source /path/to/latex/project
```

The second script uses the metadata next to itself and writes its outputs there; keep these scripts and generated data together. It verifies that the manuscript hash matches the bibliography extraction. Its SCOPE definitions and case text are curated summaries of the supplied manuscript, so changes to the substantive framework require human review rather than merely rerunning extraction.

The extractor ignores LaTeX comments, handles balanced braces in section titles and ordinary BibTeX fields, preserves source offsets, and fails on missing citation keys or duplicate bibliography fields. Its BibTeX parser intentionally supports the ordinary braced records in this project; it is not a replacement for a general-purpose BibTeX engine.

## Suggested companion interface

Offer three routes: **Find literature** (search and export), **Understand SCOPE** (definitions and bounded examples), and **Build an evidence card** (editable template with JSON download). Keep the original endpoint visible beside every worked-case profile. Display source version and remaining evidence gaps beside completed cards, and never turn D/U/N statuses into a numerical safety score.
