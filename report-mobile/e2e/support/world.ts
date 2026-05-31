import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { device } from 'detox';
import * as fs from 'fs';
import * as path from 'path';

export class DetoxWorld extends World {
  public screenshotDir: string;

  constructor(options: IWorldOptions) {
    super(options);
    this.screenshotDir = path.join(__dirname, '..', 'artifacts', 'screenshots');
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async takeAndAttachScreenshot(name: string): Promise<string> {
    const safeName = name.replace(/\W+/g, '_').substring(0, 80);
    const screenshotPath = await device.takeScreenshot(safeName);
    const img = fs.readFileSync(screenshotPath);
    this.attach(img, 'image/png');
    return screenshotPath;
  }
}

setWorldConstructor(DetoxWorld);
