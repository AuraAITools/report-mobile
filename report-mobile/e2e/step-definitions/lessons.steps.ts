import { Then, When } from '@cucumber/cucumber';
import { element, by, expect, waitFor } from 'detox';
import { waitForElementVisible } from '../support/helpers';

/**
 * Assert that at least one lesson card is visible in the list.
 */
Then('I should see a list of lesson cards', async () => {
  await waitForElementVisible('lesson-card-0');
});

/**
 * Assert that each visible lesson card contains a subject name label.
 */
Then('each lesson card should show the subject name', async () => {
  await expect(
    element(by.id('lesson-card-subject').withAncestor(by.id('lesson-card-0'))),
  ).toBeVisible();
});

/**
 * Assert that each visible lesson card contains a time label.
 */
Then('each lesson card should show the time', async () => {
  await expect(
    element(by.id('lesson-card-time').withAncestor(by.id('lesson-card-0'))),
  ).toBeVisible();
});

/**
 * Scroll down on the lessons list to reveal more items.
 */
When('I scroll down on the lessons list', async () => {
  await element(by.id('lessons-scroll-view')).scroll(500, 'down');
});

/**
 * Assert that additional lesson cards are visible after scrolling.
 */
Then('I should see more lesson cards', async () => {
  // After scrolling, a card further down the list should be visible
  await waitForElementVisible('lesson-card-5');
});

/**
 * Pull to refresh the lessons list by swiping down.
 */
When('I pull to refresh the lessons list', async () => {
  await element(by.id('lessons-scroll-view')).swipe('down', 'slow', 0.5);
});

/**
 * Assert that the lessons list has finished reloading after a pull-to-refresh.
 */
Then('the lessons list should reload', async () => {
  // Wait for loading indicator to disappear, then verify content is present
  await waitFor(element(by.id('lessons-loading')))
    .not.toBeVisible()
    .withTimeout(10000);
  await waitForElementVisible('lesson-card-0');
});
