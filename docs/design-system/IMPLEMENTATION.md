> Active visual direction: the owner requested **Poster + Neon** on 2026-11-10. Read [integration rules](POSTER-NEON.md). This supersedes older Poster People visual requirements below. Product, data and interaction rules remain in force.

# Poster People — host implementation rules

Read with the [project guide](README.md), [host catalog](HOST-COMPONENTS.md), [current status](STATUS.md), immutable [component API](agent-kit/components/API.md) and [human reference](agent-kit/reference/components.md). These are project integration rules, not a replacement v1 kit or a new reference release. Use the [acceptance checklist](VERIFICATION.md) before claiming completion.

## Start from anatomy, then adapt

For each affected route, list the source families, required parts, host data and state, shared consumers and any missing design decision in the task record. Compare the complete source page before editing. Matching colors, fonts and radii alone does not constitute adoption.

| Composition             | Required structure                                                                                                                 | Prevent this regression                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Listing C05/C14/C15/C16 | Illustrated entry → visible query/location search → category buttons/counts → results with desktop filter column                   | Do not move search into the sidebar or mobile dialog; a homepage illustration does not satisfy the listing entry.                             |
| Mobile filters C15/C18  | Filter-only named modal, independent scroll body, persistent header/close and bottom result action; search stays on the page       | A centered information dialog with all controls is a different composition. Reuse Base UI Dialog behavior with filter-specific layout.        |
| Card C07/C09            | Company/role/facts, noninteractive labels, distinct conditions area, separate save toggle                                          | Use the same JobCard on home, listing, saved, company and related results. Do not invent a card per route.                                    |
| Full offer C13/C20–C22  | Identity → full H1/core facts → available labels; pay-first conditions/actions; readable sections; employer context; related cards | Mobile order: hero → conditions/actions → description → employer. Do not retain an older hero or generic facts stack under new colors.        |
| Salary C07/C21          | Amount/currency in fact treatment, supporting agreement/basis/period immediately adjacent; explicit missing-data text              | Reuse SalaryFact. Do not shrink the main offer amount to metadata or put all terms inside the pill. Preserve EUR/year and actual host values. |
| New host screens        | Compose existing typography, controls and outlined surfaces, with explicit states and responsive behavior                          | Missing reference screens permit documented composition, not another font/color/card family.                                                  |

Do not fabricate structured skills, requirements, benefits or recruiting stages to fill source anatomy. Optional affordances and unavailable content must be identified rather than claimed complete. Existing domain/state/role rules take precedence over the source's demonstration controllers and fixtures.

## Reuse and ownership

| Responsibility                                             | Current host owner                                                                                                                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic tokens and workspace typography/surfaces          | [tokens.css](../../tokens.css), [globals.css](../../src/app/globals.css), [poster-people.css](../../src/app/poster-people.css)                                                           |
| Namespaced source component treatments                     | [marketplace-components.css](../../src/app/marketplace-components.css)                                                                                                                   |
| Listing and offer geometry                                 | [listing adaptation](../../src/app/marketplace-listing.css), [offer adaptation](../../src/app/marketplace-offer.css)                                                                     |
| React/Base UI integration and context-specific adjustments | [marketplace.css](../../src/app/marketplace.css)                                                                                                                                         |
| Interactive primitives                                     | [src/components/ui](../../src/components/ui/) — retain Base UI and `render` composition                                                                                                  |
| Repeated job and salary anatomy                            | [JobCard](../../src/features/jobs/job-card.tsx), [SalaryFact](../../src/features/jobs/salary-fact.tsx)                                                                                   |
| Responsive filter modal                                    | [ResponsivePanel](../../src/components/responsive-panel.tsx) composed from the existing Button/Dialog                                                                                    |
| Reusable host recipes                                      | `prototype-panel`, `prototype-form`, Field, PageTitle, Notice and Empty; see [shell](../../src/features/prototype/shell.tsx) and [workspace](../../src/features/prototype/workspace.tsx) |

