# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Ready For Next Feature

## Current Goal

- Select the next feature spec or subsystem for implementation.

## Completed

- Installed and configured shadcn/ui with Radix primitives and Lucide icons.
- Added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea UI primitives.
- Added `lib/utils.ts` with reusable `cn()` class merging helper.
- Added dark-only CSS variables and Tailwind token mappings in `app/globals.css`.
- Verified the generated primitives import cleanly from the app shell.
- Added `components/editor/editor-navbar.tsx` with fixed-height left/center/right editor navbar sections and sidebar toggle icon states.
- Added `components/editor/project-sidebar.tsx` with a floating slide-in project sidebar, tabs, empty states, close action, and full-width New Project button.
- Added `components/editor/editor-dialog-pattern.tsx` as the reusable dark-token dialog content pattern for future editor dialogs.
- Added `components/editor/editor-layout.tsx` to compose the editor navbar and project sidebar around editor screen content.
- Updated the home route to render inside the editor layout with a base canvas surface.
- Installed `@clerk/ui` for Clerk's `dark` theme support.
- Added `lib/clerk-appearance.ts` to map Clerk appearance variables to app CSS tokens.
- Wrapped the root app with `ClerkProvider`.
- Added protected-first Clerk `proxy.ts` with public `/`, sign-in, and sign-up routes.
- Added `/sign-in` and `/sign-up` Clerk pages with the two-panel desktop auth layout and form-only mobile layout.
- Tightened the auth page left panel to exactly match the spec: compact logo, tagline, and short text-only feature list.
- Updated auth pages to better match the provided reference: 50/50 desktop split, richer left product panel, icon-backed text feature rows, and a distinct elevated right form panel.
- Made auth shell and Clerk card font usage explicit through the app's Geist Sans token.
- Moved the editor shell to `/editor` and changed `/` into an auth-aware redirect route.
- Added Clerk `UserButton` to the editor navbar.
- Added standard Clerk public URL and fallback redirect environment variables for `/sign-in`, `/sign-up`, and `/editor`.
- Set Clerk's global post-sign-out URL to `/sign-in` so profile logout does not pause on the root redirect page.
- Normalized Clerk sign-in and sign-up environment URLs to pathnames before building protected proxy public-route matchers.
- Completed `context/feature-specs/04-project-dialogs.md` with editor home empty state, mock project dialogs, owned-project sidebar actions, and mobile sidebar scrim.
- Completed `context/feature-specs/05-prisma.md` with project data models, collaborator relations, Prisma client singleton, first migration, and generated Prisma client.
- Completed `context/feature-specs/06-project-apis.md` with backend project list, create, rename, and delete routes.
- Completed `context/feature-specs/07-wire-editor-home.md` with server-fetched editor projects and API-backed project actions.
- Completed `context/feature-specs/08-editor-workspace-shell.md` with server-side project access checks and the protected `/editor/[roomId]` workspace shell.
- Completed `context/feature-specs/09-share-dialog.md` with owner-only collaborator invite/remove APIs, Clerk profile enrichment, read-only collaborator access, and project-link copy feedback.
- Fixed collaborator invites so Clerk profile enrichment falls back to email-only data instead of failing the share request, and normalized Clerk emails before collaborator access checks.
- Tightened collaborator invites to require a registered Clerk user before creating project access.
- Fixed pre-existing stray closing braces in `app/page.tsx` and `proxy.ts` so lint/build verification could run.
- Completed `context/feature-specs/10-liveblock-setup.md` with typed Liveblocks presence/user metadata, cached node client, deterministic cursor colors, and the authenticated Liveblocks room token route.
- Completed `context/feature-specs/11-base-canvas.md` with shared canvas types, a Liveblocks room wrapper, and a React Flow canvas synced through Liveblocks storage.
- Completed `context/feature-specs/12-shape-panel.md` with the draggable shape toolbar, typed shape payloads, drop-to-create nodes, and a basic custom canvas node renderer.
- Completed `context/feature-specs/13-node-shape.md` with proper CSS/SVG node shape rendering and a cursor-following shape drag preview.
- Completed `context/feature-specs/14-node-editing.md` with selected-node resizing, minimum dimensions, centered placeholder labels, and inline collaborative label editing.

## In Progress

- None currently.

## Next Up

