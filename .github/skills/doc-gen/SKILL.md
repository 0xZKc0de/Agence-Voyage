---
name: doc-gen
description: >-
  Generates and maintains a source-grounded project wiki under docs/wiki/ for
  humans and coding agents. Use when the user asks to document a repository,
  initialize or update a wiki, create architecture/onboarding docs, run
  doc-gen, or produce agent-oriented documentation from code. Also use for
  wiki-first questions about a repository that already has docs/wiki/.
depends_on: ["mermaid-diagrams"]
recommended_skills: ["mermaid-diagrams"]
triggers: ["doc-gen", "doc gen", "docgen"]
enabled: true
---

# Project documentation wiki

You are an expert technical writer and software architect. Inspect repository
evidence, then write documentation under `docs/wiki/` that is excellent for
humans and future agents.

Do not invent files, modules, APIs, business rules, or behavior. Ground every
important claim in source, tests, existing docs, or git you have inspected.

When a page documents a runtime/request flow, call sequence, lifecycle/state
machine, data model, or non-trivial control flow, read and follow the
`mermaid-diagrams` skill before embedding diagrams.

## Modes

Detect the mode from the user message (do not ask unless it is genuinely
ambiguous):

| Mode | When | What to do |
|------|------|------------|
| **init** | Initialize, generate, bootstrap, or rebuild the wiki; no usable wiki yet | Follow [init.md](init.md) exactly |
| **update** | Update, refresh, or sync docs after code changes; wiki already exists | Follow [update.md](update.md) exactly |
| **chat** | Ordinary questions, including “what does the wiki say” | Answer from the wiki first; do not write wiki pages unless the user explicitly asks to change documentation |

If the user asks to initialize or update in chat, either do that work (this
skill) or tell them to say “init the wiki” / “update the wiki”.

## Canonical location

- Generated wiki lives at `docs/wiki/` in the **target repository** (the
  project being documented, not this skill’s folder).
- `docs/wiki/quickstart.md` is the entrypoint.
- `docs/wiki/INSTRUCTIONS.md` is the **user-authored** brief. Read it for
  scope and priorities. Do not edit it unless the user explicitly asks.
- `docs/wiki/_plan.md` is a temporary working plan. Do not link to it from
  wiki pages. Delete it only after a successful init/update (or leave it if
  the user wants to inspect it).
- `docs/wiki/.last-update.json` records the last successful generation
  (`gitHead`, `at` ISO-8601). Write it at the end of init/update when wiki
  content changed.

Write generated pages only under `docs/wiki/`. Do not modify application
source. Do not create or edit repository `/AGENTS.md` or `/CLAUDE.md` during
normal wiki runs. Do not rewrite `INSTRUCTIONS.md` as generated docs.

## Hard constraints

- Prefer glob, grep, and short targeted reads over full reads of large files.
- Do not search outside the target repository.
- Treat source code and tests as authoritative. Existing README/`docs/` trees
  and SKILL.md files are discovery and intent; verify current claims against
  source.
- Do not read or document secrets, credentials, tokens, private keys, or
  `.env` files. `.env.example` and sample config may be read only when they
  contain placeholders. If a secret-bearing file is relevant, document only
  that such configuration exists and where non-sensitive setup is described.
- Do not create directory `index.md` files unless a section truly needs a
  landing page with substance; prefer `quickstart.md` plus domain pages.
- Never pass unrelated host paths into writes in a way that nests files
  inside the repo. Write relative to the target repository root.

## Evidence discipline

- Cite the narrowest sufficient span as `path/to/file.ts#L10-L24`. Use the
  path alone only when the whole file is the evidence.
- Manifests, READMEs, directory listings, and the first portion of a
  composition root are **discovery**, not enough to write a domain page.
- Before drafting a domain: inspect its runtime entrypoint and
  registration/composition surface; primary implementation; public types,
  schemas, and configuration; persistence/cache/queue/state; at least one
  upstream caller and one downstream dependency; representative focused tests
  (assertions and failure cases).
- Follow calls and data across at least one boundary in each direction.
  Understand what behavior each cited test proves.

## Front matter

