# Aura Report — Mobile

Expo 56 · React Native 0.85 · React 19 · expo-router 6 · TypeScript.

For machine setup, pods, prebuild, and troubleshooting, see [`../README.md`](../README.md). This file covers what's specific to working *inside* the app.

## Stack

| Concern | Choice |
| --- | --- |
| Routing | `expo-router` (file-based, `src/app/**`) |
| Styling | NativeWind v4 (Tailwind v3) + shadcn-style HSL theme tokens |
| UI primitives | [React Native Reusables](https://reactnativereusables.com) (`src/components/ui/*`) |
| Icons | `lucide-react-native` (wrap with `@/components/ui/icon` for Tailwind classes) |
| Data fetching | TanStack Query + `graphql-request` |
| GraphQL types | `@graphql-codegen` → `src/generated/graphql` |
| Auth | Keycloak via `expo-auth-session` (OIDC + PKCE) |
| Storage | `expo-secure-store` |
| Animations | `react-native-reanimated` v4 |
| Errors / telemetry | Sentry |
| Tests | Jest (unit) · Detox + Cucumber (E2E) |

## Project layout

```
src/
  app/                      # expo-router screens (file-based routing)
    (auth)/                 # unauthenticated stack
    (authenticated)/        # authenticated stack (wrapped by InstitutionsProvider)
      parent-client/(tabs)/ # parent role tabs
      educator/(tabs)/      # educator role tabs
  components/
    providers/              # Auth, Query, Notification, Institutions, etc.
    ui/                     # RNR primitives (lowercase) + app compositions
      button.tsx text.tsx input.tsx ...   # RNR primitives — DO NOT hand-edit
      LessonCard.tsx password-input.tsx   # app-specific compositions
  features/                 # vertical slices (queries, hooks, types)
  hooks/                    # cross-cutting hooks
  lib/                      # platform/infra (auth, graphql client, sentry, utils, theme)
  generated/                # codegen output
  types/                    # shared TS types
  utils/                    # pure helpers
```

Conventions:
- Path alias: `@/*` → `src/*`.
- RNR primitives live at `src/components/ui/<lowercase>.tsx`. App-specific compositions use PascalCase or kebab-case.
- Every authenticated screen should sit under `src/app/(authenticated)/**` so it inherits `InstitutionsProvider`.
- All screens should wrap their root in `SafeAreaView` from `react-native-safe-area-context` (the root `SafeAreaProvider` is in `src/app/_layout.tsx`).

## Using React Native Reusables

[React Native Reusables (RNR)](https://reactnativereusables.com) is shadcn-for-React-Native: a copy-paste component library on top of NativeWind. Components live in this repo (not in `node_modules`), so they're yours to edit. Don't treat them like an upstream library — read them, tweak them when needed.

### Adding a component

Files land in `src/components/ui/` per `components.json`.

```bash
npx @react-native-reusables/cli@latest add dialog                       # one
npx @react-native-reusables/cli@latest add select dropdown-menu sheet   # several
npx @react-native-reusables/cli@latest add -a                           # all
```

The CLI also installs any deps the component needs (e.g. `@rn-primitives/select`). The `.npmrc` `legacy-peer-deps=true` already in this repo unblocks those installs.

### Importing

Always import from `@/components/ui/<name>`. Every primitive is lowercase, named-export.

```ts
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";              // not "react-native"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
```

### The `<Text>` rule (most common foot-gun)

RNR uses a `TextClassContext` to flow styles from parent to text children (variant colors, button text colors, card foreground, etc.). Raw RN `Text` ignores it.

**Rule:** any text rendered *inside* a RNR component (`Button`, `Card`, `Alert`, `Badge`, …) must be `Text` from `@/components/ui/text`.

```tsx
// ✅ Button text picks up the variant's text color
<Button variant="destructive">
  <Text>Delete</Text>
</Button>

// ❌ Renders as default foreground — the destructive white is dropped
import { Text } from "react-native";
<Button variant="destructive">
  <Text>Delete</Text>
</Button>
```

### Variants

Most primitives are powered by `class-variance-authority`. Pick a `variant` prop, override with `className`.

```tsx
<Button variant="default" size="default">…</Button>
<Button variant="destructive" size="sm">…</Button>
<Button variant="outline" size="lg">…</Button>
<Button variant="ghost">…</Button>
<Button variant="link">…</Button>
<Button variant="default" size="icon" className="rounded-full">…</Button>

<Text variant="h1">…</Text>      // h1–h4, p, blockquote, code, lead, large, small, muted
<Text variant="muted">…</Text>
```

To extend variants, edit the primitive's `cva(...)` directly — it's your code.

### Composition patterns

**Card with sections:**

```tsx
<Card className="m-4">
  <CardHeader>
    <CardTitle>Lesson</CardTitle>
    <CardDescription>Today, 4:30 PM</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Topic: Photosynthesis</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">
      <Text>View details</Text>
    </Button>
  </CardFooter>
</Card>
```

**Alert with a Lucide icon (icon is *required*):**

```tsx
import { CloudOff } from "lucide-react-native";

<Alert icon={CloudOff} variant="destructive">
  <AlertTitle>You're offline</AlertTitle>
  <AlertDescription>Showing cached data</AlertDescription>
</Alert>
```

**Form field (Label + Input):**

```tsx
<View>
  <Label nativeID="email">Email</Label>
  <Input
    aria-labelledby="email"
    placeholder="you@example.com"
    keyboardType="email-address"
    autoCapitalize="none"
    value={email}
    onChangeText={setEmail}
  />
</View>
```

**Link as Button (expo-router):**

```tsx
import { Link } from "expo-router";

<Link href="/(auth)/sign-in" asChild>
  <Button>
    <Text>Sign in</Text>
  </Button>
</Link>
```

**Switch — props are `checked` / `onCheckedChange`, not `value` / `onValueChange`:**

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

### Icons

Use Lucide icons via the `<Icon as={...}>` wrapper so NativeWind classes work (size, color):

```tsx
import { Bell } from "lucide-react-native";
<Icon as={Bell} className="size-5 text-muted-foreground" />
```

Bare Lucide icons work too (`<Bell size={20} color="#666" />`) but lose Tailwind ergonomics.

### Overlays — PortalHost is required

Anything that floats above the screen (`dialog`, `select`, `dropdown-menu`, `popover`, `sheet`, `tooltip`, `alert-dialog`, `menubar`, `context-menu`, `hover-card`) needs `<PortalHost />` mounted at the root. It's already wired in `src/app/_layout.tsx` — don't remove it. If overlays silently fail to render, that's the first thing to check.

### Tweaking a primitive

You own the files. Edit them in place — there's no upstream to rebase against. Two common reasons to edit:

1. **Add a brand variant.** Open the `cva(...)` in `button.tsx`, add `brand: "bg-amber-500 active:bg-amber-600"` to `variants.variant` and the matching text color to `buttonTextVariants`.
2. **Change defaults globally.** Change `defaultVariants` in the `cva` config.

If you ever want to re-pull the upstream version after editing, pass `--overwrite` to the CLI:

```bash
npx @react-native-reusables/cli@latest add button --overwrite
```

### Theming

Tokens live in two synced places:
- `src/global.css` — Tailwind CSS variables (`--primary`, `--background`, …). Primitives reference these (`bg-primary`, `text-foreground`).
- `src/lib/theme.ts` — JS mirror consumed by React Navigation via `NAV_THEME`.

To recolor the app, change both. Dark mode is wired through NativeWind's `darkMode: "class"` — flipping the `.dark` class on the root swaps every primitive at once.

### Quick reference

| Need | Component | Notes |
| --- | --- | --- |
| Button | `Button` + `<Text>` child | variants: default/destructive/outline/secondary/ghost/link |
| Text input | `Input` (+ `Label`) | use `aria-labelledby` to tie them |
| Password input | `PasswordInput` (app-specific) | wraps `Input` + Lucide eye toggle |
| Toggle | `Switch` | `checked` / `onCheckedChange` |
| Divider | `Separator` | `orientation="horizontal"` (default) or `"vertical"` |
| Card | `Card` + Header/Title/Description/Content/Footer | always wrap text in RNR `<Text>` |
| Banner / inline status | `Alert` + `AlertTitle` + `AlertDescription` | `icon` prop is required |
| Loading shimmer | `Skeleton` | place inside content area, set `className="h-X w-Y"` |
| Icon | `Icon as={Lucide}` | Tailwind classes work via `cssInterop` |

## Theming

Theme tokens live in two places, kept in sync:
- `src/global.css` — CSS variables for Tailwind (`--background`, `--foreground`, etc.).
- `src/lib/theme.ts` — JS mirror used by `ThemeProvider` (React Navigation) as `NAV_THEME.light` / `NAV_THEME.dark`.

Edit both when changing the palette. Dark mode toggles via the `.dark` class on the root — NativeWind handles this.

## Running

```bash
nvm use && npm install --legacy-peer-deps    # one-time
npx expo run:ios                              # build dev client first time
npx expo start --dev-client                   # day-to-day (JS-only)
npx expo start --dev-client --clear           # after upgrades / Tailwind cache weirdness
```

Full setup (pods, prebuild, Android, codegen, E2E) → [`../README.md`](../README.md).

## Useful npm scripts

| Script | Purpose |
| --- | --- |
| `npm run codegen` | Generate GraphQL types into `src/generated/graphql` |
| `npm run codegen:watch` | Codegen in watch mode |
| `npm test` | Jest watch |
| `npm run test:ci` | Jest single-pass with coverage |
| `npm run e2e:run:ios` | Detox + Cucumber on iOS |
| `npm run e2e:run:android` | Detox + Cucumber on Android |

## Gotchas

- `.npmrc` sets `legacy-peer-deps=true`. Required while transitive deps lag on React 19. Don't strip it without checking `npm install` still works.
- Babel `react-native-reanimated/plugin` must remain the **last** plugin in `babel.config.js`.
- Metro `inlineRem: 16` must stay in `metro.config.js` — without it, Tailwind rem-based sizes (`h-10`, `text-sm`) render wrong on native.
- The `SafeAreaView is deprecated` warning is suppressed in `_layout.tsx` because `react-native-screens` (transitive via `expo-router`) still ships the deprecated import. Revisit on the next Expo SDK bump.
