"use strict";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = value => { try { const u = new URL(value); return ["https:","http:"].includes(u.protocol) ? u.href : "#"; } catch { return "#"; } };
let references = [], filtered = [], cases = [], definitions, template, resources = [], shown = 15;
let activeView = null;
const statuses = ["unreported", "direct", "bridged", "unsupported"];

function download(name, content, mime = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], {type:mime}));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function route() {
  if (location.hash === "#main") return;
  const known = ["home", "library", "scope", "cases", "resources", "about"];
  const id = known.includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";
  const moveFocus = activeView !== null && activeView !== id;
  $$(".view").forEach(e => e.hidden = e.id !== id);
  $$("[data-nav]").forEach(a => { if(a.dataset.nav === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  activeView = id;
  if (moveFocus) {
    const heading = $("h1, h2", $("#" + id));
    heading.setAttribute("tabindex", "-1");
    heading.focus({preventScroll: true});
  }
  window.scrollTo({top: 0, behavior: "instant"});
}
window.addEventListener("hashchange", route); route();

const lensCopy = {
  S: ["01", "What counts as harmful?", "Specify the policy and harm definition before interpreting a detector’s result."],
  C: ["02", "Which routes can change behavior?", "Identify the exposed prompts, tools, images, and components, and where the evidence is carried."],
  O: ["03", "What is observed, and how is it judged?", "Specify the event, available information, and judge. One output does not represent an entire interaction."],
  P: ["04", "Under which exposure conditions?", "Consider the population, system configuration, sampling procedure, and repeated access."],
  E: ["05", "Which action is being justified?", "Triage, blocking, review, and release have different costs and evidence requirements."]
};
$$('[data-lens]').forEach(button => button.addEventListener("click", () => {
  const [index, question, description] = lensCopy[button.dataset.lens];
  $$('[data-lens]').forEach(node => node.setAttribute("aria-pressed", String(node === button)));
  $("#lens-index").textContent = `${index} / 05`;
  $("#lens-question").textContent = question;
  $("#lens-description").textContent = description;
}));

function renderPapers() {
  const query = $("#search").value.trim().toLowerCase();
  const year = $("#year").value, section = $("#section-filter").value, sort = $("#sort").value;
  const terms = query.split(/\s+/).filter(Boolean);
  filtered = references.filter(p => {
    const haystack = [p.title, p.key, ...(p.authors || []), p.venue].join(" ").toLowerCase();
    return terms.every(term => haystack.includes(term)) && (!year || String(p.year) === year) && (!section || p.sections.some(s => s.number === section));
  }).sort((a,b) => sort === "title" ? a.title.localeCompare(b.title) : (sort === "oldest" ? a.year - b.year : b.year - a.year) || a.title.localeCompare(b.title));
  $("#result-count").textContent = `${filtered.length} of ${references.length} records${filtered.length > shown ? ` · showing ${shown}` : ""}`;
  $("#paper-list").innerHTML = filtered.length ? filtered.slice(0, shown).map(p => {
    const projects = resources.filter(r => r.key === p.key);
    const authors = p.authors.length > 6 ? p.authors.slice(0,6).join(" · ") + ` · +${p.authors.length - 6} authors` : p.authors.join(" · ");
    return `<article class="paper"><div class="paper-year">${esc(p.year)}</div><div><h3>${esc(p.title)}</h3><p title="${esc(p.authors.join('; '))}">${esc(authors)}</p><p class="venue">${esc(p.venue)}</p><div class="tags">${p.sections.map(s => `<span class="tag" title="Citation location only"><span>§${esc(s.number)}</span> ${esc(s.title.split(":")[0])}</span>`).join("")}</div><div class="paper-links"><a href="${esc(safeUrl(p.discovery_url))}" target="_blank" rel="noopener noreferrer">Find paper ↗</a>${projects.slice(0,2).map(r=>`<a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">${esc(r.kind)} ↗</a>`).join("")}<button type="button" data-cite="${esc(p.key)}">Download citation ↓</button></div><details><summary>BibTeX & record details</summary><p>${esc(p.metadata_status)}. ${esc(p.evidence_role_note)}</p><pre>${esc(p.bibtex)}</pre></details></div></article>`;
  }).join("") : '<div class="empty"><h3>No matching records</h3><p>Try a shorter phrase or reset the year and section filters.</p><button type="button" class="button" data-clear-filters>Reset filters</button></div>';
  $("#load-more").hidden = filtered.length <= shown;
}
function resetFilters() { $("#search").value = ""; $("#year").value = ""; $("#section-filter").value = ""; $("#sort").value = "newest"; shown=15; renderPapers(); }
$("#reset-filters").addEventListener("click", resetFilters);
["search","year","section-filter","sort"].forEach(id => $("#"+id).addEventListener(id === "search" ? "input" : "change", () => { shown=15; renderPapers(); }));
$("#load-more").addEventListener("click", () => { shown+=15; renderPapers(); });
$("#paper-list").addEventListener("click", e => { const c=e.target.closest("[data-cite]"); if(c){const p=references.find(p=>p.key===c.dataset.cite);download(p.key+".bib",p.bibtex);} if(e.target.closest("[data-clear-filters]"))resetFilters(); });
function csvCell(s) { const v=String(s??""); return '"' + (/^[=+@\-\t\r]/.test(v) ? "'" : "") + v.replace(/"/g,'""') + '"'; }
$$('[data-export]').forEach(b=>b.addEventListener("click",()=>{
  const kind=b.dataset.export;
  if(kind === "bib") download("toxicity-evidence-filtered.bib",filtered.map(p=>p.bibtex).join("\n\n"));
  if(kind === "json") download("toxicity-evidence-filtered.json",JSON.stringify(filtered,null,2),"application/json");
  if(kind === "csv") { const rows=[["key","title","authors","year","venue","cited_in_sections","title_search_url","metadata_status"],...filtered.map(p=>[p.key,p.title,p.authors.join("; "),p.year,p.venue,p.sections.map(s=>s.number).join("; "),p.discovery_url,p.metadata_status])];download("toxicity-evidence-filtered.csv","\ufeff"+rows.map(r=>r.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8"); }
}));

function buildCoordinates() {
  $("#coordinate-fields").innerHTML = definitions.coordinates.map(c=>`<fieldset class="coordinate"><legend>${esc(c.id)} · ${esc(c.name)}</legend><p>${esc(c.question)} ${esc(c.definition)}</p><div class="form-grid"><label for="status-${c.id}">Support status<select id="status-${c.id}" name="status_${c.id}">${statuses.map(s=>`<option value="${s}">${s[0].toUpperCase()+s.slice(1)}</option>`).join("")}</select></label><label>Reason / evidence location<textarea name="reason_${c.id}" placeholder="Explain this coordinate’s status; cite evidence rather than relying on the label alone."></textarea></label><label>Source condition<textarea name="source_${c.id}" placeholder="What was actually evaluated?"></textarea></label><label>Target condition<textarea name="target_${c.id}" placeholder="What does your proposed use require?"></textarea></label></div></fieldset>`).join("");
}
function readCard() {
  const f=new FormData($("#claim-form")), val=k=>String(f.get(k)??"").trim()||null;
  const card=JSON.parse(JSON.stringify(template));
  card.record_status="user_draft_not_independently_reviewed";card.title=val("target_claim");
  card.target_claim.statement=val("target_claim");
  card.source_evidence.source_result=val("source_result");
  card.source_evidence.object_and_configuration=val("system_version");
  card.provenance.source_locations=val("evidence_locator") ? [val("evidence_locator")] : [];
  card.provenance.curator=val("reviewer");
  card.quality_notes.other_limitations=val("quality_notes")?[val("quality_notes")]:[];
  card.source_evidence.limitations=val("limitations")?[val("limitations")]:[];
  card.transport_test.design=val("missing_tests");
  definitions.coordinates.forEach(c=>{ card.coordinate_profile[c.id]={source_condition:val("source_"+c.id),target_condition:val("target_"+c.id),support_status:val("status_"+c.id),reason:val("reason_"+c.id)}; });
  return card;
}
function exportCard(format) {
  if(!$("#claim-form").reportValidity())return;
  const c=readCard();
  if(format==="json")download("scope-evidence-record.json",JSON.stringify(c,null,2),"application/json");
  else {
    const lines=["# SCOPE evidence record","","> User-authored draft. No independent review or automatic safety judgment.","","## Target claim",c.target_claim.statement,"","## Source result",c.source_evidence.source_result,"","## Source and configuration",...(c.provenance.source_locations||[]),c.source_evidence.object_and_configuration||"Not recorded","","## Coordinate profile"];
    definitions.coordinates.forEach(d=>{const a=c.coordinate_profile[d.id];lines.push("",`### ${d.id} · ${d.name}`,`Status: ${a.support_status}`,`Source condition: ${a.source_condition||"Not recorded"}`,`Target condition: ${a.target_condition||"Not recorded"}`,`Reason: ${a.reason||"Not recorded"}`);});
    lines.push("","## Quality and uncertainty",...c.quality_notes.other_limitations,"","## Missing comparisons",c.transport_test.design||"Not recorded","","## Limitations",...c.source_evidence.limitations,"","## Curator",c.provenance.curator||"Not recorded","",c.use_note);
    download("scope-evidence-record.md",lines.join("\n\n"));
  }
  $("#form-status").textContent="Record exported. Assessments remain a draft.";
}
$("#claim-form").addEventListener("submit",e=>{e.preventDefault();exportCard("json");});
$("#export-markdown").addEventListener("click",()=>exportCard("md"));
$("#claim-form").addEventListener("reset",()=>{$("#form-status").textContent="Worksheet cleared.";});
function renderCases() {
  $("#case-list").innerHTML=cases.map(c=>`<article class="case-card"><div class="case-header"><p class="eyebrow">${esc(c.id)} / WORKED PROFILE</p><h3>${esc(c.title)}</h3></div><div class="case-body"><div class="status-row" aria-label="SCOPE support profile">${Object.entries(c.coordinate_profile).map(([k,v])=>`<span class="status-chip ${esc(v.status)}" title="${esc(v.reason)}">${esc(k)} · ${esc(v.status)}</span>`).join("")}</div><dl><dt>Supported use</dt><dd>${esc(c.valid_bounded_use)}</dd><dt>Proposed extension</dt><dd>${esc(c.target_claim)}</dd><dt>Comparison still needed</dt><dd>${esc(c.transport_test)}</dd></dl><details><summary>Inspect the reasoning and boundaries</summary><p>${esc(c.original_endpoint)}</p>${Object.entries(c.coordinate_profile).map(([k,v])=>`<p><strong>${esc(k)} / ${esc(v.status)}:</strong> ${esc(v.reason)}</p>`).join("")}<ul>${c.limitations.map(t=>`<li>${esc(t)}</li>`).join("")}</ul><p>Manuscript §${esc(c.source.section)}${c.reference_keys.length ? ' · '+c.reference_keys.map(esc).join(', ') : ' · Analytic illustration'}.</p></details><button type="button" class="button" data-case="${esc(c.id)}">Open in worksheet →</button></div></article>`).join("");
}
$("#case-list").addEventListener("click",e=>{
  const b=e.target.closest("[data-case]");if(!b)return;
  const c=cases.find(c=>c.id===b.dataset.case),form=$("#claim-form");form.reset();
  const set=(n,v)=>{form.elements.namedItem(n).value=v??"";};
  set("target_claim",c.target_claim);set("source_result",c.source_result);set("evidence_locator",`Manuscript §${c.source.section}, ${c.id}; ${c.reference_keys.join(", ")}`);set("missing_tests",c.transport_test);set("limitations",c.limitations.join("\n"));
  Object.entries(c.coordinate_profile).forEach(([k,v])=>{set("status_"+k,v.status);set("reason_"+k,v.reason);});
  $("#form-status").textContent=`Loaded ${c.id}. Any edits are your draft, not a new verified result.`;location.hash="scope";$("#scope-title").scrollIntoView({block:"start"});
});
function renderResources(){ $("#source-projects").innerHTML=resources.map(r=>`<article class="resource-card"><p class="eyebrow">${esc(r.kind)}</p><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">Open primary resource ↗</a><p class="small muted" style="margin-top:10px">Link checked ${esc(r.verified_on)}. No experiments reproduced.</p></article>`).join(""); }
$("#download-citation").addEventListener("click",()=>download("toxicity-evidence-survey.bib",$("#survey-citation").textContent));

async function loadJson(file){const r=await fetch(file);if(!r.ok)throw new Error(`Could not load ${file} (${r.status})`);return r.json();}
(async()=>{
  try {
    [references,definitions,cases,template,resources]=await Promise.all(["references.json","scope-definitions.json","worked-cases.json","evidence-card-template.json","resource-links.json"].map(f=>loadJson("data/"+f)));
    $("#total-count").textContent=references.length;
    [...new Set(references.map(p=>p.year))].sort((a,b)=>b-a).forEach(y=>$("#year").add(new Option(y,y)));
    const sections=new Map();references.forEach(p=>p.sections.forEach(s=>sections.set(s.number,s.title)));
    [...sections].sort((a,b)=>Number(a[0])-Number(b[0])).forEach(([n,t])=>$("#section-filter").add(new Option(`§${n} · ${t}`,n)));
    buildCoordinates();renderPapers();renderCases();renderResources();
  } catch(error) {
    $("#load-error").hidden=false;$("#load-error").textContent="The resource files could not be loaded. Try reloading. If you opened the downloaded site as a local file, serve the folder with a local HTTP server as described in README.md. The direct downloads remain available.";
    $("#result-count").textContent="Bibliography unavailable";console.error(error);
    $$("[data-export],#export-markdown,#claim-form button[type=submit]").forEach(b=>b.disabled=true);
  }
})();