Additional current owners: [RecordSheet/ProcessTimeline/CvAttachment/MatchScore](RECORDS.md), [BackLink and ConfettiBurst](HOST-COMPONENTS.md), [application geometry](../../src/app/application.css), [record geometry](../../src/app/records.css) and [shared hover](../../src/app/interactions.css). Consult these APIs before creating another implementation. Open company defects are tracked separately in [STATUS.md](STATUS.md), not accepted variants.

- Prefer an existing primitive/variant or composition recipe before a new component. Low React component count is insufficient if each caller recreates its styles.
- Reuse the outlined surface recipe for cards, including homepage categories. `bg-card` plus radius does not add the contour. Remove broad selectors tied to utility class names; migrate their consumers to explicit recipes first.
- Keep foundation, shared component styling and page geometry separate. Scope source adaptations; do not mount standalone controllers or import their global reset into React.
- Keep one definition per visual role. Remove superseded overrides, blanket `!important` repairs and unused variants. A preserved source exception is not a newly invented universal token.
- Measure the final primitive plus caller classes and portal context. `ghost` must remain quiet and distinct from `outline`. Match source action weight, size, line-height and tracking; names like `font-medium` or `size="default"` are not evidence of a match.
- Use one visible contour: a real border or the existing inset edge treatment. Do not combine both on Search. Inset contours are allowed; offset shadows are not the source system.
- Review every affected shared consumer after changing tokens or primitives. Do not repair marketplace typography by shrinking unrelated workspace controls.

## URL, state and keyboard contracts

### Query and facets

The URL owns applied criteria. Query/location may have an unsubmitted form draft; facet/category changes apply immediately. Existing facets are **single-value per group** in this prototype. The source example's multivalue behavior and salary/sort features are not silently imported into the domain. Explain this host adaptation where users need it.

Reset, chip removal and browser back/forward must synchronize visible controls, URL, results and selected states. Retain the responsive modal/trigger while replacing only form state when necessary. Removing a component key without replacing its state synchronization can leave stale `defaultValue` controls; remounting the entire modal can lose focus.

### Focus after changes

- Save toggles keep a stable accessible name and `aria-pressed`; retain focus when the control survives.
- Removing a chip focuses the next surviving chip, otherwise the previous one, otherwise the results heading. Resolve the target after the URL-driven render; do not leave focus on body.
- Dialogs need a name, focus containment, keyboard close and restoration to the trigger or a logical surviving successor. Scrolling filter content must not move the header/footer over focused controls.
- Use the existing focus recipes. Do not add a universal `:focus-visible` outline that accidentally decorates route containers or hidden state.

### Section navigation in HashRouter

Use React Router Link with the current pathname and section hash, e.g. `/#/oferty/ai-product-manager#employer`. A bare `href="#employer"` resolves to an unknown app route when copied or opened elsewhere. A click handler that intercepts it and scrolls does not fix its destination.

On section navigation, focus and scroll the known target after the shell's route focus handling. Whitelist available section IDs, cancel scheduled work on unmount and support direct loading, keyboard activation and back/forward. Do not infer success from a mouse click in the existing page alone.

## Source and host boundaries

The kit remains byte-identical. Reference CSS values and anatomy govern the canonical screens; current app code supplies integration examples and can still contain bugs. The robot brand, persona navigation, hash routes, local persistence, immutable CV/application snapshots and actual local submissions remain host behavior. Source fixture counts, fictional-company colors, transient saves and non-submitting application dialogs do not replace them.

Workspace/form/detail recipes are documented host extensions, not proof of an approved standalone 1.1 library. Error/status colors preserve current product meaning where v1 has no established palette. Keep missing design decisions explicit and propose genuine extensions only after fixing deviations from already documented families.

## Record and process composition (host extension)

