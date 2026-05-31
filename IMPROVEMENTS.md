# Aura Report Mobile -- Recommendations for Improvement

This document outlines actionable recommendations for improving the Aura Report Mobile codebase. Each section targets a specific area of concern, with concrete steps, code examples, and migration paths.

---

## 1. Architecture & Project Structure

### 1.1 Upgrade Expo SDK from 50 to 52

The project is pinned to Expo SDK 50 (`expo: ~50.0.14`, `react-native: 0.73.6`). SDK 52 brings React Native 0.76 with the New Architecture enabled by default, improved `expo-router` v4, and security patches across the board.

**Migration path (do this incrementally, one major version at a time):**

```bash
# Step 1: SDK 50 -> 51
npx expo install expo@^51.0.0 --fix
npx expo-doctor

# Step 2: SDK 51 -> 52
npx expo install expo@^52.0.0 --fix
npx expo-doctor
```

**Breaking changes to watch for:**

| Area | What changes |
|---|---|
| `expo-router` | v3 -> v4. `useSearchParams` replaced by `useLocalSearchParams` / `useGlobalSearchParams`. Route groups may need review. |
| `react-native-reanimated` | Must upgrade to v3.16+ (you are already on 3.16.2, but verify compatibility). |
| `expo-auth-session` | API surface is stable but version constraints change. Run `npx expo install --fix` to resolve. |
| `nativewind` | v4 should remain compatible, but re-run `npx pod-install` and verify Tailwind class resolution. |
| `react-native-safe-area-context` | SDK 52 pins a newer version. Let `--fix` handle it. |

**Action items:**
1. Create a branch `chore/expo-sdk-upgrade`.
2. Upgrade one SDK version at a time. Run `npx expo-doctor` after each.
3. Fix any TypeScript errors surfaced by new type definitions.
4. Test auth flow end-to-end (Keycloak PKCE exchange is sensitive to `expo-auth-session` changes).

---

### 1.2 Migrate to Feature-Based (Domain-Driven) Folder Structure

The current structure separates code by technical layer (`lib/hooks/`, `lib/requests/`, `types/data/`), which scatters related domain logic across the tree. For example, "lessons" touches five separate directories:

- `lib/requests/lesson.ts` (API calls)
- `lib/hooks/lessons-queries.ts` (React Query hooks)
- `types/data/Lesson.ts` (types)
- `components/ui/LessonCard.tsx` (UI)
- `app/(authenticated)/parent-client/(tabs)/lessons.tsx` (screen)

**Proposed structure:**

```
src/
  app/                              # expo-router file-based routes (keep thin)
    _layout.tsx
    index.tsx
    (auth)/
      _layout.tsx
      sign-in.tsx
      sign-up.tsx
      forgot-password.tsx
      reset-password.tsx
    (authenticated)/
      _layout.tsx                   # Auth guard + error boundary
      index.tsx                     # Role-based redirect
      parent-client/(tabs)/
        _layout.tsx
        index.tsx                   # imports from @/features/home
        lessons.tsx                 # imports from @/features/lessons
        progress.tsx                # imports from @/features/progress
        account.tsx                 # imports from @/features/account
      educator/(tabs)/
        _layout.tsx
        ...

  features/                         # Domain modules (the core of the app)
    lessons/
      api/
        lesson.requests.ts          # Axios calls
        lesson.queries.ts           # React Query hooks
        lesson.keys.ts              # Query key factory
      components/
        LessonCard.tsx
        LessonList.tsx
        LessonDetailSheet.tsx
      types/
        lesson.types.ts             # Zod schemas + inferred types
      hooks/
        useLessonFilters.ts         # UI-only hooks (not data fetching)
      index.ts                      # Public barrel export

    students/
      api/
        student.requests.ts
        student.queries.ts
        student.keys.ts
      components/
        StudentCard.tsx
      types/
        student.types.ts
      index.ts

    institutions/
      api/
      components/
      types/
      hooks/
        useInstitutionContext.ts     # Moved from providers/
      index.ts

    auth/
      providers/
        AuthProvider.tsx
      hooks/
        useAuthGuard.ts
      types/
        auth.types.ts
      index.ts

  components/                        # Shared, domain-agnostic UI primitives
    ui/
      Button.tsx
      Card.tsx
      CardList.tsx
      Divider.tsx
      Dropdown.tsx
      Header.tsx
      Spacer.tsx
      inputs/
      loading/
      progress-bar/
    graphs/
      GraphView.tsx
    layout/
      ScreenContainer.tsx
      TabBar.tsx

  lib/                               # Infrastructure (no business logic)
    api-client.ts                    # Axios instance + interceptors
    secure-store.ts
    auth/
      oidc.ts

  utils/                             # Pure utility functions
    date-time.ts
    env.ts
    id.ts

  constants/
    colors.ts
    dimensions.ts
```

**Key principles behind this layout:**

1. **Route files stay thin.** A screen file in `app/` should import a feature component and render it -- nothing more. This keeps expo-router's file-based routing from becoming a dumping ground.

   ```tsx
   // app/(authenticated)/parent-client/(tabs)/lessons.tsx
   import { LessonsScreen } from "@/features/lessons";

   export default function LessonsRoute() {
     return <LessonsScreen />;
   }
   ```

2. **Feature barrels control the public API.** Each feature's `index.ts` explicitly exports only what other features may consume. Internal components and hooks remain private to the feature.

   ```ts
   // features/lessons/index.ts
   export { LessonsScreen } from "./components/LessonsScreen";
   export { useLessons } from "./api/lesson.queries";
   export type { Lesson, ExpandedLesson } from "./types/lesson.types";
   ```

3. **Cross-feature imports go through barrels, never into internals.** If `features/progress` needs lesson data, it imports from `@/features/lessons`, not from `@/features/lessons/api/lesson.requests`.

4. **Shared UI lives in `components/ui/`.** If a component is used by two or more features, promote it to `components/ui/`. If it is used by only one feature, it stays inside that feature.

**Migration strategy (incremental, not big-bang):**

1. Create the `features/` directory.
2. Pick one domain (e.g., `lessons`). Move its requests, queries, types, and components into `features/lessons/`. Update imports.
3. Verify the app still builds and runs.
4. Repeat for the next domain.
5. Once all domains are migrated, delete the now-empty `lib/hooks/`, `lib/requests/`, and `types/data/` directories.

**Update `tsconfig.json` path aliases:**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

---

### 1.3 Establish a Layered Architecture

The current codebase already has a nascent two-layer split (`lib/requests/` for API calls, `lib/hooks/` for React Query wrappers), but there is no consistent contract between layers, and screen components sometimes reach directly into the request layer.

**Proposed layers (from bottom to top):**

```
┌─────────────────────────────────────────────────┐
│  Screen / Route             (app/)              │  Renders feature components.
├─────────────────────────────────────────────────┤
│  Feature Component          (features/*/components) │  Composes UI primitives + hooks.
├─────────────────────────────────────────────────┤
│  Custom Hooks               (features/*/hooks)  │  UI state, derived data, navigation.
├─────────────────────────────────────────────────┤
│  Data Hooks (React Query)   (features/*/api)    │  useQuery / useMutation wrappers.
├─────────────────────────────────────────────────┤
│  Request Functions          (features/*/api)    │  Plain async functions, Axios calls.
├─────────────────────────────────────────────────┤
│  API Client                 (lib/api-client.ts) │  Axios instance, interceptors, retry.
└─────────────────────────────────────────────────┘
```

**Rules:**

- **Screens never import request functions directly.** They use hooks.
- **Data hooks (React Query) are the only consumers of request functions.** This ensures all server state flows through the cache.
- **Request functions are pure async functions** -- no React, no hooks, no side effects beyond the HTTP call.
- **The API client is configured once** and injected into request functions via import.

**Concrete example -- refactoring the current lessons code:**

```ts
// features/lessons/api/lesson.requests.ts
// Pure functions. No React imports. Easily unit-testable.

import { apiClient } from "@/lib/api-client";
import type { ExpandedLesson, CreateLessonDto, UpdateLessonDto } from "../types/lesson.types";

export async function fetchExpandedLessons(institutionId: string): Promise<ExpandedLesson[]> {
  const { data } = await apiClient.get<ExpandedLesson[]>(
    `/api/institutions/${institutionId}/lessons/expand`
  );
  return data;
}

export async function createLesson(
  institutionId: string,
  outletId: string,
  courseId: string,
  body: CreateLessonDto
): Promise<void> {
  await apiClient.post(
    `/api/institutions/${institutionId}/outlets/${outletId}/courses/${courseId}/lessons`,
    body  // Axios serializes objects to JSON automatically -- no JSON.stringify needed
  );
}
```

```ts
// features/lessons/api/lesson.keys.ts
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  byInstitution: (id: string) => [...lessonKeys.lists(), { institutionId: id }] as const,
  byOutlet: (instId: string, outletId: string) =>
    [...lessonKeys.lists(), { institutionId: instId, outletId }] as const,
  detail: (id: string) => [...lessonKeys.all, "detail", id] as const,
};
```

```ts
// features/lessons/api/lesson.queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonKeys } from "./lesson.keys";
import * as lessonApi from "./lesson.requests";

export function useLessons(institutionId: string | undefined) {
  return useQuery({
    queryKey: lessonKeys.byInstitution(institutionId!),
    queryFn: () => lessonApi.fetchExpandedLessons(institutionId!),
    enabled: !!institutionId,
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      institutionId: string;
      outletId: string;
      courseId: string;
      body: CreateLessonDto;
    }) => lessonApi.createLesson(params.institutionId, params.outletId, params.courseId, params.body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: lessonKeys.byInstitution(vars.institutionId) });
    },
  });
}
```

**Fixing `JSON.stringify` misuse in current request functions:**

The current `lesson.ts` does `apiClient.post(url, JSON.stringify(requestBody))`. Axios already serializes objects to JSON when `Content-Type` is `application/json` (which your interceptor sets). Double-serializing produces a quoted string instead of a JSON object. Remove all `JSON.stringify` wrappers around request bodies.

---

### 1.4 Fix the Authorization Component (Web-Only Code in React Native)

`Authorization.tsx` is copied from a Next.js codebase and uses HTML elements (`div`, `button`, `ul`, `li`), `onClick`, `@radix-ui/react-icons`, and `"use client"` -- none of which work in React Native.

**Rewrite for React Native:**

```tsx
// features/auth/components/Authorization.tsx
import React, { PropsWithChildren } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import LoadingComponent from "@/components/ui/loading/LoadingComponent";
import { useAuth } from "../providers/AuthProvider";

type AuthorizationProps = {
  allowedRoles?: string[];
  hideContent?: boolean;
} & PropsWithChildren;

export default function Authorization({
  hideContent,
  children,
  allowedRoles,
}: AuthorizationProps) {
  const { isAuthenticated, roles, loginUser } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <FontAwesome name="lock" size={64} color="#fdba74" />
        <Text style={styles.message}>Unauthenticated</Text>
        <Pressable style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess && hideContent) return null;

  if (!hasAccess) {
    return (
      <View style={styles.center}>
        <FontAwesome name="exclamation-triangle" size={64} color="#fdba74" />
        <Text style={styles.message}>Unauthorized. Required roles:</Text>
        {allowedRoles.map((role) => (
          <Text key={role} style={styles.role}>- {role}</Text>
        ))}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  message: { fontSize: 16, color: "#666" },
  button: { backgroundColor: "#fdba74", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  role: { fontSize: 14, color: "#444" },
});
```

