import { Then, When } from '@cucumber/cucumber';
import { element, by, expect, waitFor } from 'detox';
import { waitForElementVisible } from '../support/helpers';

/**
 * Assert that the progress overview section is visible.
 */
Then('I should see the progress overview', async () => {
  await waitForElementVisible('progress-overview');
});

/**
 * Assert that the progress chart component is visible.
 */
Then('I should see a progress chart', async () => {
  await expect(element(by.id('progress-chart'))).toBeVisible();
});

/**
 * Scroll down to reveal the subject-level progress section.
 */
When('I scroll down to the subject progress section', async () => {
  await element(by.id('progress-scroll-view')).scroll(500, 'down');
});

/**
 * Assert that individual subject progress cards are visible.
 */
Then('I should see progress for each subject', async () => {
  await waitForElementVisible('subject-progress-0');
  await expect(element(by.id('subject-progress-0'))).toBeVisible();
});