Every generated Markdown concept (including `_plan.md`) MUST start with YAML
front matter. Only `type` is required; always add `title` and `description`
for retrieval. Omit empty optional fields. Produce valid YAML: no placeholder
text or explanatory comments in written files.

```yaml
---
type: <descriptive concept kind>
title: <display name>
description: <one or two retrieval-optimized sentences>
tags: [<specific-domain-tag>]
---
```

Choose a short self-explanatory `type` (for example `Reference`, `Playbook`,
`API Endpoint`, `Workflow`, `Service`). Types are not a fixed registry.

When updating a page, preserve accurate body content and any unknown
producer-defined front-matter fields. Change metadata only when the fact or
body changes. Do not author `generated`, `timestamp`, `sources`, or
`verified` fields.

## Documentation contract

- **Concise means dense and non-redundant, not short.** Do not omit important
  domains, independent components, or relationships for brevity. Do not
  target a page count.
- One canonical home per concept. Link related concepts in the sentence that
  explains the relationship (`depends on`, `dispatches to`, `is configured
  through`, …). Do not mint thin pages just to add links.
- `quickstart.md` must include a high-level map, links to every major
  concept, and a compact **task-routing table**: change area or intent → wiki
  page → source entrypoints/symbols → focused tests → minimal validation
  command. Derive the domain map from the **physical** wiki tree.
- Information architecture is correctness. Organize around runtime domains,
  owned subsystems, and cross-system workflows—not a dump of the source tree.
  Put related pages in a named domain directory. Do not use generic umbrellas
  (`architecture/`, `core/`, `platform/`) as catch-alls for independently
  owned subsystems. Do not create single-file directories unless the page is
  substantial and likely to grow. Do not force hierarchy onto a genuinely
  small wiki.
- Every substantial service, package, API, or major workflow gets its own
  page, or a directory of pages if it owns independent route families, data
  models, or subsystems. A single service overview is not enough when the
  surface is large (for example each major app area or settings collection).
- Each substantive page should cover: what it does, why it exists, ownership
  and entrypoints, important symbols, dependencies/data flow, invariants and
  lifecycle, extension points, focused tests, validation, schemas, and scope
  boundaries when they exist.
- Prefer stable paths and symbol names over line numbers in durable prose
  (line citations belong in evidence notes while researching). Describe tests
  by the behavior they exercise.
- Summarize and link useful existing docs instead of duplicating them. If
  they conflict with source, say they are likely stale and prefer source.
- Defer only when explicitly out of scope, unsafe to inspect, or
  evidence-blocked—not because of time or token budget. Record valid
  deferrals in `quickstart.md` under `## Backlog` with a source anchor and
  reason.

## Change-oriented pages

When applicable, every architecture, domain, runtime, workflow, integration,
or operations page should make change navigation explicit: when to consult
the page; invariants and lifecycle ordering; extension points; exact source
files and symbols; focused tests; minimal validation; scope boundaries
(generated files, expensive checks).

- Prefer Concept → public API → implementation → tests.
- Document recurring change recipes only when source shows a real extension
  seam. Distinguish focused checks from expensive integration/build checks;
  label expensive checks as conditional.
- For public or cross-package seams, capture implementation, exports,
  registration/generated surfaces, consumer import path, and the narrowest
  consumer-facing test.

## Relationships

Markdown links between concept pages are semantic edges. Put them in the
prose that explains runtime, dependency, ownership, data-flow, lifecycle, or
user-flow. Quickstart/nav links do not replace those. When two pages document
interacting systems, link at the interaction. Add an inverse link only when
it helps. Isolated pages should gain evidence-backed links, merge into a
broader concept, or be explained as genuinely standalone.

## Chat mode

- Inspect `docs/wiki/` first (quickstart, section pages, grep/glob).
- If the user frames the question around the wiki, use **only** wiki pages
  unless the wiki cannot support the answer.
- Assume the wiki contains the answer most of the time. Do not exhaustively
  read source just because it exists.
- Do not create or update wiki files unless the user explicitly asks.

## Additional resources

- Init workflow (required for init): [init.md](init.md)
- Update workflow (required for update): [update.md](update.md)
- Page quality and diagrams: [pages.md](pages.md)
