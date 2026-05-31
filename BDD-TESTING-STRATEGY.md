# BDD Testing Strategy for Aura Report Mobile

> **Research methodology:** 4 independent agents researched different aspects in isolation (tooling comparison, report/media capabilities, architectural patterns, current project state). Findings synthesized through stochastic consensus — where agents converge independently, confidence is high.

---

## Stochastic Consensus Summary

| Dimension | Agent 1 (Project Analysis) | Agent 2 (Tool Comparison) | Agent 3 (Reports & Media) | Agent 4 (Architecture) | Consensus |
|---|---|---|---|---|---|
| **E2E framework** | Keep Detox + Cucumber.js | Detox best for RN; Maestro if Gherkin relaxed | Detox artifacts work for screenshots | Detox + Screen Objects | **Detox + Cucumber.js** (4/4) |
| **Report tool** | multiple-cucumber-html-reporter (existing) | Allure is best-in-class for video | Allure embeds video natively; mchr does not | — | **Allure + mchr dual** (3/4) |
| **Video capture** | Detox artifact plugins | xcrun simctl / adb screenrecord | xcrun simctl (iOS) + adb (Android) in hooks | — | **Simulator-level recording** (3/3) |
| **Architecture** | Screen Objects missing | — | — | Screen Objects pattern is highest-value refactor | **Screen Objects + Domain steps** (2/2) |
| **Tagging** | — | — | — | @smoke, @regression, @authenticated hooks | **Tag-driven hooks** (unanimous) |
| **Test data** | Hardcoded in helpers.ts | — | — | Extract to fixtures/ | **Fixtures layer** (2/2) |
| **Test pyramid** | All 3 layers needed | Jest + jest-cucumber for unit/component | — | Domain-based organization | **3-layer pyramid** (4/4) |

---

## Architecture Overview

```
                ┌───────────────────────────┐
                │     E2E BDD (10-15%)      │  Detox + Cucumber.js
                │   Critical user journeys  │  Screenshots per step
                │   Real simulator/device   │  Video per scenario
                │   Allure + Cucumber HTML  │
                ├───────────────────────────┤
                │  Component BDD (25-30%)   │  RNTL + jest-cucumber
                │  Screen-level rendering   │  Fast, no simulator
                │  Form validation, states  │  Jest coverage reports
                ├───────────────────────────┤
                │    Unit BDD (55-60%)      │  Jest + jest-cucumber
                │    Business logic, utils  │  Sub-second execution
                │    Zod schemas, helpers   │  Coverage + threshold
                └───────────────────────────┘
```

---

## Recommended Stack

| Layer | Tool | Why (consensus reason) |
|---|---|---|
| E2E runner | **Detox** | Gray-box sync with RN bridge eliminates 80%+ flakiness vs black-box tools |
| BDD parser | **Cucumber.js** v12 | Native Gherkin, community standard, `this.attach()` for media |
| Report (primary) | **Allure** via `allure-cucumberjs` | Native video player, step-by-step screenshots, trend charts |
| Report (fallback) | **multiple-cucumber-html-reporter** | Already installed, simple HTML, good for quick local review |
| Video (iOS) | `xcrun simctl io booted recordVideo` | Native simulator recording, no extra deps |
| Video (Android) | `adb shell screenrecord` | Native emulator recording, 3-min max per clip |
| Component tests | **RNTL** + `jest-cucumber` | Fast, deterministic, Gherkin syntax in Jest |
| Unit tests | **Jest** + `jest-cucumber` | Already configured with `jest-expo` preset |

### Why Not the Alternatives

| Tool | Verdict | Reason |
|---|---|---|
| **Maestro** | Strong alt, but no Gherkin | Best Expo integration, but requires YAML — no native `.feature` file support. Would need custom translation layer (~200 LOC). Consider if Gherkin requirement is ever relaxed. |
| **Appium + WDIO** | Best reports, worst speed | 2-5x slower than Detox, higher flakiness, large dependency tree. Allure can be used with Detox directly via `allure-cucumberjs`. |
| **ReportPortal** | Overkill | Requires self-hosted server. Revisit when test suite exceeds ~50 scenarios. |

---

## Directory Structure

