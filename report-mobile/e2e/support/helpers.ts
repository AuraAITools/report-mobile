import { device, element, by, waitFor } from 'detox';

const DEFAULT_TIMEOUT = 10000;

/**
 * Test credentials for Keycloak authentication.
 * These should match a test user provisioned in the Keycloak realm.
 */
export const KEYCLOAK_TEST_USER = {
  username: 'test-parent@example.com',
  password: 'TestPassword123!',
};

/**
 * Wait for an element with the given testID to become visible.
 */
export async function waitForElement(
  testId: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<void> {
  await waitFor(element(by.id(testId)))
    .toBeVisible()
    .withTimeout(timeout);
}

/**
 * Tap an element identified by its testID.
 */
export async function tapById(testId: string): Promise<void> {
  await element(by.id(testId)).tap();
}

/**
 * Tap an element identified by its visible text.
 */
export async function tapByText(text: string): Promise<void> {
  await element(by.text(text)).tap();
}

/**
 * Clear and type text into a field identified by testID.
 */
export async function typeInField(
  testId: string,
  text: string
): Promise<void> {
  await element(by.id(testId)).clearText();
  await element(by.id(testId)).typeText(text);
}

/**
 * Scroll down within a scrollable view until the target element is visible.
 */
export async function scrollDownTo(
  scrollViewId: string,
  targetId: string,
  pixels: number = 200
): Promise<void> {
  await waitFor(element(by.id(targetId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixels, 'down');
}

/**
 * Dismiss the on-screen keyboard in a platform-aware manner.
 */
export async function dismissKeyboard(): Promise<void> {
  if (isIOS()) {
    // Tap on a neutral area to dismiss the keyboard on iOS
    await element(by.id('root')).tap({ x: 0, y: 0 });
  } else {
    await device.pressBack();
  }
}

/**
 * Returns true if the current device platform is Android.
 */
export function isAndroid(): boolean {
  return device.getPlatform() === 'android';
}

/**
 * Returns true if the current device platform is iOS.
 */
export function isIOS(): boolean {
  return device.getPlatform() === 'ios';
}

/**
 * Convert a display label into a kebab-case testID.
 * e.g. "Sign In" -> "sign-in", "Full Name" -> "full-name"
 */
export function toTestID(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate a tab testID from the tab name.
 * e.g. "Lessons" -> "tab-lessons"
 */
export function toTabTestID(tabName: string): string {
  return `tab-${tabName.toLowerCase()}`;
}

/**
 * Alias for waitForElement that matches the name used in step definitions.
 */
export async function waitForElementVisible(
  testID: string,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<void> {
  await waitForElement(testID, timeout);
}

/**
 * Perform a full login flow as a parent user.
 * Taps the sign-in button and completes Keycloak authentication.
 */
export async function loginAsParent(): Promise<void> {
  // Wait for the sign-in screen to appear
  await waitForElement('screen-sign-in');

  // Tap sign-in to open Keycloak web view
  await element(by.id('button-sign-in')).tap();

  // Complete Keycloak web authentication
  // NOTE: web.element and by.web.id target HTML elements inside the
  // embedded Keycloak browser. Update selectors if the Keycloak theme changes.
  await waitFor(element(by.id('button-sign-in')))
    .not.toBeVisible()
    .withTimeout(10000);

  const usernameField = web.element(by.web.id('username'));
  const passwordField = web.element(by.web.id('password'));
  const loginButton = web.element(by.web.id('kc-login'));

  await usernameField.tap();
  await usernameField.typeText(KEYCLOAK_TEST_USER.username, false);

  await passwordField.tap();
  await passwordField.typeText(KEYCLOAK_TEST_USER.password, false);

  await loginButton.tap();
}