Also remove `@radix-ui/react-icons` from `package.json` -- it is a web-only package and should not be in a React Native project.

---

### 1.5 Add Error Boundaries for Authenticated Routes

The root layout re-exports `ErrorBoundary` from `expo-router`, but there is no error boundary wrapping the authenticated route group. If a query fails or a component throws inside `(authenticated)/`, the entire app crashes to the root error screen with no way to recover.

**Add a per-route-group error boundary:**

```tsx
// app/(authenticated)/_layout.tsx
import { Stack, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/features/auth";

// expo-router picks this up automatically for this route group
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.detail}>{error.message}</Text>
      <Pressable style={styles.button} onPress={retry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/(auth)/home")}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
    </View>
  );
}

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();

  // Guard: redirect unauthenticated users
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parent-client/(tabs)" />
      <Stack.Screen name="educator/(tabs)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  detail: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" },
  button: { backgroundColor: "#3b82f6", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "#3b82f6", fontSize: 14 },
});
```

Additionally, configure React Query's `QueryErrorResetBoundary` to work with the error boundary so that failed queries are retried when the user taps "Try again":

```tsx
// Wrap the authenticated layout's children with QueryErrorResetBoundary
import { QueryErrorResetBoundary } from "@tanstack/react-query";

// Inside the layout:
<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundaryWrapper onReset={reset}>
      <Stack>...</Stack>
    </ErrorBoundaryWrapper>
  )}
</QueryErrorResetBoundary>
```

---

### 1.6 Fix the InstitutionsAndOutletsProvider

`InstitutionsAndOutletsProvider.tsx` has several issues that will cause runtime errors:

1. **References undefined variable `sessionStatus`** (line 121) -- the `useAuth()` hook returns `{ isAuthenticated }`, not `{ session, status }`. This is a copy-paste artifact from the Next.js version.
2. **Uses `"use client"` directive** -- meaningless in React Native and signals this was ported from Next.js without adaptation.
3. **Imports `UnauthenticatedScreen` from `Authorization.tsx`** -- which uses HTML elements (see 1.4 above).
4. **Calls hooks conditionally** (`if (!session) return` before `useQuery`) -- this violates the Rules of Hooks and will crash.

This provider should be rewritten to use the mobile `useAuth()` shape and move the early returns below all hook calls.

---

### 1.7 Component Library Organization

**Current state:** 15+ components in a flat `components/ui/` directory with no naming convention or categorization.

**Recommended organization:**

```
components/
  ui/
    buttons/
      Button.tsx            # Primary, secondary, destructive variants via props
      LinkButton.tsx
      IconButton.tsx
    cards/
      Card.tsx              # Base card shell
      CardList.tsx
      CardListItem.tsx
    inputs/
      TextInput.tsx
      Dropdown.tsx
      DropdownListItem.tsx
      CustomSwitch.tsx
    feedback/
      LoadingSpinner.tsx
      LoadingOverlay.tsx
      EmptyState.tsx
      ErrorState.tsx
    layout/
      Divider.tsx
      Spacer.tsx
      Header.tsx
      ScreenContainer.tsx   # SafeAreaView + scroll + padding wrapper
    progress/
      ProgressBar.tsx
      TaskCompletion.tsx
  graphs/
    GraphView.tsx
```

**Create a `ScreenContainer` wrapper** to eliminate repeated SafeAreaView / padding boilerplate across screens:

```tsx
// components/ui/layout/ScreenContainer.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
};

export function ScreenContainer({ children, scrollable = true, style }: Props) {
  const content = scrollable ? <ScrollView>{children}</ScrollView> : children;

  return (
    <SafeAreaView style={[{ flex: 1, paddingHorizontal: 16 }, style]}>
      {content}
    </SafeAreaView>
  );
}
```

---

### 1.8 Testing Strategy

The project has effectively zero test coverage (one file: `StyledText-test.js`). Here is a practical testing plan organized by test type:

**a) Unit tests -- Jest + React Native Testing Library**

Install the testing stack:

```bash
npx expo install -- --save-dev @testing-library/react-native @testing-library/jest-native
```

Target pure functions and request functions first (highest value, lowest effort):

```ts
// features/lessons/api/__tests__/lesson.requests.test.ts
import { fetchExpandedLessons } from "../lesson.requests";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client");

test("fetchExpandedLessons calls the correct endpoint", async () => {
  const mockData = [{ id: "1", name: "Math 101" }];
  (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

  const result = await fetchExpandedLessons("inst-123");

  expect(apiClient.get).toHaveBeenCalledWith("/api/institutions/inst-123/lessons/expand");
  expect(result).toEqual(mockData);
});
```

**b) Component / integration tests -- RNTL**

Test hooks and components that compose business logic:

```tsx
// features/lessons/components/__tests__/LessonCard.test.tsx
import { render, screen } from "@testing-library/react-native";
import { LessonCard } from "../LessonCard";

test("renders lesson name and time", () => {
  render(<LessonCard name="Math 101" startTime="09:00" endTime="10:00" />);

  expect(screen.getByText("Math 101")).toBeTruthy();
  expect(screen.getByText("09:00 - 10:00")).toBeTruthy();
});
```

**c) E2E tests -- Maestro (recommended over Detox for Expo)**

Detox requires native builds and complex setup. Maestro runs against a dev build with YAML flows and is significantly simpler for Expo projects.

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash
```

```yaml
# e2e/flows/login.yaml
appId: com.aura.report
---
- launchApp
- tapOn: "Sign In"
# Maestro can interact with web views for Keycloak login
- waitForAnimationToEnd
- assertVisible: "Home"
```

```yaml
# e2e/flows/view-lessons.yaml
appId: com.aura.report
---
- launchApp
- runFlow: login.yaml
- tapOn: "Lessons"
- assertVisible: "Math 101"
- scroll:
    direction: DOWN
    duration: 500
```

**d) Recommended test coverage targets:**

| Layer | Tool | Target coverage | Priority |
|---|---|---|---|
| Zod schemas / pure utils | Jest | 90%+ | High -- these are trivial to test |
| Request functions | Jest + mocked Axios | 80%+ | High -- catch API contract drift |
| React Query hooks | RNTL + `renderHook` | 70%+ | Medium |
| UI components | RNTL | 60%+ | Medium |
| Auth flow E2E | Maestro | Happy path + token refresh | High |
| Navigation E2E | Maestro | Tab switching, role-based routing | Medium |

**e) CI integration:**

Add to your CI pipeline (GitHub Actions example):

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
        working-directory: report-mobile
      - run: npm test -- --ci --coverage
        working-directory: report-mobile
```

---

### 1.9 Remove Dead Dependencies and Clean Up

1. **Remove `@radix-ui/react-icons`** -- web-only, not usable in React Native.
2. **Remove `react-native-elements`** -- the project uses NativeWind for styling and custom components. `react-native-elements` adds bundle weight for components you are not using.
3. **Remove `react-dom` and `react-native-web`** unless you actively support a web target. If web is not a target, stripping these reduces install size and avoids confusion about platform support.
4. **Remove `"use client"` directives** from `Authorization.tsx` and `InstitutionsAndOutletsProvider.tsx` -- these are Next.js/RSC directives and are meaningless in React Native.
5. **Remove the legacy web-specific files:** `useColorScheme.web.ts`, `useClientOnlyValue.web.ts`, `+html.tsx`. If you do need web support later, these should be rebuilt intentionally.

---

## 2. Authentication & Authorization Strategy

### 2.1 BFF Pattern vs. Direct OIDC: Architectural Decision

The codebase currently uses direct OIDC from the mobile app to Keycloak via `expo-auth-session`. Given that a BFF (Next.js) already exists, the question is whether mobile should route through it.

**Recommendation: Keep direct OIDC for mobile, use BFF only for web.**

| Concern | Direct OIDC (Current) | BFF Proxy |
|---|---|---|
| Token storage | `expo-secure-store` (hardware-backed keychain) | Server-side session, but mobile still needs offline access |
| PKCE support | Native with `expo-auth-session` | Unnecessary indirection |
| Offline access | Refresh token stored locally | Requires BFF reachability to refresh |
| UMA RPT exchange | Direct with Keycloak | Could proxy, but adds latency |
| Deep linking | Native `com.aura.report://auth/callback` | Would need BFF redirect dance |
| Complexity | Lower | Higher (session sync, cookie management on mobile) |

The BFF pattern solves the problem of keeping tokens out of the browser. Mobile apps do not have this problem -- `expo-secure-store` uses iOS Keychain / Android Keystore, which is more secure than httpOnly cookies. The BFF adds a network hop and an availability dependency with no security benefit for native mobile.

**Exception**: If UMA permission ticket exchange becomes complex (multi-step RPT negotiation), consider a thin API Gateway endpoint that wraps the Keycloak token exchange, rather than a full BFF.

---

### 2.2 Automatic Token Refresh with Axios Interceptors

The current `api-client.ts` attaches the access token but has no mechanism to detect expiry or handle 401 responses. The `refreshUserSession()` in `AuthProvider.tsx` is never called automatically.

**Implement a queue-based interceptor pattern:**

```typescript
// src/lib/api-client.ts
import Axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { AuraSecureStore } from "./secure-store";
import { AccessTokenUtils } from "@/types/auth/AccessToken";
import { env } from "@/utils/env";

export const apiClient = Axios.create({
  baseURL: env.reportApiUrl,
});

// --- Token refresh state (module-scoped, outside React) ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// Injected by AuthProvider at mount time
let refreshTokenFn: (() => Promise<string | null>) | null = null;

export function setTokenRefresher(fn: () => Promise<string | null>) {
  refreshTokenFn = fn;
}

// --- Request interceptor: proactive refresh if token is near expiry ---
async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const store = AuraSecureStore.getInstance();
  let token = await store.getValueFor("access_token");

  if (token) {
    try {
      const decoded = AccessTokenUtils.decodeJWT(token);
      const timeLeft = AccessTokenUtils.getTimeUntilExpiration(decoded);

      // Proactively refresh if less than 60 seconds remain
      if (timeLeft < 60 && refreshTokenFn) {
        const newToken = await refreshTokenFn();
        if (newToken) {
          token = newToken;
        }
      }
    } catch {
      // Token decode failed; let the 401 interceptor handle it
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = "application/json";
  config.headers["Content-Type"] = "application/json";

  return config;
}

// --- Response interceptor: queue-based 401 retry ---
apiClient.interceptors.request.use(authRequestInterceptor);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh completes
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      if (!refreshTokenFn) {
        throw new Error("No token refresher configured");
      }
      const newToken = await refreshTokenFn();
      if (!newToken) {
        throw new Error("Token refresh returned null");
      }
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      // Emit an event or call a logout callback here
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
```