```
e2e/
├── cucumber.js                        # Cucumber runner config (profiles: default, smoke, ios, android)
├── tsconfig.json                      # TypeScript config for e2e tests
│
├── features/                          # Gherkin feature files — organized by domain
│   ├── auth/
│   │   ├── login.feature
│   │   ├── sign-up.feature
│   │   └── forgot-password.feature
│   ├── lessons/
│   │   └── view-lessons.feature
│   ├── progress/
│   │   └── view-progress.feature
│   ├── account/
│   │   └── user-account.feature
│   └── journeys/                      # Cross-domain end-to-end flows
│       └── parent-daily-check.feature
│
├── step-definitions/                  # Steps organized by domain (NOT by feature file)
│   ├── auth.steps.ts
│   ├── lessons.steps.ts
│   ├── progress.steps.ts
│   ├── account.steps.ts
│   ├── navigation.steps.ts           # Tab tapping, screen assertions
│   └── interaction.steps.ts          # Generic button/input/link actions
│
├── screen-objects/                    # Page Object Model for mobile
│   ├── SignInScreen.ts
│   ├── SignUpScreen.ts
│   ├── ForgotPasswordScreen.ts
│   ├── HomeScreen.ts
│   ├── LessonsScreen.ts
│   ├── ProgressScreen.ts
│   ├── AccountScreen.ts
│   ├── KeycloakWebView.ts            # Web view auth flow
│   └── components/                   # Shared component objects
│       ├── BottomTabBar.ts
│       └── LessonCard.ts
│
├── support/
│   ├── world.ts                      # DetoxWorld with screen object accessors
│   ├── hooks.ts                      # Before/After/AfterStep + video recording
│   └── helpers.ts                    # Low-level Detox utilities
│
├── fixtures/
│   ├── users.ts                      # Test credentials (per role)
│   ├── config.ts                     # Environment-aware URLs, timeouts
│   └── lessons.ts                    # Expected data for assertions
│
├── artifacts/                        # Git-ignored runtime output
│   ├── screenshots/
│   └── videos/
│
├── reports/
│   ├── json/                         # Cucumber JSON output
│   ├── html/                         # multiple-cucumber-html-reporter output
│   └── allure-results/               # Allure raw data
│
└── generate-report.ts                # Report generator script
```

---

## Screen Objects Pattern

The highest-value architectural addition. Centralizes all element locators — when UI changes, update one file, not dozens of step definitions.

### testID Naming Convention

| Element | Pattern | Example |
|---|---|---|
| Screen root | `screen-{name}` | `screen-sign-in` |
| Button | `button-{action}` | `button-sign-in` |
| Input | `input-{field}` | `input-email` |
| Tab | `tab-{name}` | `tab-lessons` |
| Card | `{type}-card-{index}` | `lesson-card-0` |
| Scroll view | `{screen}-scroll-view` | `lessons-scroll-view` |

### Screen Object Example

```typescript
// e2e/screen-objects/SignInScreen.ts
import { element, by, expect, waitFor } from 'detox';

export class SignInScreen {
  // --- Locators (private, centralized) ---
  private get root()          { return element(by.id('screen-sign-in')); }
  private get emailInput()    { return element(by.id('input-email')); }
  private get passwordInput() { return element(by.id('input-password')); }
  private get signInButton()  { return element(by.id('button-sign-in')); }
  private get signUpLink()    { return element(by.text('Sign Up')); }

  // --- Actions ---
  async waitUntilVisible(timeout = 10_000) {
    await waitFor(this.root).toBeVisible().withTimeout(timeout);
  }

  async enterCredentials(email: string, password: string) {
    await this.emailInput.clearText();
    await this.emailInput.typeText(email);
    await this.passwordInput.clearText();
    await this.passwordInput.typeText(password);
  }

  async tapSignIn() {
    await this.signInButton.tap();
  }

  async tapSignUp() {
    await this.signUpLink.tap();
  }

  // --- Assertions ---
  async expectVisible() {
    await expect(this.root).toBeVisible();
  }
}
```

### World Object with Screen Object Accessors

```typescript
// e2e/support/world.ts
import { World, setWorldConstructor } from '@cucumber/cucumber';
import { SignInScreen } from '../screen-objects/SignInScreen';
import { HomeScreen } from '../screen-objects/HomeScreen';
import { LessonsScreen } from '../screen-objects/LessonsScreen';

export class DetoxWorld extends World {
  public currentUser: { username: string; password: string } | null = null;

  // Lazy-initialized screen objects
  private _signIn?: SignInScreen;
  get signInScreen() { return this._signIn ??= new SignInScreen(); }

  private _home?: HomeScreen;
  get homeScreen() { return this._home ??= new HomeScreen(); }

  private _lessons?: LessonsScreen;
  get lessonsScreen() { return this._lessons ??= new LessonsScreen(); }
}

setWorldConstructor(DetoxWorld);
```

