import { When, Then } from '@cucumber/cucumber';
import { element, by, expect, waitFor } from 'detox';
import {
  KEYCLOAK_TEST_USER,
  waitForElementVisible,
} from '../support/helpers';

/**
 * Tap the sign-in button to begin the Keycloak OIDC login flow.
 */
When('I initiate the login flow', async () => {
  await element(by.id('button-sign-in')).tap();
});

/**
 * Complete the Keycloak authentication inside the embedded web browser.
 *
 * NOTE: This step interacts with a Keycloak-themed web view. If the Keycloak
 * theme or field IDs change, update the selectors below accordingly. The web
 * view matchers use `web.element(by.web.id(...))` which targets HTML element
 * IDs rendered by the Keycloak login page.
 */
When('I complete Keycloak authentication', async () => {
  // Wait for the Keycloak web view to appear (sign-in button should disappear)
  await waitFor(element(by.id('button-sign-in')))
    .not.toBeVisible()
    .withTimeout(10000);

  // Enter credentials into the Keycloak login form
  const usernameField = web.element(by.web.id('username'));
  const passwordField = web.element(by.web.id('password'));
  const loginButton = web.element(by.web.id('kc-login'));

  await usernameField.tap();
  await usernameField.typeText(KEYCLOAK_TEST_USER.username, false);

  await passwordField.tap();
  await passwordField.typeText(KEYCLOAK_TEST_USER.password, false);

  await loginButton.tap();
});

/**
 * Wait for the home screen to appear after authentication completes.
 */
Then('I should be redirected to the home screen', async () => {
  await waitForElementVisible('screen-home', 15000);
});

/**
 * Confirm the sign-out action on the confirmation dialog.
 */
When('I confirm the sign-out action', async () => {
  // Handle native alert / confirmation dialog
  await expect(element(by.text('Sign Out'))).toBeVisible();
  await element(by.text('Confirm')).tap();
});