**Wire it up in AuthProvider:**

```typescript
// In AuthProvider.tsx, inside the component body:
import { setTokenRefresher } from "@/lib/api-client";

useEffect(() => {
  setTokenRefresher(async () => {
    if (!discovery) return null;
    const stored = await AuraSecureStore.getInstance().getValueFor("refresh_token");
    if (!stored) return null;

    const tokenResponse = await refreshAsync(
      { refreshToken: stored, clientId: keycloakClientConfig.clientId },
      discovery
    );

    const newAccess = tokenResponse.accessToken;
    await AuraSecureStore.getInstance().save("access_token", newAccess);
    if (tokenResponse.refreshToken) {
      await AuraSecureStore.getInstance().save("refresh_token", tokenResponse.refreshToken);
    }

    // Update React state
    const decoded = AccessTokenUtils.decodeJWT(newAccess);
    setTokenResponse(tokenResponse);
    setRoles(decoded.resource_access["aura-application-client"].roles);
    setTenantIds(decoded.ext_attrs.tenant_ids);
    setRefreshToken(tokenResponse.refreshToken);
    setIsAuthenticated(true);

    return newAccess;
  });
}, [discovery]);
```

This pattern ensures:
- Only one refresh request flies at a time, regardless of how many API calls fail simultaneously.
- All queued requests retry with the new token.
- Proactive refresh avoids 401s in the first place when the token is close to expiry.

---

### 2.3 Session Persistence on App Restart

Currently, `AuthProvider` initializes all state as empty. When the app restarts, the user must log in again despite valid tokens being in `expo-secure-store`.

**Add a session restoration effect at mount time:**

```typescript
// In AuthProvider.tsx, add this effect:
const [isRestoringSession, setIsRestoringSession] = useState(true);

useEffect(() => {
  async function restoreSession() {
    try {
      const store = AuraSecureStore.getInstance();
      const storedAccessToken = await store.getValueFor("access_token");
      const storedRefreshToken = await store.getValueFor("refresh_token");

      if (!storedAccessToken || !storedRefreshToken) {
        setIsRestoringSession(false);
        return;
      }

      const decoded = AccessTokenUtils.decodeJWT(storedAccessToken);

      if (!AccessTokenUtils.isExpired(decoded)) {
        // Token still valid -- restore session from it
        setRoles(decoded.resource_access["aura-application-client"].roles);
        setTenantIds(decoded.ext_attrs.tenant_ids);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);

        // Fetch fresh userInfo if discovery is available
        if (discovery) {
          const tokenResp = new TokenResponse({
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            tokenType: "Bearer",
            expiresIn: AccessTokenUtils.getTimeUntilExpiration(decoded),
          });
          setTokenResponse(tokenResp);
          fetchUserInfo(tokenResp, discovery);
        }
      } else if (discovery) {
        // Access token expired but we have a refresh token -- try refresh
        const tokenResponse = await refreshAsync(
          { refreshToken: storedRefreshToken, clientId: keycloakClientConfig.clientId },
          discovery
        );

        const newDecoded = AccessTokenUtils.decodeJWT(tokenResponse.accessToken);
        setTokenResponse(tokenResponse);
        setRoles(newDecoded.resource_access["aura-application-client"].roles);
        setTenantIds(newDecoded.ext_attrs.tenant_ids);
        setRefreshToken(tokenResponse.refreshToken);
        setIsAuthenticated(true);

        await store.save("access_token", tokenResponse.accessToken);
        if (tokenResponse.refreshToken) {
          await store.save("refresh_token", tokenResponse.refreshToken);
        }
      }
    } catch (error) {
      // Refresh token expired or invalid -- user must re-login
      console.warn("Session restoration failed, requiring fresh login");
      await AuraSecureStore.getInstance().deleteItemFor("access_token");
      await AuraSecureStore.getInstance().deleteItemFor("refresh_token");
    } finally {
      setIsRestoringSession(false);
    }
  }

  restoreSession();
}, [discovery]);

// Guard render until restoration completes
if (!discovery || isRestoringSession) {
  return <ActivityIndicator />;
}
```

---

### 2.4 Extract Token Decoding Logic (DRY)

The same JWT decode-and-set-state block is duplicated in `frontChannelCodeExchange` effect and `refreshUserSession`. Extract it:

```typescript
// src/lib/auth-utils.ts
import { TokenResponse } from "expo-auth-session";
import { AccessTokenUtils, AccessToken } from "@/types/auth/AccessToken";
import { AuraSecureStore } from "@/lib/secure-store";

export type DecodedSession = {
  tokenResponse: TokenResponse;
  accessToken: AccessToken;
  roles: string[];
  tenantIds: string[];
};

export async function processTokenResponse(
  tokenResponse: TokenResponse
): Promise<DecodedSession> {
  const accessToken = AccessTokenUtils.decodeJWT(tokenResponse.accessToken);

  await AuraSecureStore.getInstance().save("access_token", tokenResponse.accessToken);
  if (tokenResponse.refreshToken) {
    await AuraSecureStore.getInstance().save("refresh_token", tokenResponse.refreshToken);
  }

  return {
    tokenResponse,
    accessToken,
    roles: accessToken.resource_access["aura-application-client"].roles,
    tenantIds: accessToken.ext_attrs.tenant_ids,
  };
}
```

Then in AuthProvider, both code paths become:

```typescript
const session = await processTokenResponse(tokenResponse);
setTokenResponse(session.tokenResponse);
setRoles(session.roles);
setTenantIds(session.tenantIds);
setRefreshToken(session.tokenResponse.refreshToken);
setIsAuthenticated(true);
```

---

### 2.5 Replace Web-Only Authorization Component

`Authorization.tsx` uses `div`, `button`, `onClick`, `@radix-ui/react-icons`, and `signIn()` (a next-auth function). None of these work in React Native. Replace it entirely:

```typescript
// src/components/providers/Authorization.tsx
import React, { PropsWithChildren } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "./AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export type AuthorizationProps = {
  allowedRoles?: string[];
  hideContent?: boolean;
} & PropsWithChildren;

export default function Authorization({
  hideContent,
  children,
  allowedRoles,
}: AuthorizationProps) {
  const { isAuthenticated, roles, tenant_ids, loginUser } = useAuth();

  if (!isAuthenticated) {
    return <UnauthenticatedScreen onLogin={loginUser} />;
  }

  // If no roles specified, only authentication is required
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Tenant-aware role check: prefix each allowed role with the first tenant ID
  const tenantAwareRoles = tenant_ids.length > 0
    ? allowedRoles.map((r) => `${tenant_ids[0]}_${r}`)
    : allowedRoles;

  const canAccess = tenantAwareRoles.some((allowedRole) =>
    roles.includes(allowedRole)
  );

  if (!canAccess && hideContent) {
    return null;
  }

  if (!canAccess) {
    return <UnauthorizedScreen allowedRoles={allowedRoles} />;
  }

  return <>{children}</>;
}

function UnauthenticatedScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed-outline" size={64} color="#f59e0b" />
      <Text style={styles.title}>Session Expired</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>
      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
}

function UnauthorizedScreen({ allowedRoles }: { allowedRoles: string[] }) {
  return (
    <View style={styles.container}>
      <Ionicons name="warning-outline" size={64} color="#f59e0b" />
      <Text style={styles.title}>Access Denied</Text>
      <Text style={styles.subtitle}>
        You need one of these roles to access this content:
      </Text>
      {allowedRoles.map((role) => (
        <Text key={role} style={styles.roleItem}>
          {"\u2022"} {role}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  roleItem: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
});
```

---

### 2.6 UMA Integration Patterns for Fine-Grained Permissions

With Keycloak UMA, the mobile app can request Resource Permission Tickets (RPTs) for fine-grained authorization beyond RBAC. This is useful for per-resource access checks (e.g., "can this parent view this student's report?").

**Pattern: On-Demand RPT Exchange**

```typescript
// src/lib/uma-client.ts
import { AuraSecureStore } from "./secure-store";
import { env } from "@/utils/env";

const TOKEN_ENDPOINT = `${env.issuerUrl}/protocol/openid-connect/token`;

type UmaPermission = {
  rsid: string;    // resource ID
  rsname?: string; // resource name
  scopes: string[];
};

/**
 * Exchange an access token for an RPT with specific resource permissions.
 * Use when you need to verify per-resource access (e.g., viewing a specific
 * student's report in a multi-tenant context).
 */
export async function requestRpt(
  resourceId: string,
  scopes: string[] = []
): Promise<{ rpt: string; permissions: UmaPermission[] } | null> {
  const accessToken = await AuraSecureStore.getInstance().getValueFor("access_token");
  if (!accessToken) return null;

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
    audience: "aura-application-client",
  });

  // Request specific resource + scopes if provided
  if (resourceId) {
    let permission = resourceId;
    if (scopes.length > 0) {
      permission += `#${scopes.join(",")}`;
    }
    params.append("permission", permission);
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      // Access denied by Keycloak policy -- user lacks permission
      return null;
    }
    throw new Error(`RPT exchange failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    rpt: data.access_token,
    permissions: data.authorization?.permissions ?? [],
  };
}

/**
 * Check if user has a specific permission without obtaining a full RPT.
 * Lighter weight for simple yes/no authorization checks.
 */
export async function checkPermission(
  resourceId: string,
  scope: string
): Promise<boolean> {
  const accessToken = await AuraSecureStore.getInstance().getValueFor("access_token");
  if (!accessToken) return false;

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
    audience: "aura-application-client",
    permission: `${resourceId}#${scope}`,
    response_mode: "decision",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) return false;
  const data = await response.json();
  return data.result === true;
}
```

**Usage in a component:**

```typescript
// Example: checking if parent can view a specific student report
const canView = await checkPermission(studentReportResourceId, "report:view");
if (!canView) {
  // show access denied
}
```

**When to use RPT vs. RBAC:**
- Use RBAC (roles from access token) for coarse navigation guards: "is this a parent or educator?"
- Use UMA RPT for data-level access: "can this parent view *this specific* student's report?"
- Cache RPT decisions locally with a short TTL (e.g., 5 minutes) to avoid repeated Keycloak round-trips.

---

### 2.7 Security Hardening

#### 2.7.1 Remove Token Logging (Critical)

The current codebase logs full tokens and token responses to the console in multiple locations. In production builds, these can be captured by crash reporting tools, device logs, or attached debuggers.

**Files requiring changes:**

- `AuthProvider.tsx` lines 104-108, 115-121, 143, 169, 172, 222, 265-269 -- remove or replace with safe alternatives
- `api-client.ts` lines 12-14, 29 -- remove token logging

**Replace with safe logging:**

```typescript
// NEVER log tokens. Log only metadata:
if (__DEV__) {
  console.debug("Token received", {
    expiresIn: tokenResponse.expiresIn,
    tokenType: tokenResponse.tokenType,
    hasRefreshToken: !!tokenResponse.refreshToken,
  });
}
```

Use `__DEV__` guards for any debug logging. Strip all `console.log` and `console.debug` calls from production with `babel-plugin-transform-remove-console`:

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ... other plugins
      ...(process.env.NODE_ENV === "production"
        ? [["transform-remove-console", { exclude: ["error", "warn"] }]]
        : []),
    ],
  };
};
```