### Thin Step Definitions

```typescript
// e2e/step-definitions/auth.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { DetoxWorld } from '../support/world';
import { KeycloakWebView } from '../screen-objects/KeycloakWebView';
import { TEST_USERS } from '../fixtures/users';

const keycloak = new KeycloakWebView();

When('I initiate the login flow', async function (this: DetoxWorld) {
  await this.signInScreen.tapSignIn();
});

When('I complete Keycloak authentication', async function (this: DetoxWorld) {
  await keycloak.waitUntilVisible();
  await keycloak.authenticate(
    TEST_USERS.parent.username,
    TEST_USERS.parent.password,
  );
});

Then('I should be redirected to the home screen', async function (this: DetoxWorld) {
  await this.homeScreen.waitUntilVisible(15_000);
});
```

---

## Tagging Strategy

| Tag | Purpose | Scope | CI Behavior |
|---|---|---|---|
| `@smoke` | Critical path — run on every PR | Scenario | Always runs |
| `@regression` | Full suite — run nightly/pre-release | Feature (default) | Nightly cron |
| `@wip` | Work in progress — excluded from CI | Scenario | Excluded |
| `@authenticated` | Auto-login via Before hook | Feature or Scenario | Skips login steps |
| `@ios-only` / `@android-only` | Platform-specific behavior | Scenario | Filtered per platform |
| `@slow` | Long-running (Keycloak flow) | Scenario | Included but flagged |
| `@flaky` | Known flaky — quarantined | Scenario | Excluded from CI |

### Tag-Driven Login Hook

```typescript
// e2e/support/hooks.ts
Before({ tags: '@authenticated' }, async function (this: DetoxWorld) {
  // Perform login automatically — no need for "Given I am logged in" in every Background
  await this.signInScreen.waitUntilVisible();
  await this.signInScreen.tapSignIn();
  await keycloak.authenticate(TEST_USERS.parent.username, TEST_USERS.parent.password);
  await this.homeScreen.waitUntilVisible(15_000);
});
```

### Cucumber Profiles

```javascript
// e2e/cucumber.js
module.exports = {
  default: {
    require: ['e2e/step-definitions/**/*.ts', 'e2e/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:e2e/reports/json/results.json',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: { resultsDir: 'e2e/reports/allure-results' },
    tags: 'not @wip and not @flaky',
  },
  smoke: {
    tags: '@smoke and not @wip',
  },
  ios: {
    tags: 'not @android-only and not @wip and not @flaky',
  },
  android: {
    tags: 'not @ios-only and not @wip and not @flaky',
  },
};
```

---

## Screenshots & Video Recording

### Per-Step Screenshots (already working)

```typescript
AfterStep(async function (this: DetoxWorld, { pickleStep }) {
  const safeName = pickleStep.text.replace(/\W+/g, '_').substring(0, 50);
  try {
    const screenshotPath = await device.takeScreenshot(safeName);
    const img = fs.readFileSync(screenshotPath);
    this.attach(img, 'image/png');  // Embeds in Cucumber JSON → rendered in both Allure and mchr
  } catch {
    // Screenshot may fail during app transitions
  }
});
```

### Per-Scenario Video Recording

