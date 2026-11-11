> Active visual direction: the owner requested **Poster + Neon** on 2026-11-10. Read [integration rules](docs/design-system/POSTER-NEON.md). This supersedes older Poster People visual requirements below. Product, data and interaction rules remain in force.

# GUI — DoRoboty.ai Poster People

The required visual direction for new and changed screens is the accepted **Poster People** design system. The project instructions are [docs/design-system/README.md](docs/design-system/README.md). Read them before UI work; they define how the standalone reference is adapted to this React/TypeScript/Vite application. The previous theme reference tree and skill requirements have been removed.

## Read and preview

1. [Project integration guide](docs/design-system/README.md): authority, React/Base UI mapping, routes/state, assets and completion criteria.
2. [Host implementation rules](docs/design-system/IMPLEMENTATION.md), [React component catalog](docs/design-system/HOST-COMPONENTS.md), [record/CV APIs](docs/design-system/RECORDS.md), [acceptance checklist](docs/design-system/VERIFICATION.md) and [status/open findings](docs/design-system/STATUS.md): reusable owners, actual contracts, URL/focus rules, breakpoint values and regression scenarios.
3. [Agent entry point](docs/design-system/agent-kit/design.md): visual hierarchy, composition, exact standalone imports and extension boundaries.
4. [Component API](docs/design-system/agent-kit/components/API.md) plus relevant [human reference](docs/design-system/agent-kit/reference/components.md): anatomy, variants, states and evidence.
5. `npm run design-system:dev`: local catalog, full listing and offer on port 8952. `npm run design-system:check` checks the immutable kit. No global skill or extra installation is required.

## Implement in this app

- Preserve the requested scope, React/TypeScript/Vite, hash routes, Base UI's `render` composition, Zod/local data operations and current application workflows.
- Use local Geist Serif Regular for headings, paper/white/ink/pink roles, source contours and radii, complete title wrapping and responsive listing/offer composition.
- Adapt host tokens and existing primitives together. Do not paste the kit's global reset or vanilla controllers into React, substitute example data for product state, or create a parallel button/card library.
- Keep docs/design-system/agent-kit unchanged as the reference; implement product UI in src/ and the host theme layer. Existing token names do not establish an alternative visual target.
- Compare desktop/mobile evidence; test long content, missing salary/marks, keyboard focus, selection, dialogs and recovery. Run ./scripts/verify and report actual checks. The original kit report does not verify a new React screen.

The running application has a host adaptation; current code still requires comparison with the source on each UI task. Follow the implementation map rather than creating parallel controls. Keep Search outside mobile filters, preserve copied section URLs under HashRouter, manage focus after chip removal, reuse outlined surfaces and compare full action type roles plus one contour. Record actual evidence and partial findings; preserve old audit artifacts in separate task-specific directories.