#### 2.7.2 Certificate Pinning

For communication with Keycloak and the report API, implement certificate pinning to prevent MITM attacks:

```bash
npx expo install react-native-ssl-pinning
```

Note: `react-native-ssl-pinning` replaces `fetch` for pinned requests. For Axios-based API calls, consider using `axios` with a custom adapter, or use `react-native-ssl-pinning` directly for the Keycloak token endpoint calls in `uma-client.ts`. Evaluate the operational cost -- certificate rotation requires app updates.

#### 2.7.3 Biometric Lock for Token Access

Since tokens are in `expo-secure-store`, you can require biometric authentication to access them after the app has been backgrounded:

```typescript
import * as LocalAuthentication from "expo-local-authentication";

async function authenticateBeforeTokenAccess(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to continue",
    disableDeviceFallback: false,
  });
  return result.success;
}
```

---

### 2.8 RP-Initiated Logout with Keycloak

The current `logoutUser()` only revokes the refresh token. It does not terminate the Keycloak server-side session, meaning the browser session cookie may still be valid (the user could re-authenticate without credentials in the embedded browser).

**Implement proper RP-Initiated Logout:**

```typescript
async function logoutUser() {
  const store = AuraSecureStore.getInstance();
  const idToken = await store.getValueFor("id_token"); // Must store id_token at login

  try {
    // 1. Revoke the refresh token
    if (refreshToken && discovery) {
      await revokeAsync(
        { token: refreshToken, clientId: keycloakClientConfig.clientId },
        discovery
      ).catch(() => {
        // Best-effort revocation; proceed with logout even if this fails
      });
    }

    // 2. End the Keycloak session via RP-Initiated Logout (OIDC spec)
    if (discovery?.endSessionEndpoint && idToken) {
      const logoutUrl = `${discovery.endSessionEndpoint}?` +
        `id_token_hint=${encodeURIComponent(idToken)}&` +
        `post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

      await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUri);
    }
  } catch (error) {
    console.warn("Logout encountered an error, clearing local state anyway");
  } finally {
    // 3. Always clear local state regardless of server response
    setIsAuthenticated(false);
    setRoles([]);
    setTenantIds([]);
    setUserInfo(undefined);
    setRefreshToken(undefined);
    setTokenResponse(undefined);
    await store.deleteItemFor("access_token");
    await store.deleteItemFor("refresh_token");
    await store.deleteItemFor("id_token");
    router.replace("/(auth)/home");
  }
}
```

**Prerequisite:** Store the `id_token` during login. Add this to the code exchange effect:

```typescript
if (tokenResponse.idToken) {
  await AuraSecureStore.getInstance().save("id_token", tokenResponse.idToken);
}
```

Also ensure the `post_logout_redirect_uri` (`com.aura.report://auth/callback`) is registered in the Keycloak client configuration under "Valid Post Logout Redirect URIs".

---

### 2.9 Multi-Tenant Auth Patterns

The current implementation reads `tenant_ids` from `ext_attrs` in the JWT but does not enforce tenant context in API calls or handle multi-tenant scenarios beyond role prefixing.

**2.9.1 Tenant Context Header**

Send the active tenant on every API request so the backend can scope queries:

```typescript
// In api-client.ts request interceptor:
const tenantId = await store.getValueFor("active_tenant_id");
if (tenantId) {
  config.headers["X-Tenant-ID"] = tenantId;
}
```

**2.9.2 Tenant Selection and Switching**

When a user belongs to multiple tenants, provide a selection mechanism:

```typescript
// src/hooks/useTenant.ts
import { create } from "zustand";
import { AuraSecureStore } from "@/lib/secure-store";

type TenantStore = {
  activeTenantId: string | null;
  availableTenantIds: string[];
  setActiveTenant: (tenantId: string) => Promise<void>;
  initializeTenants: (tenantIds: string[]) => Promise<void>;
};

export const useTenantStore = create<TenantStore>((set) => ({
  activeTenantId: null,
  availableTenantIds: [],

  setActiveTenant: async (tenantId: string) => {
    await AuraSecureStore.getInstance().save("active_tenant_id", tenantId);
    set({ activeTenantId: tenantId });
  },

  initializeTenants: async (tenantIds: string[]) => {
    const stored = await AuraSecureStore.getInstance().getValueFor("active_tenant_id");
    const activeTenant = stored && tenantIds.includes(stored) ? stored : tenantIds[0];

    if (activeTenant) {
      await AuraSecureStore.getInstance().save("active_tenant_id", activeTenant);
    }

    set({
      availableTenantIds: tenantIds,
      activeTenantId: activeTenant ?? null,
    });
  },
}));
```

Call `initializeTenants(session.tenantIds)` after processing a token response. If `tenantIds.length > 1`, show a tenant picker before navigating to the authenticated area.

**2.9.3 Tenant-Scoped Authorization**

Update the `Authorization` component to use the active tenant for role checks rather than always using `tenant_ids[0]`:

```typescript
// In Authorization.tsx, replace:
const tenantAwareRoles = tenant_ids.length > 0
  ? allowedRoles.map((r) => `${tenant_ids[0]}_${r}`)
  : allowedRoles;

// With:
const { activeTenantId } = useTenantStore();
const tenantAwareRoles = activeTenantId
  ? allowedRoles.map((r) => `${activeTenantId}_${r}`)
  : allowedRoles;
```

---

### 2.10 Implementation Priority

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | Remove token console logging (2.7.1) | 1 hour | Critical security fix |
| P0 | Session persistence on restart (2.3) | 2-3 hours | Users re-login every app restart |
| P1 | Axios 401 interceptor with queue (2.2) | 3-4 hours | API calls fail silently on token expiry |
| P1 | Replace Authorization.tsx (2.5) | 2 hours | Current component crashes on RN |
| P1 | RP-Initiated Logout (2.8) | 2 hours | Keycloak sessions left dangling |
| P1 | Extract token processing (2.4) | 1 hour | Reduces duplication and bugs |
| P2 | Multi-tenant context header (2.9) | 2-3 hours | Required for multi-tenant API calls |
| P2 | UMA RPT integration (2.6) | 3-4 hours | Fine-grained per-resource authorization |
| P3 | Certificate pinning (2.7.2) | 2-3 hours | Defense-in-depth |
| P3 | Biometric lock (2.7.3) | 1-2 hours | Additional security layer |
## 3. Push Notifications & Biometric Authentication

These two capabilities are absent from the current codebase and represent high-impact additions for user engagement (push notifications) and security UX (biometric unlock). The recommendations below are written specifically for the existing stack: Expo SDK 50, `expo-secure-store`, Keycloak via `expo-auth-session`, the `AuraSecureStore` singleton, and the BFF Next.js server.

---

### 3.1 Push Notifications

#### 3.1.1 Package Installation & Expo Configuration

```bash
npx expo install expo-notifications expo-device expo-constants
```

Register the plugin in `app.json`:

```jsonc
// app.json
{
  "expo": {
    // ...existing config...
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff",
          "sounds": [],
          "defaultChannel": "default"
        }
      ]
    ],
    "android": {
      // ...existing config...
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      // ...existing config...
      "entitlements": {
        "aps-environment": "development"
      }
    }
  }
}
```

> **Note:** For production iOS builds, change `aps-environment` to `"production"`. The `google-services.json` file is downloaded from the Firebase Console after creating an Android app entry for `com.aura.report`.

#### 3.1.2 FCM (Android) & APNs (iOS) Configuration

**Android (FCM):**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add an Android app with package name `com.aura.report`.
3. Download `google-services.json` and place it in the `report-mobile/` project root.
4. The `expo-notifications` plugin handles all native FCM integration automatically -- no manual `build.gradle` edits needed with Expo managed workflow.

**iOS (APNs):**

1. In the Apple Developer portal, enable "Push Notifications" capability for the `com.aura.report` App ID.
2. Generate an APNs Key (`.p8` file) -- this is preferred over certificates because a single key works for both development and production.
3. Upload the `.p8` key to your EAS project via `eas credentials` or to Firebase Cloud Messaging settings if routing through FCM.
4. If using EAS Build, Expo handles provisioning profile updates automatically.

**Recommended approach:** Use FCM as the unified delivery layer for both platforms. Firebase accepts APNs keys and proxies to Apple's servers, giving you a single API for both platforms on the BFF side.

#### 3.1.3 Notification Service Module

Create a dedicated notification service that handles permissions, token registration, and listeners:

```typescript
// src/lib/notifications/notification-service.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { AuraSecureStore } from "@/lib/secure-store";
import { apiClient } from "@/lib/api-client";

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static _instance: NotificationService;
  private _expoPushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService._instance) {
      NotificationService._instance = new NotificationService();
    }
    return NotificationService._instance;
  }

  /**
   * Request permission and obtain the device push token.
   * Returns null if permissions are denied or running on a simulator.
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn("Push notifications require a physical device");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Push notification permission not granted");
      return null;
    }

    // Android requires a notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      await Notifications.setNotificationChannelAsync("lessons", {
        name: "Lesson Updates",
        description: "Notifications about upcoming and changed lessons",
        importance: Notifications.AndroidImportance.HIGH,
      });

      await Notifications.setNotificationChannelAsync("progress", {
        name: "Student Progress",
        description: "Updates about student progress and grades",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    // Get the Expo push token (works for both FCM and APNs)
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    this._expoPushToken = tokenData.data;
    return this._expoPushToken;
  }

  /**
   * Register the device token with the backend (BFF).
   * Call this after successful Keycloak authentication.
   */
  async registerTokenWithBackend(userId: string): Promise<void> {
    if (!this._expoPushToken) {
      console.warn("No push token available; skipping backend registration");
      return;
    }

    try {
      await apiClient.post("/notifications/devices", {
        token: this._expoPushToken,
        platform: Platform.OS,
        userId,
      });

      // Persist locally so we can detect token changes
      await AuraSecureStore.getInstance().save(
        "push_token",
        this._expoPushToken
      );
    } catch (error) {
      console.error("Failed to register push token with backend:", error);
    }
  }

  /**
   * Unregister the device token on logout.
   */
  async unregisterToken(): Promise<void> {
    const storedToken =
      await AuraSecureStore.getInstance().getValueFor("push_token");
    if (!storedToken) return;

    try {
      await apiClient.delete("/notifications/devices", {
        data: { token: storedToken },
      });
      await AuraSecureStore.getInstance().deleteItemFor("push_token");
    } catch (error) {
      console.error("Failed to unregister push token:", error);
    }
  }

  get expoPushToken(): string | null {
    return this._expoPushToken;
  }
}
```

#### 3.1.4 Device Token Registration Flow

The token registration must happen **after** successful authentication so the backend can associate the token with the authenticated user. Integrate this into the existing `AuthProvider`:

