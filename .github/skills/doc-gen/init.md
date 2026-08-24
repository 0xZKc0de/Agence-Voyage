# Init workflow

Follow these steps **in order**. This is a brand-new generation. Do not assume
or recover prior generated pages. Preserve `docs/wiki/INSTRUCTIONS.md` when
present.

Read `docs/wiki/INSTRUCTIONS.md` first if it exists.

## 1. Inventory

Inventory manifest-backed components, entrypoints, public surfaces, major
domains, data ownership, cross-system workflows, operations, and
representative tests.

Inspect the repository tree, workspace and package manifests, existing docs,
entrypoints, routing and schema files, public surfaces, and representative
implementation and tests. Prefer glob/grep and targeted reads.

## 2. Plan (`docs/wiki/_plan.md`)

Create `docs/wiki/_plan.md` with front matter (`type: Plan`).

Begin with an **Information architecture** section: proposed wiki tree and a
stable, repository-specific domain taxonomy. Then map every substantial
component and workflow to its canonical page, primary source paths and
symbols, focused tests, and disposition (`covered`, grouped with a named
system, `out of scope`, or `evidence-blocked`).

Organize around runtime domains, owned subsystems, and cross-system
workflows—not the source directory tree.

Rules:

1. Keep the wiki root focused on `quickstart.md` and a small set of genuinely
   repository-wide concepts. A flat root of pages from several coherent
   domains is not acceptable when those pages can form meaningful sections.
2. Put related pages under a clearly named domain directory when they share
   an owning subsystem, lifecycle, data boundary, operational surface, or
   user task. A directory with only one substantive page is usually an
   artificial boundary; merge it or plan the other pages the domain needs.
3. The proposed quickstart domain map must match the physical hierarchy. A
   named domain with multiple pages should be a directory; do not present a
   semantic grouping in quickstart while scattering members at the root.
4. Do not use generic umbrella directories such as `architecture/`, `core/`,
   or `platform/` as catch-alls for independently owned subsystems. An
   architecture section may hold system-level overviews and cross-domain
   flows; independently owned areas belong in their own domain.
5. Do not force hierarchy onto a small wiki, mirror source folders, create
   generic catch-alls, or add thin directory landing pages solely to deepen
   the tree. The taxonomy must make the shortest path from an engineering
   question to its canonical page obvious.
6. Treat every path in the approved tree as the page’s **final** path. Do not
   draft at the root for later reorganization.

Record planned concept links as `source → relationship → target`.

## 3. Freeze taxonomy before authoring

Review the plan against the inventory (read-only). If you use a subagent,
give it `_plan.md`, the documentation scope, and explicit exclusions; it
must not write files. Create a TODO for every evidence-backed gap and revise
the plan.

Do a second critic pass with the prior-request ledger and how each item was
addressed. Resolve leftovers yourself. Do not call a third critic.

Do **not** begin substantive page research or wiki prose until every taxonomy
request is resolved in `_plan.md` and exact final paths are frozen.

Before paths are frozen, do not launch general-purpose research subagents.
The only optional delegation in this phase is a read-only plan critic.

## 4. Author each planned factual page

For each planned page:

1. Research its source and tests (evidence gate in `SKILL.md`).
2. After taxonomy is frozen, you may delegate end-to-end authoring for
   coherent domains to at most **nine** general-purpose subagents total. Each
   invocation gets one **disjoint** set of exact planned paths and must
   research, then write those pages in the same invocation. Never split one
   domain into research then a second authoring task. Never assign a domain
   already researched.
3. Write complete explanatory prose. Material facts must stay accurate and
   grounded; they are not a ceiling. Explain responsibilities, owning
   entrypoints and symbols, mechanisms and control flow, relationships and
   invariants, lifecycle and ordering, extension points, focused tests,
   worked examples, and primary evidence. A passing mention, directory list,
   or source-map row is not substantive coverage.
4. Every substantial service, API endpoint, and major workflow must be
   documented. A human or agent should be able to understand systems and
   workflows from the wiki without reading code outside it.

Read and follow `mermaid-diagrams` when the page needs a diagram (see
[pages.md](pages.md)).

## 5. Unknown-unknown pass

One top-level pass over uncovered high-ranked clusters, one-hop
dependencies, and cross-system workflows. Expand the plan only for real
gaps. Before authoring an added page, put its exact final path into the
taxonomy and verify it does not create root sprawl, an artificial
single-page directory, or a generic catch-all. Never introduce a path absent
from the plan.

## 6. Reconcile and write quickstart

Reconcile the physical tree against the reviewed taxonomy: relocate root
orphans, collapse unjustified single-page directories, split generic
umbrellas that mix independently owned subsystems, and ensure every
multi-page domain in quickstart maps to its physical directory.

Then write `docs/wiki/quickstart.md` with its own complete coverage: map,
links, task-routing table, and `## Backlog` for valid deferrals only.

## 7. Verify

1. Invent a set of high-value questions a future engineer or agent would ask
   (routing, invariants, extension seams, data ownership, failure modes).
   Create one TODO per question with acceptance criteria.
2. Answer each question **from the wiki only**. Then verify those answers
   against source and tests.
3. For every partial or failed answer: inspect current source and tests,
   repair the canonical page, then re-check. Mark a TODO complete only after
   a pass.
4. You may batch related questions (2–3) and use read-only subagents to
   answer-from-wiki; they must not mutate Markdown. You own all repairs.

## 8. Final reconciliation

Reconcile against the plan, taxonomy, QA TODOs, and page set. Keep
quickstart’s semantic map aligned with the physical tree. Write
`docs/wiki/.last-update.json`:

```json
{
  "gitHead": "<output of git rev-parse HEAD, or unknown>",
  "at": "<ISO-8601 datetime>"
}
```

Remove `_plan.md` when the run succeeds unless the user asked to keep it.

## Depth gate (follow exactly)

- Decompose large services by domain. Independent route families, data
  models, or runtime subsystems get their own pages under a directory. A
  single service overview is not sufficient.
- Example: a frontend should have a main architecture page; major routes or
  collections (for example settings users/admin/billing) get their own pages
  for contents, design, and relationships.
- Reading tests is a primary way to learn usage, validation, and what the
  authors care about.
- Do not start `quickstart.md` prose while major components still have only
  manifest- or README-level understanding.
- Do not document every file. Depth should match meaningful complexity.
  Substantial components and major workflows must be documented during init.
