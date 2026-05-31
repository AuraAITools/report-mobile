module.exports = {
  default: {
    require: [
      'e2e/support/**/*.ts',
      'e2e/step-definitions/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:e2e/reports/json/results.json',
      'html:e2e/reports/cucumber-report.html',
    ],
    paths: ['e2e/features/**/*.feature'],
    publishQuiet: true,
  },
};
