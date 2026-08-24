# Update workflow

This is a maintenance run. Inspect the existing `docs/wiki/` before editing.
Work in the top-level agent; avoid subagents unless the user asks for them.

## 1. Read current wiki metadata

- Read `## Backlog` in `docs/wiki/quickstart.md` if present.
- Read `docs/wiki/.last-update.json` if present; note `gitHead`.
- Read `docs/wiki/INSTRUCTIONS.md` if present.
- Run `git rev-parse HEAD`. When metadata has a different `gitHead`, inspect
  `git log <gitHead>..HEAD --name-status --oneline` and the relevant diff.
  If there is no prior `gitHead`, inspect recent history selectively.

Use git changes, changed manifests, entrypoints, public surfaces, tests, and
operational configuration to find affected systems and cross-system
workflows. Rebuild a full inventory only when structural changes or obvious
coverage gaps require it.

## 2. Impact plan

Before editing, write `docs/wiki/_plan.md` (front matter `type: Plan`):

- Map each affected or newly discovered component and workflow to a page or
  substantive section, primary source anchors, and a disposition (`covered`,
  grouped with a named system, `out of scope`, `evidence-blocked`).
- Rank by runtime importance, dependency centrality, public surface, change
  activity, and test ownership. Follow imports, symbols, runtime calls,
  shared data, and tests across directory boundaries; do not treat changed
  files independently.
- Record relationships as `source → meaning → target`.
- Source change → docs affected → edit needed → why. If a page cannot be
  tied to a relevant source, workflow, product, or existing-doc change, do
  not edit it.

Updates may be a **no-op**. If nothing relevant changed since the last
successful run and the wiki is already accurate, do not edit files. Tell the
user the wiki is already current.

## 3. Edit with evidence

- Treat source and tests as ground truth. Misleading derived context is
  worse than an explicit evidence gap.
- A passing mention, directory list, or source-map row is not coverage.
  Explain responsibilities, entrypoints, symbols, relationships, invariants,
  focused tests, and primary evidence.
- For new or materially changed factual prose, establish evidence **before**
  the first write of that page. Do not write first and reconcile later. Do
  not backfill unrelated existing prose.
- Markdown edits limited to style or navigation need no extra evidence pass.
- Preserve useful existing structure and wording when it remains accurate.
  Avoid unrelated formatting or prose churn. Do not reformat tables,
  normalize blank lines, or polish wording unless the surrounding content is
  already changing for accuracy.
- There is no preset limit on pages an update may change or add. Add or
  expand pages when changed evidence exposes an undocumented component,
  workflow, contract, or relationship.
- Keep each concept in one canonical page.
- Promote backlog entries when evidence is sufficient, then remove them from
  the backlog. Every identified area stays documented or listed in Backlog
  with a source anchor and reason.
- After drafting, inspect uncovered one-hop dependencies and adjacent
  workflows revealed by the changes. Expand the plan only for real gaps; do
  not rewrite unrelated well-covered systems.

Follow [pages.md](pages.md) and the `mermaid-diagrams` skill. A stale diagram
is a stale claim: fix it in the same edit as the surrounding prose. Adding a
missing high-value diagram on a page you are already editing is not a
formatting-only change.

Do not update Source Map sections, git evidence lists, or generic “things to
watch” unless they are materially wrong because of the source changes. Do
not include persistent commit-hash lists unless a specific commit explains
an important historical decision.

## 4. Reconcile and record

Reconcile edits against the affected inventory. Audit changed concept links
and adjacent cross-domain relationships. Keep quickstart links accurate.

If wiki content changed, update `docs/wiki/.last-update.json` with current
`gitHead` and `at`. Remove `_plan.md` when the run succeeds unless the user
asked to keep it.

Before finishing, simulate navigation for representative adjacent changes
grounded in actual components and history. A future agent should reach the
first implementation files, important symbols/invariants, focused tests, and
minimal validation command from quickstart without a repository-wide search.
Repair navigation gaps found by that audit.
