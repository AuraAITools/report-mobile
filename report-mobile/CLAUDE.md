# report-mobile

Expo + React Native app. Uses NativeWind, react-native-reusables (shadcn-style components built on `@rn-primitives/*`), TanStack Query, GraphQL Codegen (client preset), expo-router, Keycloak via expo-auth-session.

## Component sourcing

**Before building any UI component from scratch, check [react-native-reusables](https://www.reactnativereusables.com/docs/components) first.** Many primitives we'd otherwise hand-roll (Avatar, Dialog, Dropdown, Tooltip, Accordion, etc.) already exist there as paste-in shadcn-style components.

Process:
1. Check `src/components/ui/` — if it's already added, use it.
2. Otherwise, visit `https://www.reactnativereusables.com/docs/components/<name>` and copy the component source into `src/components/ui/<name>.tsx`.
3. Install the peer `@rn-primitives/<name>` package if the source imports it (match the version pattern of existing primitives in `package.json`).
4. Only fall back to a custom component when rnr does not offer one.

Why: rnr components are tested, accessible, theme-aware, and align with the shadcn/Tailwind aesthetic already established in this project (`components.json` uses the shadcn schema with `style: new-york`).