The selected process-view concept adds two reusable host components, documented in [RECORDS.md](RECORDS.md): [RecordSheet](../../src/components/record-sheet.tsx) and [ProcessTimeline](../../src/components/process-timeline.tsx). They combine source C01/C02 controls, C13 context and C22 reading typography; interactive tabs and recorded-event history are host requirements, not observed v1 kit variants. [CvAttachment](../../src/features/prototype/cv-attachment.tsx) supports its existing stack and a compact row without changing snapshot identity. Shared recipe styles and separate employer page geometry live in [records.css](../../src/app/records.css). Keep the reference kit immutable.

## Pointer and hover feedback

[interactions.css](../../src/app/interactions.css) owns the application-wide enabled link/button cursor and hover feedback, including portal controls and Base UI `render` links. Each enabled action gets a pointer and a visible background/text color change. Button variants set `--control-hover-bg`; the optional `--control-hover-text` preserves selected navigation/checkbox contrast. Primary uses the reference #ffacef hover, quiet actions/plain links use supporting pink, and selected ink navigation lightens to ink-neutral while retaining white text. Disabled/native/Base UI unavailable controls are excluded and use an unavailable cursor. Facts, tags and reading content receive no interaction treatment. Preserve existing focus outlines, native keyboard behavior and dimensions. This host rule extends missing feedback at Wojtek's request without editing the immutable kit; verify both resting and hovered computed colors after changes to variants or caller CSS.

## Candidate application composition

The application page (`/#/aplikuj/:slug`) reuses the outlined `record-sheet` recipe for an offer-context column and one form sheet. [ApplicationOfferPreview](../../src/features/jobs/application-offer-preview.tsx) composes CompanyLogo, SalaryFact and JobDescription using actual published job data; it is not a second JobCard or control library. Its native named disclosure expands the complete description in place, preserving form state. [application.css](../../src/app/application.css) owns page geometry and scoped reading/form spacing. At <=850px context precedes the form; both surfaces retain r24, one ink contour, source typography and complete wrapping. The preview is sticky only while collapsed on wide screens, so expanded long descriptions remain naturally scrollable. The CV section is integrated into the form with CvAttachment's row/context label and full custom-text fallback; do not nest a generic panel inside the form. Preserve existing answer/draft/consent/role/snapshot flows and H2/H3 hierarchy.

Offer action spacing belongs to the host marketplace adaptation: React links/buttons need the same 10px sibling separation as the source `.button` actions. Do not rely on reference class names absent from the receiving markup.

## Context return links

[BackLink](../../src/components/back-link.tsx) owns contextual return anatomy on offer detail, application and recruiting detail. Use its `to` and text children rather than recreating an arrow plus Link in a page. It follows C13: ink sans 13px (12px <=700px), 17px decorative arrow, 9px gap, 36px minimum height, source underline and existing shared pointer/hover/focus feedback. Page CSS owns only breadcrumb/container layout and spacing. Keep actual hash routes and destination-specific text (“Wróć do oferty” for one offer, “Wróć do ofert” for the listing). C17 unavailable-page recovery remains a separate CTA. Do not restore old application/breadcrumb anchor overrides.

## Success confetti (host motion extension)

[ConfettiBurst](../../src/components/confetti-burst.tsx) is a decorative portal using a supplied viewport origin and the existing pink/yellow/ink palette. It is aria-hidden, noninteractive, clipped to the viewport, and removed when its owner unmounts. The application sends through the existing local operation first; only successful submission shows the disabled success button and a single 850ms burst, then redirects after 900ms. A synchronous guard prevents repeated submissions. Validation failures, draft saves and an already submitted record never celebrate. Reduced motion skips both the portal and waiting period; a CSS guard also hides decoration if the preference changes. The redirect timer is cleared on unmount. This is a requested host interaction, not an observed v1 motion pattern; keep the immutable kit unchanged. Do not move confetti into generic Button clicks or use it as the sole confirmation.
