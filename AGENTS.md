> Active visual direction: the owner requested **Poster + Neon** on 2026-11-10. Read [integration rules](docs/design-system/POSTER-NEON.md). This supersedes older Poster People visual requirements below. Product, data and interaction rules remain in force.

# Working on DoRoboty.ai Case

This is an AIPH3 teaching prototype, separate from the public production portal.
Read BRIEF.md, docs/case/CASE_PROTOCOL.md, TODO.md and relevant FEATURES.md entries before product work.

## Start and boundaries

- Participant setup: Node.js 24, npm ci, npm run dev (http://127.0.0.1:3001).
- Role selection is a simulation, not security.
- Share plain Zod schemas between forms and domain operations.
- Preserve human editing and approval. Use synthetic data only.
- Keep historical case evidence separate from prototype state. Include only baseline in participant packages; source history and instructor materials must not be distributed.

## Workflow

1. Record intent and acceptance criteria in docs/tasks/ for changes larger than one line.
2. Do not let multiple agents write in one worktree.
3. Implement and run ./scripts/verify before claiming completion; explain actual failures.
4. Perform a separate review pass before merging. Record durable lessons when useful.

## Product behavior register

FEATURES.md describes current behavior, not a roadmap. Update it in the same change/commit for added, changed, removed or simulated flows. Preserve stable IDs, route/role/data boundaries and source/test references. Do not equate source coverage with an executed test or deployment. For changes without behavioral impact, record that the register was reviewed and did not need updating.

## Required design system

For every new or changed screen, use [Poster People project instructions](docs/design-system/README.md). Read that guide, [design.md](docs/design-system/agent-kit/design.md), [component API](docs/design-system/agent-kit/components/API.md), and the relevant [human reference](docs/design-system/agent-kit/reference/components.md) before choosing styles or layout. Read the [host implementation rules](docs/design-system/IMPLEMENTATION.md) and [application acceptance checklist](docs/design-system/VERIFICATION.md) as required companions. [GUI.md](GUI.md) is the short entry point. This is the required visual direction; the previous theme guidance has been removed.

Use the complete local kit in docs/design-system/agent-kit as the source for typography, colors, radii, anatomy, responsive composition and states. Adapt it to this project's React/TypeScript/Vite and existing Base UI primitives. Keep the `render` API, hash routes, domain data and persistent local flows. Do not import the example controllers, fixtures, body reset or string renderer into product React code. Current application styles are implementation to adapt within the active task scope, not another approved visual target. Installing documentation does not itself convert the running UI.

Run `npm run design-system:dev` for the reference catalog/listing/offer (port 8952) and `npm run design-system:check` for integrity and example checks. No extra package installation is needed for the kit. Use local bundled Geist Serif/illustration assets; no remote runtime dependencies. Keep the kit immutable and implement product changes in src/ and the host token layer. Follow the guide's desktop/mobile, long-content, keyboard/state and integration checks; the reference's verification report does not verify a new screen.

## Standards

- Code, comments and authored engineering documentation are English; end-user UI and canonical AIPH source wording are Polish.
- Use npm, Node.js 24 and package-lock.json. No second package manager.
- Features belong in src/features; src/components/ui contains shared Base UI primitives.
- For UI changes follow GUI.md and docs/design-system/README.md; use the accepted Poster People design system with the existing Base UI components and render composition API. Do not restore the removed theme guides or require global design skills.
- Use React Router hash routes.
- Never log private free text or introduce secrets into the frontend.

## Validation

- npm run check verifies formatting, lint, types, unit tests, static build and browser journeys. ./scripts/verify runs the same gate.
- npm run dev never installs browser binaries or system tools. Browser tests require a provisioned Playwright Chromium; if missing, report it. Do not install OS dependencies automatically.
- Check mobile/desktop, keyboard access, error states and data recovery.
- Report what actually ran. Local checks do not prove CI, publishing or human approval.
