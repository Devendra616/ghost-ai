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
- Fixed pre-existing stray closing braces in `app/page.tsx` and `proxy.ts` so lint/build verification could run.

## In Progress

- None currently.

## Next Up

- Select the next feature spec or subsystem for implementation.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Project API routes are exempted from proxy-level protection so they can return their specified JSON `401` responses; route handlers still enforce Clerk auth and owner checks before mutations.

## Session Notes

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
