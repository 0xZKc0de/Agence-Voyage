# Page quality

## What every substantive page should contain

When the evidence exists:

- What the area does and why it exists
- Ownership, runtime entrypoints, important symbols
- Dependencies, data flow, invariants, lifecycle ordering
- Extension points and change recipes for real seams only
- Focused tests described by behavior; minimal validation command
- Schemas, generated artifacts, and scope boundaries
- Inline source references where they help verification

For public or cross-package extension points, capture the complete
evidence-backed change surface: implementation, exports, registration or
generated surfaces, consumer import path, and the narrowest consumer-facing
test.

## Diagrams

Read the `mermaid-diagrams` skill before writing any `mermaid` fence.

Add a grounded diagram when the page documents a request or runtime flow, a
call sequence, a lifecycle or state machine, or a data model. Skip
navigation, reference tables, and pure configuration pages. Prefer a few
strong diagrams over decorating every page. Caption each diagram in one
line.

If you cannot load that skill, still obey: ground every participant and
edge in inspected source; never put semicolons, pipes, or unescaped angle
brackets in labels; quote flowchart labels that contain punctuation; never
use Mermaid reserved words as node or participant ids.

## Quickstart

`docs/wiki/quickstart.md` is the entrypoint. Someone with zero knowledge of
the wiki should understand what it covers, how it is organized, and where to
go next.

Required:

- High-level overview and links to every major section
- Domain map that matches the physical directory tree
- Task-routing table (intent → page → entrypoints/symbols → tests → command)
- `## Backlog` only for honest deferrals (source anchor + reason)

Optimize for path compression: shortest route from engineering intent to
owning files and symbols, related systems, focused tests, and a narrow
validation command.

## Coverage self-check

Before finishing init or update:

- Each substantial independent component has a page or named section, or an
  explicit accurate disposition
- Closely coupled small components may share a page; do not collapse
  unrelated components only to reduce page count
- In a monorepo, readers can navigate by system and by cross-system workflow
- No low-value stubs; no redundant copies of the same concept
- Section directories represent real documentation areas
