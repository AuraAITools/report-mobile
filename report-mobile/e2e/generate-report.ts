import * as report from 'multiple-cucumber-html-reporter';
import * as path from 'path';

const jsonDir = path.join(__dirname, 'reports', 'json');
const reportPath = path.join(__dirname, 'reports', 'html');

report.generate({
  jsonDir,
  reportPath,
  reportName: 'Aura Report Mobile — E2E BDD Test Results',
  pageTitle: 'Aura Report E2E Tests',
  displayDuration: true,
  displayReportTime: true,
  durationInMS: true,
  metadata: {
    device: process.env.DETOX_DEVICE || 'iPhone 15 Simulator',
    platform: {
      name: process.env.DETOX_PLATFORM || 'iOS',
      version: process.env.DETOX_PLATFORM_VERSION || '17',
    },
    app: {
      name: 'Aura Report',
      version: '1.0.0',
    },
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'Aura Report Mobile' },
      { label: 'Execution Date', value: new Date().toISOString() },
      { label: 'Branch', value: process.env.GITHUB_REF || 'local' },
      { label: 'Commit', value: process.env.GITHUB_SHA?.substring(0, 7) || 'local' },
    ],
  },
});

console.log(`Report generated at ${reportPath}/index.html`);