```typescript
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

let recordProcess: ChildProcess | null = null;
let videoPath: string = '';

Before(async function (this: DetoxWorld, scenario) {
  const safeName = scenario.pickle.name.replace(/\W+/g, '_').substring(0, 50);
  videoPath = path.join('e2e/artifacts/videos', `${safeName}_${Date.now()}.mp4`);

  const platform = process.env.DETOX_CONFIGURATION?.includes('android') ? 'android' : 'ios';

  if (platform === 'ios') {
    recordProcess = spawn('xcrun', [
      'simctl', 'io', 'booted', 'recordVideo', '--codec=h264', videoPath,
    ]);
  } else {
    // Android: record on device, pull after
    spawn('adb', ['shell', 'screenrecord', '/sdcard/test_recording.mp4']);
  }

  await device.launchApp({ newInstance: true });
});

After(async function (this: DetoxWorld, scenario) {
  const platform = process.env.DETOX_CONFIGURATION?.includes('android') ? 'android' : 'ios';

  // Stop recording
  if (platform === 'ios' && recordProcess) {
    recordProcess.kill('SIGINT');
    await new Promise(r => setTimeout(r, 1500)); // Wait for file finalization
  } else {
    spawn('adb', ['shell', 'pkill', '-INT', 'screenrecord']);
    await new Promise(r => setTimeout(r, 1500));
    spawn('adb', ['pull', '/sdcard/test_recording.mp4', videoPath]);
    await new Promise(r => setTimeout(r, 1000));
  }

  // Attach video to report (Allure renders a player; mchr links it)
  if (fs.existsSync(videoPath)) {
    const video = fs.readFileSync(videoPath);
    this.attach(video, 'video/mp4');
  }

  // Failure screenshot
  if (scenario.result?.status === Status.FAILED) {
    const screenshotPath = await device.takeScreenshot('failure');
    this.attach(fs.readFileSync(screenshotPath), 'image/png');
  }

  await device.terminateApp();
});
```

### Dual Report Generation

```typescript
// e2e/generate-report.ts
import * as mchr from 'multiple-cucumber-html-reporter';
import { execSync } from 'child_process';

// 1. Cucumber HTML Report (lightweight, quick review)
mchr.generate({
  jsonDir: './e2e/reports/json',
  reportPath: './e2e/reports/html',
  reportName: 'Aura Report Mobile — BDD Test Results',
  pageTitle: 'Aura Report E2E',
  displayDuration: true,
  displayReportTime: true,
  metadata: {
    device: 'iPhone 15 Simulator',
    platform: { name: 'iOS', version: '17' },
    app: { name: 'Aura Report', version: '1.0.0' },
  },
});

// 2. Allure Report (rich, with embedded video playback)
execSync('npx allure generate e2e/reports/allure-results -o e2e/reports/allure-report --clean');
console.log('Reports generated:');
console.log('  Cucumber HTML: e2e/reports/html/index.html');
console.log('  Allure:        e2e/reports/allure-report/index.html');
```

---

## Example Feature File

```gherkin
@regression @authenticated
Feature: Parent Views Lessons

  As a parent
  I want to view my child's lesson schedule
  So that I can stay informed about their learning

  @smoke
  Scenario: Lessons list displays on tab tap
    Given I am on the home screen
    When I tap the "Lessons" tab
    Then I should see the lessons screen
    And I should see a list of lesson cards

  Scenario: Each lesson card shows subject and time
    Given I am on the lessons screen
    Then each lesson card should display:
      | field    |
      | subject  |
      | time     |
      | educator |

  Scenario: Pull to refresh updates lessons
    Given I am on the lessons screen
    When I pull down to refresh
    Then the lessons list should reload

  @slow
  Scenario Outline: Navigate from lesson to detail
    Given I am on the lessons screen
    When I tap lesson card <index>
    Then I should see the lesson detail screen
    And the subject should be "<subject>"

    Examples:
      | index | subject |
      | 0     | Science |
      | 1     | Chinese |
      | 2     | Math    |
```

---

## Test Data Management

### Fixtures Layer

```typescript
// e2e/fixtures/users.ts
export const TEST_USERS = {
  parent: {
    username: 'test-parent@example.com',
    password: 'TestPassword123!',
    displayName: 'Test Parent',
  },
  educator: {
    username: 'test-educator@example.com',
    password: 'TestPassword123!',
    displayName: 'Test Educator',
  },
} as const;

// e2e/fixtures/config.ts
export const E2E_CONFIG = {
  keycloakBaseUrl: process.env.E2E_KEYCLOAK_URL ?? 'http://localhost:8080',
  apiBaseUrl: process.env.E2E_API_URL ?? 'http://localhost:3000',
  defaultTimeout: Number(process.env.E2E_TIMEOUT ?? 10_000),
} as const;
```

---

## NPM Scripts

