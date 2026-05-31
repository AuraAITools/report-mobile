import { Then, When } from '@cucumber/cucumber';
import { element, by, expect } from 'detox';
import { waitForElementVisible } from '../support/helpers';

/**
 * Assert that the user information section is visible on the account screen.
 */
Then('I should see my user information', async () => {
  await waitForElementVisible('user-info');
});

/**
 * Assert that the biometric unlock settings toggle is visible.
 */
Then('I should see the biometric unlock setting', async () => {
  await expect(element(by.id('biometric-settings'))).toBeVisible();
});

/**
 * Tap the sign-out button on the account screen.
 */
When('I tap the "Sign Out" button', async () => {
  await element(by.id('button-sign-out')).tap();
});

/**
 * Assert that the sign-in screen is displayed (e.g. after signing out).
 */
Then('I should see the sign-in screen', async () => {
  await waitForElementVisible('screen-sign-in');
});
