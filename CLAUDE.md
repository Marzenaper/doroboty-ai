> Active visual direction: the owner requested **Poster + Neon** on 2026-11-10. Read [integration rules](docs/design-system/POSTER-NEON.md). This supersedes older Poster People visual requirements below. Product, data and interaction rules remain in force.

@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work is based on the local design system

Read [project integration instructions](docs/design-system/README.md), [host implementation rules](docs/design-system/IMPLEMENTATION.md) and [application acceptance checklist](docs/design-system/VERIFICATION.md) first, followed by [design.md](docs/design-system/agent-kit/design.md), [component API](docs/design-system/agent-kit/components/API.md) and the relevant [human reference](docs/design-system/agent-kit/reference/components.md). Poster People is the required visual direction for new and changed screens; the previous theme guides are removed. The current host adaptation is implementation to verify, not an alternative visual authority.

Use the packaged CSS, anatomy, responsive examples, local Geist Serif and illustration. Adapt them into existing React features, Base UI `render` components and host tokens; preserve hash routing, Zod, persona data, localStorage and application/employer workflows. The vanilla example controllers and numeric demo jobs are references, not product code to mount. Scope visual changes to the requested task. Follow the current ownership map and compare actual anatomy/type/state with the source; updating guidance alone does not verify the running UI.

From the repository root: `npm run design-system:dev` previews the kit at port 8952; `npm run design-system:check` verifies its 67 original files and examples. The main app still runs with npm run dev at port 3001. No kit dependencies or global skills are required. Keep docs/design-system/agent-kit immutable. Validate new UI at desktop/mobile widths and with keyboard/state checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual evidence.