- Select the next feature spec or subsystem for implementation.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Project API routes are exempted from proxy-level protection so they can return their specified JSON `401` responses; route handlers still enforce Clerk auth and owner checks before mutations.
- The Liveblocks auth route is also exempted from proxy-level protection so it can return JSON `401`/`403` responses while enforcing Clerk auth and project access inside the route handler.

## Session Notes

- Completed `context/feature-specs/14-node-editing.md`.
- Added selected-node resize handles through React Flow `NodeResizer` with shared minimum node dimensions.
- Added centered empty-label placeholder text and double-click inline textarea editing that updates node labels through `updateNodeData`.
- Prevented textarea pointer and key interactions from dragging or panning the canvas, with editing closing on blur or `Escape`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/14-node-editing.md`: canvas node resizing and inline label editing.
- Fixed canvas node connection handles so selected-node dots render above the shape layer and shaped nodes no longer block handle pointer events.
- Verification passed after handle fix: `npm run lint` and `npm run build`.
- Completed `context/feature-specs/13-node-shape.md`.
- Added `components/editor/node-shape-view.tsx` as the shared shape renderer for canvas nodes and drag previews.
- Replaced the placeholder canvas node with CSS-rendered rectangle, circle, pill, and rhombus variants plus SVG-rendered diamond, pentagon, hexagon, and cylinder variants.
- Added a cursor-following shape drag preview using the same shape type and default size as the drop payload, with cleanup on drop and drag end.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/13-node-shape.md`: proper canvas node shapes and shape drag preview.
- Completed `context/feature-specs/12-shape-panel.md`.
- Added default sizes and drag payload typing for all supported canvas shapes, including pentagon and rhombus.
- Added a floating bottom shape panel with draggable icon buttons for rectangle, diamond, circle, pill, cylinder, pentagon, rhombus, and hexagon.
- Added canvas dragover/drop handling that converts screen coordinates to React Flow coordinates and creates new `canvasNode` nodes with empty labels, default color, default size, and shape-based IDs.
- Added a basic custom canvas node renderer so dropped nodes are visible as bordered rectangles with centered labels.
- Updated `context/ui-context.md` to reflect the expanded eight-shape canvas palette.
- Verification passed: `npm run lint` and `npm run build`.
- Completed `context/feature-specs/11-base-canvas.md`.
- Added `types/canvas.ts` with shared node data, node shape/color constants, and canvas node/edge types.
- Added a Liveblocks-backed canvas room wrapper with initial cursor presence, suspense loading, and connection error fallback.
- Replaced the workspace placeholder with a React Flow canvas using Liveblocks-synced nodes, edges, change handlers, loose connections, fit view, MiniMap, dot background, and collaborative cursors.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/11-base-canvas.md`: Liveblocks-backed React Flow canvas foundation.
- Completed `context/feature-specs/10-liveblock-setup.md`.
- Added `liveblocks.config.ts` typing for cursor presence, AI thinking state, and Liveblocks user metadata.
- Added `lib/liveblocks.ts` with a cached Liveblocks node client and deterministic user cursor color helper.
- Added `POST /api/liveblocks-auth` with Clerk auth, project access verification, private room creation via `getOrCreateRoom`, user metadata, and room-scoped session authorization.
- Added missing `@liveblocks/node` dependency required for the server auth route.
- Fixed the share dialog collaborator loading effect to satisfy the React hook lint rule without changing behavior.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/10-liveblock-setup.md`: Liveblocks config, cached node client, cursor color helper, and authenticated room token route.
- Started `context/feature-specs/09-share-dialog.md`: share dialog UI, collaborator APIs, and Clerk user enrichment.
- Updated collaborator invites to verify the email exists in Clerk before adding access, returning a clear error for unregistered emails.
- Verification passed after registered-user invite check: `npm run lint` and `npm run build`.
- Fixed share dialog collaborator requests by making Clerk profile enrichment best-effort and centralizing collaborator email normalization.
- Verification passed: `npm run lint` and `npm run build`.
- Note: cleared stale generated `.next/dev/types` after a build type-check failure in generated route types.
- Added collaborator listing, invite, and remove route handlers under `/api/projects/[projectId]/collaborators`.
- Added `lib/project-collaborators.ts` for normalized email storage, collaborator serialization, and Clerk Backend API user enrichment.
- Wired the editor navbar Share button to a dark share dialog with project-link copy feedback, owner-only invite/remove controls, and read-only shared-user access.
- Completed `context/feature-specs/09-share-dialog.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/08-editor-workspace-shell.md`: protected workspace shell, access helper, AccessDenied state, and current-project layout.
- Added `lib/project-access.ts` with Clerk identity lookup and owner/collaborator project access helpers.
- Added `components/editor/access-denied.tsx` for missing or unauthorized workspace access.
- Renamed the dynamic workspace route to `/editor/[roomId]` and added server-side auth, access checks, current project loading, and workspace context rendering.
- Updated the editor navbar and layout to show the current project name, share action, AI sidebar toggle, active sidebar project, canvas placeholder, and right AI placeholder.
- Completed `context/feature-specs/08-editor-workspace-shell.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Note: cleared stale generated `.next/dev/types` after renaming the dynamic route from `[projectId]` to `[roomId]`.
- Started `context/feature-specs/07-wire-editor-home.md`: server-fetched project data and real create, rename, and delete actions.
- Added server-side owned and shared project loading for `/editor` and `/editor/[projectId]`.
- Added `hooks/use-project-actions.ts` for create, rename, and delete dialog state plus API mutations.
- Wired the sidebar to real owned/shared project lists and workspace links.
- Updated project dialogs to show room ID preview, pre-fill rename names, and show delete target names.
- Updated project creation to accept a slug-based project ID so project IDs and room IDs stay aligned.
- Completed `context/feature-specs/07-wire-editor-home.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/06-project-apis.md`: backend project API routes for list, create, rename, and delete.
- Added `GET /api/projects` and `POST /api/projects` for owned project listing and creation.
- Added `PATCH /api/projects/[projectId]` and `DELETE /api/projects/[projectId]` with owner-only mutation checks.
- Added request-body parsing helpers for project create/rename validation and default create names.
- Updated the Clerk proxy public matcher for `/api/projects(.*)` so route handlers can return the spec-required `401` response.
- Completed `context/feature-specs/06-project-apis.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/05-prisma.md`: project data models, Prisma client singleton, first migration, and build verification.
- Added `prisma/models/project.prisma` with `Project`, `ProjectCollaborator`, and `ProjectStatus`.
- Added `lib/prisma.ts` as a cached Prisma singleton with `prisma+postgres://` and direct PostgreSQL connection handling.
- Created and applied migration `20260513022010_init_project_models`.
- Verification passed: `npm run lint` and `npm run build`.
- Note: initial sandboxed migration failed with an empty schema engine error; rerunning the same migration with approved database access passed.
- Fixed the `/editor` project sidebar tab layout so the tab list stacks above project cards, preventing the Shared tab content from overlapping owned projects.
- Removed the redundant `Analytics Lakehouse` shared mock project from the sidebar data.
- Started `context/feature-specs/04-project-dialogs.md`: project dialogs, editor home action, sidebar actions, and mobile sidebar scrim.
- Completed `context/feature-specs/04-project-dialogs.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/03-auth.md`: Clerk provider, auth routes, protected proxy, editor route, and user menu.
- Completed `context/feature-specs/03-auth.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Note: initial sandboxed build failed with Windows `spawn EPERM`; rerunning the same build with approved escalation passed.
- Adjusted auth page layout to remove extra large-screen left-panel copy beyond the compact logo, tagline, and short feature list.
- Verification passed after layout adjustment: `npm run lint` and `npm run build`.
- Note: sandboxed build again failed with Windows `spawn EPERM`; rerunning with approved escalation passed.
- Refined auth UI against the screenshot: equal-width panels, brighter product logo, larger left-side messaging, Lucide feature icons, and differentiated right-side form background.
- Verification passed after screenshot-alignment pass: `npm run lint` and `npm run build`.
- Note: sandboxed build again failed with Windows `spawn EPERM`; rerunning with approved escalation passed.
- Completed `context/feature-specs/01-design-system.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Started `context/feature-specs/02-editor.md`: editor navbar, floating project sidebar, and dialog pattern.
- Completed `context/feature-specs/02-editor.md`.
- Verification passed: `npm run lint` and `npm run build`.
- Note: initial sandboxed build failed with Windows `spawn EPERM`; rerunning the same build with approved escalation passed.
- Wired editor navbar and project sidebar into `EditorLayout`, then used that layout on the home route.
- Fixed profile logout redirect by configuring `ClerkProvider` with an explicit `afterSignOutUrl` derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, falling back to `/sign-in`.
- Fixed proxy public route matching when Clerk sign-in/sign-up env vars are configured as full URLs instead of pathnames.
