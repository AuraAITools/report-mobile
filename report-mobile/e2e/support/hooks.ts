import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  AfterStep,
  Status,
  ITestStepHookParameter,
} from '@cucumber/cucumber';
import { device } from 'detox';
import detox from 'detox/internals';
import { ChildProcess, spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { DetoxWorld } from './world';

const KEYCLOAK_URL = process.env.E2E_KEYCLOAK_URL ?? 'http://localhost:8180';
const VIDEOS_DIR = path.join(__dirname, '..', 'artifacts', 'videos');

async function waitForKeycloak(maxWaitMs = 60_000): Promise<void> {
  const realmUrl = `${KEYCLOAK_URL}/realms/aura`;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(realmUrl);
      if (res.ok) {
        console.log(`Keycloak is ready at ${KEYCLOAK_URL}`);
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(
    `Keycloak at ${KEYCLOAK_URL} did not become ready within ${maxWaitMs / 1000}s. ` +
    `Run "npm run e2e:keycloak:start" first.`
  );
}

BeforeAll({ timeout: 120_000 }, async function () {
  await waitForKeycloak();
  await detox.init();
  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
});

AfterAll({ timeout: 30_000 }, async function () {
  await detox.cleanup();
});

let recordProcess: ChildProcess | null = null;
let videoPath: string = '';

Before(async function (this: DetoxWorld) {
  await device.launchApp({ newInstance: true });

  // Start screen recording for this scenario
  const safeName = `scenario_${Date.now()}`;
  videoPath = path.join(VIDEOS_DIR, `${safeName}.mp4`);

  try {
    const platform = device.getPlatform();
    if (platform === 'ios') {
      recordProcess = spawn('xcrun', [
        'simctl', 'io', 'booted', 'recordVideo', '--codec=h264', videoPath,
      ], { stdio: 'ignore' });
    } else {
      // Android: record on device, pull in After hook
      spawn('adb', ['shell', 'screenrecord', '--bit-rate', '4000000', '/sdcard/e2e_recording.mp4'], {
        stdio: 'ignore',
      });
    }
  } catch (err) {
    console.warn('Failed to start screen recording:', err);
    recordProcess = null;
  }
});

After(async function (this: DetoxWorld, scenario) {
  // Stop screen recording
  const platform = device.getPlatform();
  try {
    if (platform === 'ios' && recordProcess) {
      recordProcess.kill('SIGINT');
      await new Promise((r) => setTimeout(r, 1500));
      recordProcess = null;
    } else if (platform === 'android') {
      try { execSync('adb shell pkill -INT screenrecord', { stdio: 'ignore' }); } catch { /* may not be running */ }
      await new Promise((r) => setTimeout(r, 1500));
      try { execSync(`adb pull /sdcard/e2e_recording.mp4 "${videoPath}"`, { stdio: 'ignore' }); } catch { /* pull may fail */ }
      try { execSync('adb shell rm /sdcard/e2e_recording.mp4', { stdio: 'ignore' }); } catch { /* cleanup */ }
    }
  } catch (err) {
    console.warn('Failed to stop screen recording:', err);
  }

  // Attach video to Cucumber report if file exists
  if (fs.existsSync(videoPath) && fs.statSync(videoPath).size > 0) {
    const video = fs.readFileSync(videoPath);
    this.attach(video, 'video/mp4');
    console.log(`Screen recording saved: ${videoPath}`);
  }

  // Failure screenshot
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshotPath = await this.takeAndAttachScreenshot(
        `FAILED_${scenario.pickle.name}`
      );
      console.log(`Failure screenshot saved: ${screenshotPath}`);
    } catch (err) {
      console.error('Failed to capture failure screenshot:', err);
    }
  }

  await device.terminateApp();
});

AfterStep(async function (this: DetoxWorld, step: ITestStepHookParameter) {
  try {
    const stepText = step.pickleStep?.text ?? 'step';
    await this.takeAndAttachScreenshot(`step_${stepText}`);
  } catch (err) {
    console.error('Failed to capture step screenshot:', err);
  }
});