```typescript
// In AuthProvider.tsx -- add to the code exchange success path,
// after setIsAuthenticated(true):

import { NotificationService } from "@/lib/notifications/notification-service";

// Inside executeCodeExchangeAsync(), after router.replace('/(authenticated)'):
const pushToken = await NotificationService.getInstance()
  .registerForPushNotifications();

if (pushToken && accessToken.sub) {
  await NotificationService.getInstance()
    .registerTokenWithBackend(accessToken.sub);
}
```

Similarly, in the `logoutUser` function, add cleanup:

```typescript
// In logoutUser(), before router.replace('/(auth)/home'):
await NotificationService.getInstance().unregisterToken();
```

**Token refresh handling:** Expo push tokens can change (e.g., after app reinstall or OS update). Add a check on app resume:

```typescript
// src/lib/notifications/useTokenRefresh.ts
import { useEffect } from "react";
import { AuraSecureStore } from "@/lib/secure-store";
import { NotificationService } from "./notification-service";
import { useAuth } from "@/components/providers/AuthProvider";

export function useTokenRefresh() {
  const { userInfo, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !userInfo?.sub) return;

    async function checkTokenFreshness() {
      const service = NotificationService.getInstance();
      const currentToken = await service.registerForPushNotifications();
      const storedToken =
        await AuraSecureStore.getInstance().getValueFor("push_token");

      if (currentToken && currentToken !== storedToken) {
        await service.registerTokenWithBackend(userInfo!.sub);
      }
    }

    checkTokenFreshness();
  }, [isAuthenticated, userInfo]);
}
```

#### 3.1.5 BFF (Next.js) Server-Side Integration

The BFF acts as the notification dispatch layer. It should never expose Firebase credentials to the mobile client.

**Install the Firebase Admin SDK on the BFF:**

```bash
npm install firebase-admin
```

**BFF notification service:**

```typescript
// bff/src/lib/notifications.ts
import * as admin from "firebase-admin";

// Initialize once -- use a service account JSON or env vars
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

interface SendNotificationParams {
  token: string;           // Expo push token or FCM token
  title: string;
  body: string;
  data?: Record<string, string>;  // Custom data for deep linking
  imageUrl?: string;       // Rich notification image
  channelId?: string;      // Android channel
}

export async function sendPushNotification(
  params: SendNotificationParams
): Promise<void> {
  const { token, title, body, data, imageUrl, channelId } = params;

  // If using Expo push tokens (ExponentPushToken[xxx]), use the Expo push API
  if (token.startsWith("ExponentPushToken")) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        data,
        sound: "default",
        channelId: channelId ?? "default",
        ...(imageUrl ? { image: imageUrl } : {}),
      }),
    });
    return;
  }

  // Otherwise, use FCM directly
  await admin.messaging().send({
    token,
    notification: { title, body, imageUrl },
    data,
    android: {
      notification: {
        channelId: channelId ?? "default",
        priority: "high",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          "mutable-content": 1,  // Required for rich notifications on iOS
        },
      },
    },
  });
}
```

**BFF API routes for device registration:**

```typescript
// bff/src/app/api/notifications/devices/route.ts  (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";  // Your database client

export async function POST(request: NextRequest) {
  const { token, platform, userId } = await request.json();

  // Upsert: if this token already exists, update the user association
  await db.deviceToken.upsert({
    where: { token },
    create: { token, platform, userId, createdAt: new Date() },
    update: { userId, updatedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { token } = await request.json();

  await db.deviceToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
```

**Sending notifications from business logic:**

```typescript
// Example: notify parent when a lesson is updated
import { sendPushNotification } from "@/lib/notifications";
import { db } from "@/lib/db";

export async function notifyParentOfLessonChange(
  parentUserId: string,
  lessonId: string,
  lessonTitle: string
) {
  const devices = await db.deviceToken.findMany({
    where: { userId: parentUserId },
  });

  await Promise.allSettled(
    devices.map((device) =>
      sendPushNotification({
        token: device.token,
        title: "Lesson Updated",
        body: `"${lessonTitle}" has been rescheduled. Tap to see details.`,
        data: {
          type: "LESSON_UPDATE",
          lessonId,
          url: "/(authenticated)/parent-client/(tabs)/lessons",
        },
        channelId: "lessons",
      })
    )
  );
}
```

#### 3.1.6 Notification Categories & Actions

Define interactive notification categories so users can take action without opening the app:

```typescript
// src/lib/notifications/notification-categories.ts
import * as Notifications from "expo-notifications";

export async function registerNotificationCategories() {
  await Notifications.setNotificationCategoryAsync("LESSON_REMINDER", [
    {
      identifier: "ACKNOWLEDGE",
      buttonTitle: "Got it",
      options: { opensAppToForeground: false },
    },
    {
      identifier: "VIEW_DETAILS",
      buttonTitle: "View Details",
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync("PROGRESS_UPDATE", [
    {
      identifier: "VIEW_PROGRESS",
      buttonTitle: "View Progress",
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync("MESSAGE", [
    {
      identifier: "REPLY",
      buttonTitle: "Reply",
      options: { opensAppToForeground: true },
      textInput: {
        submitButtonTitle: "Send",
        placeholder: "Type a reply...",
      },
    },
  ]);
}
```

Call `registerNotificationCategories()` once during app startup (e.g., in the root `_layout.tsx` `useEffect`).

#### 3.1.7 Foreground & Background Notification Handling

Create a provider that wraps notification listeners and integrates with `expo-router`:

```typescript
// src/components/providers/NotificationProvider.tsx
import React, { PropsWithChildren, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { registerNotificationCategories } from "@/lib/notifications/notification-categories";
import { useTokenRefresh } from "@/lib/notifications/useTokenRefresh";
import { AppState, AppStateStatus } from "react-native";

export default function NotificationProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Keep push token in sync
  useTokenRefresh();

  useEffect(() => {
    // Register notification action categories
    registerNotificationCategories();

    // Foreground notification received -- the handler set via
    // setNotificationHandler controls display; this listener is for
    // side-effects like updating a badge count in state.
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        console.debug("Notification received in foreground:", data);
        // Optionally update in-app badge count, trigger a query refetch, etc.
      });

    // User tapped a notification (foreground or background)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const actionId = response.actionIdentifier;

        handleNotificationNavigation(data, actionId);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, []);

  // Handle cold-start: app was killed, user tapped a notification to open it
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationNavigation(
          response.notification.request.content.data,
          response.actionIdentifier
        );
      }
    });
  }, []);

  function handleNotificationNavigation(
    data: Record<string, unknown>,
    actionId?: string
  ) {
    // Use the `url` field sent from the BFF to navigate directly
    if (data.url && typeof data.url === "string") {
      // Slight delay to ensure navigation stack is ready
      setTimeout(() => {
        router.push(data.url as any);
      }, 100);
      return;
    }

    // Fallback: route based on notification type
    switch (data.type) {
      case "LESSON_UPDATE":
        router.push(
          `/(authenticated)/parent-client/(tabs)/lessons` as any
        );
        break;
      case "PROGRESS_UPDATE":
        router.push(
          `/(authenticated)/parent-client/(tabs)/progress` as any
        );
        break;
      default:
        router.push("/(authenticated)" as any);
    }
  }

  return <>{children}</>;
}
```

**Integrate into the root layout** -- wrap `NotificationProvider` inside `AuthProvider` so it has access to auth context:

```tsx
// In _layout.tsx, RootLayoutNav:
<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
  <QueryProvider>
    <AuthProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="(authenticated)"
            options={{ title: "Navigation" }}
          />
        </Stack>
      </NotificationProvider>
    </AuthProvider>
  </QueryProvider>
</ThemeProvider>
```

#### 3.1.8 Deep Linking from Notifications

The existing `app.json` already defines `scheme: "com.aura.report"`, and `expo-router` provides file-based routing. Deep linking from notifications works by passing a route path in the notification `data` payload:

```typescript
// On the BFF, when composing a notification:
data: {
  type: "LESSON_UPDATE",
  lessonId: "abc-123",
  url: "/(authenticated)/parent-client/(tabs)/lessons",
}
```

For deep links that need to pass parameters to a specific screen (e.g., a lesson detail page), add a dynamic route:

```
src/app/(authenticated)/parent-client/lesson/[id].tsx
```

Then send the URL as:
```typescript
data: {
  url: "/(authenticated)/parent-client/lesson/abc-123",
}
```

`expo-router` will match this to the dynamic `[id].tsx` route automatically. No additional linking configuration is needed beyond the existing `scheme` in `app.json`.

#### 3.1.9 Rich Notifications (Images & Buttons)

Rich notifications (images, custom buttons) are supported through the Expo push API and FCM:

```typescript
// BFF: Sending a rich notification with an image
await sendPushNotification({
  token: device.token,
  title: "New Progress Report",
  body: "Your child scored 92% on the Math assessment.",
  imageUrl: "https://your-cdn.com/reports/preview-abc123.png",
  data: {
    type: "PROGRESS_UPDATE",
    url: "/(authenticated)/parent-client/(tabs)/progress",
    categoryId: "PROGRESS_UPDATE",   // Maps to the category defined earlier
  },
  channelId: "progress",
});
```

For iOS rich notifications with custom UI (e.g., charts in the notification), you would need a Notification Service Extension. This requires a config plugin or a custom dev client build:

```typescript
// app.json -- add if rich media processing is needed on iOS
{
  "expo": {
    "ios": {
      "entitlements": {
        "aps-environment": "development"
      }
    },
    "plugins": [
      // ... existing plugins ...
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

> **Recommendation:** Start with the standard image support (which works out of the box). Only invest in a Notification Service Extension if you need to render custom content (charts, progress bars) directly in the notification shade.

#### 3.1.10 User Notification Preferences

Allow users to opt in/out of specific notification categories. Store preferences on the backend, keyed by user ID:

```typescript
// src/lib/notifications/useNotificationPreferences.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface NotificationPreferences {
  lessonReminders: boolean;
  progressUpdates: boolean;
  messages: boolean;
  announcements: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  lessonReminders: true,
  progressUpdates: true,
  messages: true,
  announcements: true,
};

export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async (): Promise<NotificationPreferences> => {
      const { data } = await apiClient.get("/notifications/preferences");
      return data;
    },
    placeholderData: DEFAULT_PREFERENCES,
  });

  const mutation = useMutation({
    mutationFn: async (prefs: Partial<NotificationPreferences>) => {
      const { data } = await apiClient.patch(
        "/notifications/preferences",
        prefs
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notification-preferences"],
      });
    },
  });

  return {
    preferences: query.data ?? DEFAULT_PREFERENCES,
    isLoading: query.isPending,
    updatePreferences: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
```

**On the BFF side**, check preferences before sending:

```typescript
export async function sendNotificationIfAllowed(
  userId: string,
  category: keyof NotificationPreferences,
  notification: SendNotificationParams
) {
  const prefs = await db.notificationPreference.findUnique({
    where: { userId },
  });

  if (prefs && !prefs[category]) {
    // User has opted out of this category
    return;
  }

  const devices = await db.deviceToken.findMany({
    where: { userId },
  });

  await Promise.allSettled(
    devices.map((d) => sendPushNotification({ ...notification, token: d.token }))
  );
}
```

---

### 3.2 Biometric Authentication

#### 3.2.1 Package Installation & Configuration

```bash
npx expo install expo-local-authentication
```

Add the plugin to `app.json`:

```jsonc
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-local-authentication"   // <-- add this
    ],
    "ios": {
      // ...existing config...
      "infoPlist": {
        "NSFaceIDUsageDescription": "Aura Report uses Face ID to securely unlock the app without re-entering your password."
      }
    }
  }
}
```

> **Critical for iOS App Store submission:** The `NSFaceIDUsageDescription` string is **required** if your app calls Face ID APIs. Without it, the app will crash on Face ID-capable devices, and Apple will reject the binary.

#### 3.2.2 Biometric Service

Create a service that checks device capabilities and performs authentication:

```typescript
// src/lib/auth/biometric-service.ts
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import { AuraSecureStore } from "@/lib/secure-store";

