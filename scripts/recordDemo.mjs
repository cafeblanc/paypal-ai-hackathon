import { chromium } from 'playwright';
import * as path from 'path';

async function recordDemo() {
  console.log('Starting Playwright automated browser recording...');
  const outputDir = path.resolve('public/demo_video/raw_record');

  const browser = await chromium.launch({
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required']
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  console.log('Navigating to Live Demo: https://paypal-ai-hackathon.vercel.app');
  await page.goto('https://paypal-ai-hackathon.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. Language switcher to English for Global Judges
  try {
    const langSelect = await page.$('select');
    if (langSelect) {
      await langSelect.selectOption('en');
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('Lang switch handled:', e);
  }

  // 2. Play video / Unmute demonstration
  const videoElem = await page.$('video');
  if (videoElem) {
    await videoElem.click();
    await page.waitForTimeout(3000);
  }

  // 3. User types inquiry into AI Chat
  const chatInput = await page.$('input[type="text"]');
  if (chatInput) {
    await chatInput.fill('Do you have fresh organic acacia honey?');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);

    // 4. Request instant checkout
    await chatInput.fill('I want to checkout with PayPal please!');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);
  }

  // 5. Click the instant PayPal button
  const payBtn = await page.$('button:has-text("PayPal")');
  if (payBtn) {
    await payBtn.click();
    await page.waitForTimeout(5000);
  }

  // 6. Navigate to Admin Portal
  console.log('Navigating to Admin Portal...');
  const adminBtn = await page.$('button:has-text("Admin")');
  if (adminBtn) {
    await adminBtn.click();
    await page.waitForTimeout(2000);

    // Fill Admin password
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await pwdInput.fill(process.env.ADMIN_PASSWD || '');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
    }
  }

  console.log('Recording completed. Closing browser...');
  await context.close();
  await browser.close();
  console.log('Browser closed and video saved to:', outputDir);
}

recordDemo().catch(console.error);
