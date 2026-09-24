#!/usr/bin/env python3
"""Extract active citations and their document locations using only Python's stdlib.

Usage: python extract_references.py --source PATH --out PATH
Does not alter the LaTeX project. Does not resolve or verify publications online.
The parser is intentionally scoped to ordinary braced BibTeX records used here.
"""
from __future__ import annotations

import argparse
import bisect
import csv
import hashlib
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import quote


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def strip_comments(text):
    # Preserve character offsets and line breaks for manuscript line provenance.
    return re.sub(r"(?<!\\)%[^\n]*", lambda m: " " * len(m[0]), text)


def balanced(text, start, opener="{", closer="}"):
    if text[start] != opener:
        raise ValueError(f"Expected {opener} at offset {start}")
    depth, i = 1, start + 1
    while i < len(text):
        if text[i] == "\\":
            i += 2
            continue
        if text[i] == opener:
            depth += 1
        elif text[i] == closer:
            depth -= 1
            if not depth:
                return text[start + 1:i], i + 1
        i += 1
    raise ValueError(f"Unclosed {opener} at offset {start}")


def plain_latex(value):
    if value is None:
        return None
    value = value.replace(r"\scope{}", "SCOPE").replace(r"\scope", "SCOPE")
    accents = {"'": "\u0301", "`": "\u0300", '"': "\u0308", "^": "\u0302", "~": "\u0303", "c": "\u0327", "v": "\u030c"}
    def accent(m):
        return unicodedata.normalize("NFC", m[2] + accents[m[1]])
    value = re.sub(r"\\([\'`\"^~cv])\s*\{?([A-Za-z])\}?", accent, value)
    for cmd, char in {r"\&": "&", r"\%": "%", r"\_": "_", r"\#": "#", r"\ss": "ß", r"\ae": "æ", r"\oe": "œ", r"\o": "ø"}.items():
        value = value.replace(cmd, char)
    value = re.sub(r"\\(?:textit|textbf|emph|textsc)\s*", "", value)
    value = value.replace("---", "—").replace("--", "–").replace("~", " ")
    value = value.replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", value).strip()