export type BiometricType = "fingerprint" | "facial" | "iris" | "none";

export interface BiometricCapability {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
}

const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const BIOMETRIC_TIMESTAMP_KEY = "biometric_last_auth";

export class BiometricService {
  private static _instance: BiometricService;

  private constructor() {}

  static getInstance(): BiometricService {
    if (!BiometricService._instance) {
      BiometricService._instance = new BiometricService();
    }
    return BiometricService._instance;
  }

  /**
   * Check what biometric hardware is available and whether the user
   * has enrolled (i.e., has fingerprints or face data registered).
   */
  async getCapability(): Promise<BiometricCapability> {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricType = "none";
    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      )
    ) {
      biometricType = "facial";
    } else if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ) {
      biometricType = "fingerprint";
    } else if (
      supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      biometricType = "iris";
    }

    return { isAvailable, biometricType, isEnrolled };
  }

  /**
   * Prompt the user for biometric authentication.
   * Returns true if authentication succeeded.
   */
  async authenticate(
    promptMessage?: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage ?? "Unlock Aura Report",
      cancelLabel: "Use Password",
      disableDeviceFallback: false,  // Allow PIN/password as fallback
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      // Record successful biometric auth timestamp
      await AuraSecureStore.getInstance().save(
        BIOMETRIC_TIMESTAMP_KEY,
        Date.now().toString()
      );
    }

    return {
      success: result.success,
      error: result.error ?? undefined,
    };
  }

  /**
   * Check whether the user has opted in to biometric unlock.
   */
  async isBiometricEnabled(): Promise<boolean> {
    const value = await AuraSecureStore.getInstance().getValueFor(
      BIOMETRIC_ENABLED_KEY
    );
    return value === "true";
  }

  /**
   * Enable or disable biometric unlock.
   * When enabling, verify biometrics first to confirm the user owns the device.
   */
  async setBiometricEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      const { success } = await this.authenticate(
        "Verify your identity to enable biometric unlock"
      );
      if (!success) return false;
    }

    await AuraSecureStore.getInstance().save(
      BIOMETRIC_ENABLED_KEY,
      enabled.toString()
    );
    return true;
  }

  /**
   * Check whether biometric re-auth is needed based on the timeout policy.
   * Returns true if the last biometric auth was more than `timeoutMs` ago.
   */
  async isLockRequired(timeoutMs: number): Promise<boolean> {
    const lastAuth = await AuraSecureStore.getInstance().getValueFor(
      BIOMETRIC_TIMESTAMP_KEY
    );
    if (!lastAuth) return true;

    const elapsed = Date.now() - parseInt(lastAuth, 10);
    return elapsed > timeoutMs;
  }

  /**
   * Get a human-readable label for the biometric type.
   */
  getBiometricLabel(type: BiometricType): string {
    switch (type) {
      case "facial":
        return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
      case "fingerprint":
        return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
      case "iris":
        return "Iris Recognition";
      default:
        return "Biometrics";
    }
  }
}
```

#### 3.2.3 Integration with Keycloak Auth Flow

The goal: after a user has signed in with Keycloak once, subsequent app opens should unlock with biometrics instead of redirecting to the Keycloak login page. The refresh token (already stored via `AuraSecureStore`) serves as the session credential.

**Flow:**

```
App Launch
    |
    v
Has refresh_token in SecureStore?
    |                      |
   NO                    YES
    |                      |
    v                      v
Go to (auth)/home    Is biometric enabled?
(full Keycloak          |              |
 login flow)           NO            YES
                        |              |
                        v              v
                  Auto-refresh     Prompt biometric
                  with token       |           |
                                 SUCCESS     FAIL
                                   |           |
                                   v           v
                             Refresh token   Show fallback
                             & proceed       PIN/password screen
                                             or full re-auth
```

**Modify `AuthProvider` to support biometric unlock on resume:**

```typescript
// src/components/providers/AuthProvider.tsx  -- additions

import { BiometricService } from "@/lib/auth/biometric-service";
import { AppState, AppStateStatus } from "react-native";
import { useRef, useCallback } from "react";

// --- Inside AuthProvider component ---

const appState = useRef(AppState.currentState);
const [isLocked, setIsLocked] = useState(false);

// App lock timeout: 5 minutes of background time
const LOCK_TIMEOUT_MS = 5 * 60 * 1000;
const backgroundTimestamp = useRef<number>(0);

// Try to restore session from stored refresh token on app launch
useEffect(() => {
  async function tryRestoreSession() {
    const storedRefreshToken =
      await AuraSecureStore.getInstance().getValueFor("refresh_token");

    if (!storedRefreshToken || !discovery) return;

    const biometricService = BiometricService.getInstance();
    const biometricEnabled = await biometricService.isBiometricEnabled();

    if (biometricEnabled) {
      const { success } = await biometricService.authenticate();
      if (!success) {
        // Biometric failed -- user must do full login
        setIsLocked(true);
        return;
      }
    }

    // Attempt silent refresh
    setRefreshToken(storedRefreshToken);
    try {
      const tokenResponse = await refreshAsync(
        {
          refreshToken: storedRefreshToken,
          clientId: keycloakClientConfig.clientId,
        },
        discovery
      );

      if (tokenResponse) {
        const accessToken = AccessTokenUtils.decodeJWT(
          tokenResponse.accessToken
        );
        setTokenResponse(tokenResponse);
        setRoles(
          accessToken.resource_access["aura-application-client"].roles
        );
        setTenantIds(accessToken.ext_attrs.tenant_ids);
        setRefreshToken(tokenResponse.refreshToken);
        setIsAuthenticated(true);

        AuraSecureStore.getInstance().save(
          "access_token",
          tokenResponse.accessToken
        );
        if (tokenResponse.refreshToken) {
          AuraSecureStore.getInstance().save(
            "refresh_token",
            tokenResponse.refreshToken
          );
        }

        router.replace("/(authenticated)");
      }
    } catch (error) {
      console.error("Session restore failed:", error);
      // Refresh token expired -- user must do full login
      AuraSecureStore.getInstance().deleteItemFor("refresh_token");
      AuraSecureStore.getInstance().deleteItemFor("access_token");
    }
  }

  tryRestoreSession();
}, [discovery]);

// Monitor app state for lock timeout
useEffect(() => {
  const subscription = AppState.addEventListener(
    "change",
    handleAppStateChange
  );
  return () => subscription.remove();
}, [isAuthenticated]);

const handleAppStateChange = useCallback(
  async (nextAppState: AppStateStatus) => {
    if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
      // App is going to background -- record timestamp
      backgroundTimestamp.current = Date.now();
    }

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active" &&
      isAuthenticated
    ) {
      // App is coming to foreground -- check if lock is needed
      const elapsed = Date.now() - backgroundTimestamp.current;

      if (elapsed > LOCK_TIMEOUT_MS) {
        const biometricService = BiometricService.getInstance();
        const biometricEnabled = await biometricService.isBiometricEnabled();

        if (biometricEnabled) {
          setIsLocked(true);
          const { success } = await biometricService.authenticate(
            "Welcome back! Verify your identity."
          );
          if (success) {
            setIsLocked(false);
            // Proactively refresh the access token
            refreshUserSession();
          }
          // If biometric fails, isLocked stays true -- show lock screen
        }
      }
    }

    appState.current = nextAppState;
  },
  [isAuthenticated]
);
```

**Add `isLocked` to the AuthData type and context:**

```typescript
// src/types/auth/AuthData.ts
type AuthData = {
  // ...existing fields...
  isLocked: boolean;
  unlockWithBiometrics: () => Promise<boolean>;
};
```

#### 3.2.4 Lock Screen Component

When `isLocked` is true, render a lock screen overlay:

```typescript
// src/components/ui/LockScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/components/providers/AuthProvider";
import { BiometricService } from "@/lib/auth/biometric-service";

export default function LockScreen() {
  const { unlockWithBiometrics, logoutUser } = useAuth();

  async function handleUnlock() {
    const success = await unlockWithBiometrics();
    if (!success) {
      // Optionally show an error or increment failed attempt counter
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Locked</Text>
      <Text style={styles.subtitle}>
        Verify your identity to continue
      </Text>

      <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
        <Text style={styles.unlockText}>Unlock with Biometrics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
        <Text style={styles.logoutText}>Sign in with a different account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  unlockButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  unlockText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    paddingVertical: 12,
  },
  logoutText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
```

**Render the lock screen conditionally in the root layout:**

```tsx
// In _layout.tsx, RootLayoutNav:
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <AuthGate>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen
                  name="(authenticated)"
                  options={{ title: "Navigation" }}
                />
              </Stack>
            </AuthGate>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

// Simple gate that shows lock screen when locked
function AuthGate({ children }: PropsWithChildren) {
  const { isLocked } = useAuth();

  if (isLocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}
```

#### 3.2.5 Biometric Settings UI

Let users enable/disable biometric unlock from their account settings:

```typescript
// src/components/ui/BiometricSettings.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import {
  BiometricService,
  BiometricCapability,
} from "@/lib/auth/biometric-service";

export default function BiometricSettings() {
  const biometricService = BiometricService.getInstance();
  const [capability, setCapability] = useState<BiometricCapability | null>(
    null
  );
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    async function load() {
      const cap = await biometricService.getCapability();
      setCapability(cap);
      const enabled = await biometricService.isBiometricEnabled();
      setIsEnabled(enabled);
    }
    load();
  }, []);

  if (!capability || !capability.isAvailable || !capability.isEnrolled) {
    return (
      <View style={styles.container}>
        <Text style={styles.unavailable}>
          Biometric authentication is not available on this device.
        </Text>
      </View>
    );
  }

  async function handleToggle(value: boolean) {
    const success = await biometricService.setBiometricEnabled(value);
    if (success) {
      setIsEnabled(value);
    } else {
      Alert.alert(
        "Verification Failed",
        "Biometric verification is required to enable this feature."
      );
    }
  }

  const label = biometricService.getBiometricLabel(capability.biometricType);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Unlock with {label}</Text>
          <Text style={styles.description}>
            Use {label} to unlock the app instead of signing in again.
          </Text>
        </View>
        <Switch value={isEnabled} onValueChange={handleToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: { flex: 1, marginRight: 16 },
  label: { fontSize: 16, fontWeight: "600" },
  description: { fontSize: 13, color: "#888", marginTop: 4 },
  unavailable: { fontSize: 14, color: "#999" },
});
```

#### 3.2.6 Secure Token Storage with Biometric Protection

`expo-secure-store` supports requiring biometric authentication to read a stored value. This provides OS-level encryption tied to biometric unlock, which is stronger than application-level biometric gating:

```typescript
// src/lib/secure-store.ts -- enhanced version