```json
{
  "e2e:build:ios": "detox build --configuration ios.sim.debug",
  "e2e:build:android": "detox build --configuration android.emu.debug",
  "e2e:test": "npx cucumber-js --config e2e/cucumber.js",
  "e2e:test:smoke": "npx cucumber-js --config e2e/cucumber.js --profile smoke",
  "e2e:test:ios": "DETOX_CONFIGURATION=ios.sim.debug npx cucumber-js --config e2e/cucumber.js",
  "e2e:test:android": "DETOX_CONFIGURATION=android.emu.debug npx cucumber-js --config e2e/cucumber.js",
  "e2e:report": "npx ts-node e2e/generate-report.ts",
  "e2e:report:open": "npx allure open e2e/reports/allure-report",
  "e2e:run:ios": "npm run e2e:build:ios && npm run e2e:test:ios && npm run e2e:report"
}
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/bdd-tests.yml
name: BDD Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  # Fast layer — every PR
  unit-component-bdd:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
        working-directory: report-mobile
      - run: npx jest --ci --coverage --passWithNoTests
        working-directory: report-mobile

  # E2E smoke — every PR (only critical paths)
  e2e-smoke-ios:
    needs: unit-component-bdd
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
        working-directory: report-mobile
      - run: npx expo prebuild --platform ios
        working-directory: report-mobile
      - run: npx detox build --configuration ios.sim.debug
        working-directory: report-mobile
      - name: Run smoke tests
        run: npm run e2e:test:smoke
        working-directory: report-mobile
        continue-on-error: true
      - run: npm run e2e:report
        working-directory: report-mobile
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: bdd-smoke-report
          path: |
            report-mobile/e2e/reports/html/
            report-mobile/e2e/reports/allure-report/
            report-mobile/e2e/artifacts/videos/
          retention-days: 30

  # Full regression — nightly
  e2e-regression:
    if: github.event_name == 'schedule'
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npx expo prebuild --platform ios
        working-directory: report-mobile
      - run: npx detox build --configuration ios.sim.debug
        working-directory: report-mobile
      - run: npm run e2e:test:ios
        working-directory: report-mobile
        continue-on-error: true
      - run: npm run e2e:report
        working-directory: report-mobile
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: bdd-regression-report
          path: |
            report-mobile/e2e/reports/html/
            report-mobile/e2e/reports/allure-report/
            report-mobile/e2e/artifacts/
          retention-days: 30
```

---

## Implementation Phases

| Phase | Scope | Key Deliverables |
|---|---|---|
| **1. Foundation** | Add `testID` props to all interactive components using naming convention | App ready for E2E |
| **2. Screen Objects** | Create screen object classes for all 7 screens + KeycloakWebView | Locators centralized |
| **3. Fixtures** | Extract test users, config, expected data from helpers into `fixtures/` | Clean data layer |
| **4. Allure** | Install `allure-cucumberjs`, add to cucumber.js formatters, dual report gen | Rich reports with video |
| **5. Video** | Add `xcrun simctl` / `adb screenrecord` in Before/After hooks | Per-scenario recordings |
| **6. Tags** | Add @smoke, @regression, @authenticated tags to all features | Filtered CI runs |
| **7. Journeys** | Write 2-3 cross-domain journey features (login → lessons → progress) | Real user flow coverage |
| **8. Component BDD** | Set up jest-cucumber + RNTL for form validation, conditional rendering | Fast BDD layer |
| **9. CI** | GitHub Actions workflow with smoke (PR) + regression (nightly) | Automated pipeline |

---

## Dependencies to Install

```bash
# E2E (most already installed)
npm install -D allure-cucumberjs allure-js-commons

# Allure CLI (for report generation)
brew install allure  # or: npm install -D allure-commandline

# Component BDD (if not already installed)
npm install -D jest-cucumber
```

---

## Key Decisions Log

| Decision | Rationale | Alternatives Considered |
|---|---|---|
| Keep Detox over Maestro | Gherkin is a hard requirement; Maestro has no native Gherkin | Maestro (no Gherkin), custom YAML translator (fragile) |
| Add Allure alongside mchr | Allure embeds video natively; mchr cannot | Replace mchr entirely (but mchr is simpler for quick local checks) |
| Screen Objects over inline locators | Single point of change when UI updates; step defs stay thin | Shared helper functions (doesn't scale as well) |
| Domain-based step organization | Cucumber anti-pattern: feature-coupled steps cause duplication | Per-feature steps (official anti-pattern) |
| `@authenticated` hook over Background step | Faster, DRYer, scenarios stay declarative | `Given I am logged in` in every Background (verbose, slow) |
| Simulator-level video recording | No extra deps, works with Cucumber hooks | Detox artifact plugin (designed for Jest runner, not Cucumber) |
| Dual reports (Allure + mchr) | Allure for stakeholders, mchr for developer quick checks | Single reporter (sacrifices either richness or simplicity) |
