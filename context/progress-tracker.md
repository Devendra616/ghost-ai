# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Project Dialogs

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

## In Progress

- None currently.

## Next Up

- Select the next feature spec or subsystem for implementation.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

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