import * as SecureStore from "expo-secure-store";

export interface ISecureStore {
  save(key: string, value: string): Promise<void>;
  getValueFor(key: string): Promise<string | null>;
  deleteItemFor(key: string): Promise<void>;
  saveBiometricProtected(key: string, value: string): Promise<void>;
  getBiometricProtected(key: string): Promise<string | null>;
}

export class AuraSecureStore implements ISecureStore {
  private static _instance: AuraSecureStore;
  private constructor() {}

  public static getInstance() {
    if (!AuraSecureStore._instance) {
      return (AuraSecureStore._instance = new AuraSecureStore());
    }
    return AuraSecureStore._instance;
  }

  public async save(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  public async getValueFor(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  public async deleteItemFor(key: string) {
    return SecureStore.deleteItemAsync(key);
  }

  /**
   * Save a value that requires biometric authentication to read.
   * On iOS this uses the Secure Enclave with biometric access control.
   * On Android this uses the AndroidKeyStore with BiometricPrompt.
   */
  public async saveBiometricProtected(
    key: string,
    value: string
  ): Promise<void> {
    return SecureStore.setItemAsync(key, value, {
      requireAuthentication: true,
      authenticationPrompt:
        "Authenticate to access your secure credentials",
    });
  }

  /**
   * Retrieve a value that was stored with biometric protection.
   * The OS will automatically prompt for biometric authentication.
   */
  public async getBiometricProtected(
    key: string
  ): Promise<string | null> {
    return SecureStore.getItemAsync(key, {
      requireAuthentication: true,
      authenticationPrompt: "Authenticate to unlock Aura Report",
    });
  }
}
```

**Usage in `AuthProvider`:** When biometric unlock is enabled, store the refresh token with biometric protection:

```typescript
// When saving the refresh token after login:
if (tokenResponse.refreshToken) {
  const biometricEnabled = await BiometricService.getInstance()
    .isBiometricEnabled();

  if (biometricEnabled) {
    // OS-level biometric protection -- token cannot be read without
    // biometric verification, even if the device is compromised
    await AuraSecureStore.getInstance().saveBiometricProtected(
      "refresh_token",
      tokenResponse.refreshToken
    );
  } else {
    await AuraSecureStore.getInstance().save(
      "refresh_token",
      tokenResponse.refreshToken
    );
  }
}
```

This is the most secure approach because the OS itself enforces biometric verification at the storage level, rather than the app performing a biometric check and then reading an unprotected value.

#### 3.2.7 App Lock Timeout Patterns

Recommended timeout tiers based on the security context of an education app:

| Scenario | Timeout | Behavior |
|---|---|---|
| App backgrounded briefly (< 1 min) | No lock | Resume immediately |
| App backgrounded 1-5 minutes | Soft lock | Show biometric prompt, auto-dismiss on success |
| App backgrounded 5-30 minutes | Hard lock | Show lock screen, require biometric or fallback |
| App backgrounded > 30 minutes | Session refresh | Biometric + silent token refresh |
| App backgrounded > 24 hours | Full re-auth | Redirect to Keycloak login |

Implement this with a tiered check:

```typescript
// src/lib/auth/lock-policy.ts

export type LockLevel = "none" | "soft" | "hard" | "refresh" | "reauth";

const THRESHOLDS = {
  soft: 1 * 60 * 1000,        // 1 minute
  hard: 5 * 60 * 1000,        // 5 minutes
  refresh: 30 * 60 * 1000,    // 30 minutes
  reauth: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export function determineLockLevel(backgroundDurationMs: number): LockLevel {
  if (backgroundDurationMs >= THRESHOLDS.reauth) return "reauth";
  if (backgroundDurationMs >= THRESHOLDS.refresh) return "refresh";
  if (backgroundDurationMs >= THRESHOLDS.hard) return "hard";
  if (backgroundDurationMs >= THRESHOLDS.soft) return "soft";
  return "none";
}
```

Then in the `handleAppStateChange` callback:

```typescript
import { determineLockLevel } from "@/lib/auth/lock-policy";

// Inside handleAppStateChange, when app comes to foreground:
const elapsed = Date.now() - backgroundTimestamp.current;
const lockLevel = determineLockLevel(elapsed);

switch (lockLevel) {
  case "none":
    break;
  case "soft":
  case "hard":
    if (biometricEnabled) {
      setIsLocked(true);
      const { success } = await biometricService.authenticate();
      setIsLocked(!success);
    }
    break;
  case "refresh":
    if (biometricEnabled) {
      setIsLocked(true);
      const { success } = await biometricService.authenticate();
      if (success) {
        setIsLocked(false);
        await refreshUserSession();
      }
    }
    break;
  case "reauth":
    // Force full re-authentication through Keycloak
    await logoutUser();
    break;
}
```

#### 3.2.8 Android BiometricPrompt Configuration

`expo-local-authentication` uses Android's `BiometricPrompt` API under the hood. The key configurations are passed through the `authenticateAsync` options:

```typescript
await LocalAuthentication.authenticateAsync({
  promptMessage: "Unlock Aura Report",
  cancelLabel: "Cancel",
  disableDeviceFallback: false,   // true = biometric only, no PIN fallback
  fallbackLabel: "Use Device PIN", // iOS only
});
```

For Android-specific behavior:
- `disableDeviceFallback: false` allows the user to fall back to their device PIN/pattern/password when biometrics fail.
- The `BiometricPrompt` dialog appearance (title, subtitle, description) is controlled by `promptMessage`.
- Android supports `BIOMETRIC_STRONG` (Class 3) and `BIOMETRIC_WEAK` (Class 2). `expo-local-authentication` defaults to accepting both. If you need Class 3 only (required for some compliance scenarios), this would require a config plugin or bare workflow.

> **Note:** On Android, `expo-secure-store` with `requireAuthentication: true` uses the Android Keystore with `BiometricPrompt`. The Keystore entry is bound to the biometric enrollment -- if the user adds a new fingerprint, the key is invalidated and the stored value becomes inaccessible. Handle this gracefully by catching the error and falling back to full re-authentication.

#### 3.2.9 Implementation Priority & Checklist

**Phase 1 -- Biometric Unlock (1-2 sprints):**

- [ ] Install `expo-local-authentication`, add to `app.json` plugins
- [ ] Add `NSFaceIDUsageDescription` to iOS `infoPlist`
- [ ] Implement `BiometricService` singleton
- [ ] Enhance `AuraSecureStore` with `saveBiometricProtected` / `getBiometricProtected`
- [ ] Add session restore from stored refresh token in `AuthProvider`
- [ ] Implement `AppState` listener for background/foreground lock
- [ ] Build `LockScreen` component
- [ ] Build `BiometricSettings` toggle in account screen
- [ ] Implement lock timeout policy
- [ ] Test on physical iOS device (Face ID) and Android device (fingerprint)

**Phase 2 -- Push Notifications (2-3 sprints):**

- [ ] Install `expo-notifications`, `expo-device`, `expo-constants`
- [ ] Set up Firebase project, add `google-services.json`
- [ ] Configure APNs key in Firebase / EAS
- [ ] Implement `NotificationService` singleton
- [ ] Add device token registration endpoint to BFF
- [ ] Integrate token registration into `AuthProvider` login flow
- [ ] Implement `NotificationProvider` with foreground/background listeners
- [ ] Add deep linking navigation from notification tap
- [ ] Register notification categories and actions
- [ ] Add notification preference endpoints to BFF
- [ ] Build notification preferences UI
- [ ] Implement BFF notification dispatch for lesson updates and progress reports
- [ ] Test on physical devices (push notifications do not work on simulators)
## 4. Missing Mobile Capabilities

The current codebase covers authentication, basic navigation, charting, and image picking, but lacks several capabilities that production-grade mobile education/reporting apps typically require. The table below summarizes every gap, followed by detailed guidance on the highest-priority items.

---

### 4.1 Capability Gap Matrix

| # | Capability | Recommended Library / Approach | Complexity | Priority | Why It Matters for This App |
|---|-----------|-------------------------------|:----------:|:--------:|---------------------------|
| 1 | **Offline Support & Data Sync** | `@tanstack/react-query-persist-client` + `expo-sqlite` (or WatermelonDB) + custom sync | High | **Must-have** | Parents/educators often access reports in areas with poor connectivity (schools, commutes). Lesson data and progress reports must be readable offline. |
| 2 | **App Updates (OTA)** | `expo-updates` | Low | **Must-have** | Push critical fixes (grade calculation bugs, auth patches) without waiting for app store review cycles. |
| 3 | **Crash Reporting & Analytics** | `@sentry/react-native` + `expo-analytics` (or PostHog) | Medium | **Must-have** | An education app handling student data cannot afford silent crashes. Analytics reveal which reports parents actually use. |
| 4 | **Accessibility (a11y)** | Native RN props (`accessibilityLabel`, `accessibilityRole`, `accessibilityHint`), `react-native-a11y` audit tooling | Medium | **Must-have** | Education platforms are subject to legal accessibility requirements (ADA, EN 301 549). Zero `accessibilityLabel` usage was found in the codebase. |
| 5 | **Internationalization (i18n)** | `expo-localization` + `i18next` + `react-i18next` | Medium | **Must-have** | A reporting app serving diverse school communities must support multiple languages. Hardcoded English strings are scattered throughout the UI. |
| 6 | **Deep Linking & Universal Links** | `expo-linking` (already installed) + `expo-router` link config + Apple ASWC / Android App Links | Medium | **Nice-to-have** | Allows teachers to share a direct link to a specific student's report or lesson via email/chat. |
| 7 | **File Download & Sharing** | `expo-file-system` + `expo-sharing` + `expo-print` (for PDF generation) | Medium | **Must-have** | Parents need to download and share progress reports as PDFs. This is a core workflow for a reporting app. |
| 8 | **Camera & Document Scanning** | `expo-camera` + ML Kit OCR (via `react-native-mlkit-ocr`) | High | **Nice-to-have** | Educators could scan handwritten assignments or paper report cards for digitization. |
| 9 | **Haptic Feedback** | `expo-haptics` | Low | **Nice-to-have** | Subtle feedback on button presses, form submissions, and task completion enhances perceived quality. |
| 10 | **App Review/Rating Prompt** | `expo-store-review` | Low | **Nice-to-have** | Prompt satisfied parents to leave ratings after viewing a positive progress report, boosting store ranking. |
| 11 | **Network Status Detection** | `@react-native-community/netinfo` | Low | **Must-have** | Display an offline banner and switch to cached data gracefully. Essential companion to offline support (#1). |
| 12 | **Keyboard Handling** | `KeyboardAvoidingView` (built-in) + `react-native-keyboard-aware-scroll-view` | Low | **Must-have** | Auth forms (`sign-in`, `sign-up`, `forgot-password`) currently have no keyboard avoidance -- inputs get hidden behind the keyboard on smaller devices. |
| 13 | **Performance Monitoring** | `@shopify/react-native-performance` + Flipper (dev) + Sentry Performance (prod) | Medium | **Nice-to-have** | Track screen load times for heavy report views with charts. Identify slow queries before users complain. |
| 14 | **App Icon & Adaptive Icons** | `expo-dynamic-app-icon` (or static config in `app.json`) | Low | **Future** | Dynamic icons could reflect school branding or seasonal themes. Current adaptive icon config exists but is basic. |
| 15 | **Widget Support** | `react-native-android-widget` + iOS WidgetKit (via config plugin) | High | **Future** | A home-screen widget showing "next lesson" or "unread reports" would drive daily engagement, but requires native module work. |
| 16 | **Background Tasks** | `expo-task-manager` + `expo-background-fetch` | High | **Nice-to-have** | Background sync of new reports/grades and push notification triggers. Ensures data freshness when the app is reopened. |
| 17 | **Gesture Handling** | `react-native-gesture-handler` (swipe-to-dismiss, pull-to-refresh patterns) | Medium | **Nice-to-have** | Swipe actions on lesson cards (mark complete, archive) and pull-to-refresh on report lists feel native and expected. |
| 18 | **Form Management** | `react-hook-form` + `zod` (resolver: `@hookform/resolvers/zod`) | Medium | **Must-have** | Auth forms currently use raw `useState` per field with no validation, no error states, and no dirty tracking. Zod is already a dependency -- add react-hook-form to leverage it. |
| 19 | **Client State Management** | `zustand` (lightweight) or `jotai` (atomic) | Low | **Nice-to-have** | React Query handles server state well, but client-only state (UI preferences, filter selections, draft forms) is currently prop-drilled or duplicated in local state. |
| 20 | **CI/CD Pipeline** | EAS Build + EAS Submit + GitHub Actions | Medium | **Must-have** | No `eas.json` exists. Builds are presumably manual. Automated build/test/deploy pipelines are essential before any production release. |

---

### 4.2 Detailed Guidance for Must-Have Items

#### 4.2.1 Offline Support & Data Sync (Priority: Must-Have, Complexity: High)

**Why this is critical**: Parents check reports during school pick-up (often poor cell coverage), on public transit, and in rural areas. Educators review lesson plans in classrooms where Wi-Fi may be unreliable. An education app that shows blank screens offline will be uninstalled.

**Recommended architecture**:

```
expo-sqlite (local DB)
    |
    v
WatermelonDB (ORM layer, lazy-loading, observable queries)
    |
    v
@tanstack/react-query-persist-client (cache persistence)
    |
    v
Custom SyncEngine (conflict resolution, delta sync with backend)
```

**Implementation steps**:
1. Install `@tanstack/query-sync-storage-persister` and `@tanstack/react-query-persist-client`.
2. Configure React Query's `QueryClient` with `gcTime: Infinity` for critical queries (lessons, student progress, reports).
3. Use `expo-sqlite` as the persistence layer for the query cache.
4. For complex relational data (students, lessons, grades), adopt WatermelonDB which provides lazy-loading and observable queries -- important when a parent has multiple children with years of report history.
5. Implement a sync queue that batches mutations made offline and replays them when connectivity returns (pair with NetInfo, item #11).

**Estimated effort**: 2-3 sprints for a robust implementation.

---

#### 4.2.2 Form Management with react-hook-form + Zod (Priority: Must-Have, Complexity: Medium)

**Current problem**: Auth screens (`sign-in.tsx`, `sign-up.tsx`, `forgot-password.tsx`, `reset-password.tsx`) each manage form state with individual `useState` calls. There is no field validation, no error message display, and no prevention of double-submission.

**Recommended approach**:

```bash
npm install react-hook-form @hookform/resolvers
```

Zod is already installed (`^3.25.51`). Create shared validation schemas:

```typescript
// src/lib/validation/auth-schemas.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Name is required'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

Then wire into forms with `useForm({ resolver: zodResolver(signInSchema) })`. This eliminates per-field `useState`, adds real-time validation, and integrates naturally with the existing `GenericInput` component.

**Estimated effort**: 1 sprint to refactor all auth forms + create reusable form input wrappers.

---

#### 4.2.3 Crash Reporting & Analytics (Priority: Must-Have, Complexity: Medium)

**Recommended**: Sentry (`@sentry/react-native`) -- it has first-class Expo support and a dedicated `sentry-expo` config plugin.

```bash
npx expo install @sentry/react-native
```

**Key setup points**:
- Wrap the root `_layout.tsx` with `Sentry.wrap()`.
- Configure source maps upload in `eas.json` (which you will create for CI/CD anyway).
- Add breadcrumbs for navigation events (expo-router provides a `usePathname` hook).
- Tag sessions with user role (`parent`, `educator`) to segment crash reports.
- For analytics, Sentry's session replay or a lightweight alternative like PostHog (`posthog-react-native`) can track which report screens parents visit most.

**Estimated effort**: 1-2 days for basic crash reporting; 1 sprint for full analytics integration.

---

#### 4.2.4 Accessibility (Priority: Must-Have, Complexity: Medium)

**Current state**: The codebase has zero `accessibilityLabel`, `accessibilityRole`, or `accessibilityHint` props across all components. This means the app is effectively unusable with VoiceOver (iOS) or TalkBack (Android).

**Immediate actions**:
1. Audit every `TouchableOpacity`, `Pressable`, and interactive element -- add `accessibilityLabel` and `accessibilityRole`.
2. For charts (`react-native-gifted-charts`), provide `accessibilityLabel` summaries of the data (e.g., "Math progress: 78%, up from 65% last term").
3. Ensure all images have descriptive labels or are marked `accessibilityElementsHidden` if decorative.
4. Support Dynamic Type by avoiding hardcoded font sizes -- NativeWind's `text-base`, `text-lg` classes map well when paired with `allowFontScaling: true` (the default).
5. Test with VoiceOver on iOS simulator (`Cmd + F5`) and the Accessibility Inspector.

**Estimated effort**: 1-2 sprints for a full audit and remediation. Should be done incrementally, screen by screen.

---

#### 4.2.5 CI/CD with EAS (Priority: Must-Have, Complexity: Medium)

**Current state**: No `eas.json`, no GitHub Actions workflows, no automated builds. This means every build is manual via `expo start` / `expo run:*`.

**Recommended pipeline**:

1. **Initialize EAS**: `eas init` and `eas build:configure` to generate `eas.json`.
2. **Build profiles**: Define `development`, `preview`, and `production` profiles.
3. **GitHub Actions workflow**:
   - On PR: Run lint + type-check + tests.
   - On merge to `main`: Trigger `eas build --profile preview` and distribute via internal testing.
   - On release tag: Trigger `eas build --profile production` + `eas submit` to App Store / Google Play.
4. **OTA updates** (pairs with item #2): Configure `expo-updates` with an `eas update` channel so hotfixes skip the store review queue.

**Estimated effort**: 2-3 days for basic pipeline; 1 sprint for full production pipeline with environment management.

---

#### 4.2.6 File Download & Sharing (Priority: Must-Have, Complexity: Medium)

**Why critical**: The entire purpose of this app is *reporting*. Parents will expect to download a progress report as a PDF and share it (via WhatsApp, email, or AirDrop) with tutors, co-parents, or the student themselves.

**Recommended approach**:

```bash
npx expo install expo-file-system expo-sharing expo-print
```

- Use `expo-print` to render an HTML template of the report into a PDF (`Print.printToFileAsync`).
- Save to the app's document directory via `expo-file-system`.
- Present the native share sheet with `expo-sharing`.
- For server-generated PDFs, download with `FileSystem.downloadAsync()` and then share.

**Estimated effort**: 1 sprint for the download/share flow; additional time for polished PDF templates.

---

#### 4.2.7 Keyboard Handling (Priority: Must-Have, Complexity: Low)

**Current problem**: The four auth screens (`sign-in`, `sign-up`, `forgot-password`, `reset-password`) all contain form inputs but no `KeyboardAvoidingView`. On devices with smaller screens (iPhone SE, budget Android phones), the keyboard obscures input fields.

**Quick fix** (can be done in a single PR):
1. Wrap each auth screen's content in React Native's built-in `KeyboardAvoidingView` with `behavior="padding"` (iOS) / `behavior="height"` (Android).
2. For more complex forms, adopt `react-native-keyboard-aware-scroll-view` which auto-scrolls to the focused input.

**Estimated effort**: 1-2 days.

---

#### 4.2.8 Network Status Detection (Priority: Must-Have, Complexity: Low)

**Implementation**:

```bash
npx expo install @react-native-community/netinfo
```

Create a `useNetworkStatus` hook and a global `<OfflineBanner />` component rendered in `_layout.tsx`. When offline:
- Show a persistent banner: "You are offline. Showing cached data."
- Disable mutation buttons (e.g., form submissions) or queue them for replay.
- Pair with React Query's `onlineManager` from `@tanstack/react-query` to automatically pause/resume queries.

**Estimated effort**: 1-2 days.

---

#### 4.2.9 Internationalization (Priority: Must-Have, Complexity: Medium)

**Implementation**:

```bash
npx expo install expo-localization
npm install i18next react-i18next
```

- Use `expo-localization` to detect the device locale.
- Structure translations in `src/i18n/locales/{en,zh,ms,ta}.json` (adjust languages to target demographics).
- Wrap the app root with `I18nextProvider`.
- Replace all hardcoded strings with `t('key')` calls.
- For date/time formatting, `date-fns` (already installed) supports locale-aware formatting via `date-fns/locale`.

**Estimated effort**: 1 sprint for infrastructure + initial language; ongoing effort for each additional locale.

---

### 4.3 Recommended Implementation Roadmap

| Phase | Items | Timeline |
|-------|-------|----------|
| **Phase 1 -- Foundation** | CI/CD (#20), Crash Reporting (#3), Keyboard Handling (#12), Network Status (#11) | Sprint 1-2 |
| **Phase 2 -- Quality** | Form Management (#18), Accessibility (#4), OTA Updates (#2) | Sprint 3-4 |
| **Phase 3 -- Core Features** | File Download & Sharing (#7), i18n (#5), Offline Support (#1) | Sprint 5-7 |
| **Phase 4 -- Polish** | Haptics (#9), Gestures (#17), Deep Linking (#6), Client State (#19), App Review (#10) | Sprint 8-9 |
| **Phase 5 -- Advanced** | Background Tasks (#16), Camera/OCR (#8), Performance Monitoring (#13), Widgets (#15), Dynamic Icons (#14) | Sprint 10+ |

> **Key dependency**: Network Status (#11) should be implemented before or alongside Offline Support (#1), as the offline banner and `onlineManager` integration are prerequisites for a good offline experience. Similarly, CI/CD (#20) should come first because every subsequent feature benefits from automated builds and testing.