def parse_bibtex(text):
    entries, cursor = {}, 0
    header = re.compile(r"@([A-Za-z]+)\s*\{")
    while (match := header.search(text, cursor)) is not None:
        body, end = balanced(text, match.end() - 1)
        cursor = end
        typ = match[1].lower()
        if typ in {"comment", "preamble", "string"}:
            raise ValueError(f"Unsupported BibTeX directive: {typ}")
        key, sep, rest = body.partition(",")
        if not sep or key.strip() in entries:
            raise ValueError("Missing or duplicate BibTeX key")
        fields, pos = {}, 0
        while pos < len(rest):
            m = re.match(r"[\s,]*([A-Za-z][\w-]*)\s*=\s*", rest[pos:])
            if not m:
                if rest[pos:].strip(" \r\n\t,"):
                    raise ValueError(f"Unparsed fields in {key}: {rest[pos:]}")
                break
            name = m[1].lower()
            pos += m.end()
            if rest[pos] == "{":
                val, pos = balanced(rest, pos)
            elif rest[pos] == '"':
                end_quote = pos + 1
                while end_quote < len(rest) and not (rest[end_quote] == '"' and rest[end_quote - 1] != "\\"):
                    end_quote += 1
                val, pos = rest[pos + 1:end_quote], end_quote + 1
            else:
                stop = rest.find(",", pos)
                stop = len(rest) if stop < 0 else stop
                val, pos = rest[pos:stop].strip(), stop
            if name in fields:
                raise ValueError(f"Duplicate field {name} in {key}")
            fields[name] = val
        entries[key.strip()] = {"entry_type": typ, "fields": fields, "bibtex": text[match.start():end]}
    return entries


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    manuscript, bib = args.source / "manuscript.tex", args.source / "sample-base.bib"
    raw = manuscript.read_text(encoding="utf-8-sig")
    text = strip_comments(raw)
    bibtext = bib.read_text(encoding="utf-8-sig")
    entries = parse_bibtex(bibtext)
    locations, headings = {}, []
    section_num, subsection_num = 0, 0
    section_title, subsection_title = "Front matter", None
    section_label = None
    pattern = re.compile(r"\\(section|subsection|cite[a-zA-Z]*)(?:\s*\[[^\]]*\])*\s*\{")
    newline_positions = [m.start() for m in re.finditer("\n", text)]
    citation_commands = 0
    for match in pattern.finditer(text):
        kind = match[1]
        value, end = balanced(text, match.end() - 1)
        line = bisect.bisect_left(newline_positions, match.start()) + 1
        if kind == "section":
            section_num += 1
            subsection_num = 0
            section_title, subsection_title = plain_latex(value), None
            lm = re.match(r"\s*\\label\{([^}]+)\}", text[end:])
            section_label = lm[1] if lm else None
            headings.append({"number": str(section_num), "title": section_title, "label": section_label, "source_line": line})
        elif kind == "subsection":
            subsection_num += 1
            subsection_title = plain_latex(value)
        else:
            citation_commands += 1
            for key in (k.strip() for k in value.split(",")):
                if key not in entries:
                    raise ValueError(f"Active citation has no BibTeX record: {key}")
                locations.setdefault(key, []).append({"section_number": str(section_num) if section_num else None, "section_title": section_title, "section_label": section_label, "subsection_number": f"{section_num}.{subsection_num}" if subsection_num else None, "subsection_title": subsection_title, "source_line": line})
    references = []
    for key, citation_locations in locations.items():
        record = entries[key]
        f = record["fields"]
        title = plain_latex(f.get("title"))
        author_raw = f.get("author", "")
        authors = [plain_latex(a.strip()) for a in re.split(r"\s+and\s+", author_raw)] if author_raw else []
        sections = {loc["section_number"]: {"number": loc["section_number"], "title": loc["section_title"], "label": loc["section_label"]} for loc in citation_locations}
        year = f.get("year")
        references.append({"key": key, "title": title, "authors": authors, "year": int(year) if year and year.isdigit() else year, "venue": plain_latex(f.get("journal") or f.get("booktitle") or f.get("howpublished") or f.get("institution")), "doi": f.get("doi") or None, "url": f.get("url") or None, "discovery_url": "https://scholar.google.com/scholar?q=" + quote('"' + title + '"'), "discovery_url_kind": "Title search; not a verified publication link", "entry_type": record["entry_type"], "citation_count": len(citation_locations), "sections": list(sections.values()), "citation_locations": citation_locations, "bibtex": record["bibtex"], "metadata_status": "Transcribed from supplied bibliography; not independently reverified", "evidence_role": None, "evidence_role_note": "Roles apply to claims. Citation location does not establish direct toxicity evidence, tested transport, coverage, quality, or corpus stratum."})
    references.sort(key=lambda x: (-(x["year"] or 0), x["title"].lower()))
    source_hashes = {"manuscript.tex": digest(manuscript), "sample-base.bib": digest(bib)}
    metadata = {"schema_version": "1.0", "source": "Supplied manuscript.tex and sample-base.bib", "source_sha256": source_hashes, "record_count": len(references), "active_citation_command_count": citation_commands, "citation_location_meaning": "Where a reference is cited, not a claim-level code or systematic coverage label", "external_verification": "None in this extraction", "missing_link_policy": "Absent DOI/URL fields are null; discovery links run exact-title searches", "manuscript_corpus_cutoff": "23 August 2026", "count_notes": {"unique_active_cited_works": len(references), "bibliography_records": len(entries), "uncited_bibliography_keys": sorted(set(entries) - set(locations)), "descriptive_corpus_declared_in_body": 183, "publication_status_declared_in_body": {"peer_reviewed": 182, "technical_report": 1}, "channel_specific_display_subset_declared_in_body": 113, "unused_preamble_macros": {"CorpusTotal": 181, "PeerTotal": 180, "PreprintTotal": 1}, "interpretation": "The latest manuscript explicitly includes all 183 cited works in descriptive corpus maps. There is no separate 181-work synthesis corpus established by its body. The unused 181/180 macros are a bookkeeping discrepancy; the 113-work subset belongs only to the channel-carrier display. No item-level display assignments are supplied, so none are reconstructed."}}
    def save(name, data):
        (args.out / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    save("references.json", references)
    save("reference-metadata.json", metadata)
    save("manuscript-sections.json", headings)
    (args.out / "references.bib").write_text("\n\n".join(entries[k]["bibtex"] for k in locations) + "\n", encoding="utf-8")
    with (args.out / "references.csv").open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=["key", "title", "authors", "year", "venue", "doi", "url", "discovery_url", "cited_in_sections"])
        writer.writeheader()
        for rec in references:
            writer.writerow({**{k: rec[k] for k in ["key", "title", "year", "venue", "doi", "url", "discovery_url"]}, "authors": "; ".join(rec["authors"]), "cited_in_sections": "; ".join(s["number"] + " " + s["title"] for s in rec["sections"])})
    print(json.dumps({"references": len(references), "active_citation_commands": citation_commands, "sections": len(headings), "doi_count": sum(bool(x["doi"]) for x in references), "url_count": sum(bool(x["url"]) for x in references)}, indent=2))


if __name__ == "__main__":
    main()
