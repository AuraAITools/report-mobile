import { Given, When, Then } from '@cucumber/cucumber';
import { device, element, by, expect, waitFor } from 'detox';
import {
  loginAsParent,
  toTestID,
  toTabTestID,
  waitForElementVisible,
} from '../support/helpers';

/**
 * Launch the app as a fresh install (clear storage).
 */
Given('the app is launched fresh', async () => {
  await device.launchApp({ newInstance: true, delete: true });
});

/**
 * Perform a full login flow and wait for the home screen.
 */
Given('I am logged in as a parent', async () => {
  await device.launchApp({ newInstance: true });
  await loginAsParent();
  await waitForElementVisible('screen-home');
});

/**
 * Navigate to a specific screen by tapping the matching tab.
 * Accepted screen names: lessons, progress, account.
 * "home" is skipped because it is the default landing screen.
 */
Given('I am on the {word} screen', async (screen: string) => {
  const screenName = screen.toLowerCase();
  if (screenName === 'sign-in') {
    await waitForElementVisible('screen-sign-in');
    return;
  }
  // For authenticated screens, tap the corresponding tab
  const tabMap: Record<string, string> = {
    lessons: 'Lessons',
    progress: 'Progress',
    account: 'Account',
    home: 'Home',
  };
  const tabName = tabMap[screenName];
  if (tabName) {
    await element(by.id(toTabTestID(tabName))).tap();
    await waitForElementVisible(`screen-${screenName}`);
  }
});

/**
 * Tap a button identified by its testID (derived from the display text).
 */
When('I tap the {string} button', async (buttonText: string) => {
  const testID = toTestID(`button-${buttonText}`);
  await element(by.id(testID)).tap();
});

/**
 * Tap a link identified by its visible text.
 */
When('I tap the {string} link', async (linkText: string) => {
  await element(by.text(linkText)).tap();
});

/**
 * Tap a bottom tab by its testID.
 */
When('I tap the {string} tab', async (tabName: string) => {
  await element(by.id(toTabTestID(tabName))).tap();
});

/**
 * Assert that a screen is visible by its testID.
 */
Then('I should see the {word} screen', async (screen: string) => {
  const screenName = screen.toLowerCase();
  await waitForElementVisible(`screen-${screenName}`);
});

/**
 * Assert that a button is visible.
 */
Then('I should see the {string} button', async (buttonText: string) => {
  const testID = toTestID(`button-${buttonText}`);
  await expect(element(by.id(testID))).toBeVisible();
});

/**
 * Assert that an input field is visible.
 */
Then('I should see the {string} input field', async (fieldLabel: string) => {
  const testID = toTestID(`input-${fieldLabel}`);
  await expect(element(by.id(testID))).toBeVisible();
});

/**
 * Assert that a tab is in the active/selected state.
 */
Then('the {string} tab should be active', async (tabName: string) => {
  const testID = toTabTestID(tabName);
  await expect(element(by.id(`${testID}-active`))).toBeVisible();
});

/**
 * Assert that the bottom navigation tab bar is visible.
 */
Then('I should see the bottom navigation tabs', async () => {
  await expect(element(by.id('bottom-tab-bar'))).toBeVisible();
});
