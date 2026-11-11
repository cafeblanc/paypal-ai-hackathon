import { createServer } from 'vite';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

const PLAYWRIGHT_PATH = 'file:///C:/Users/mrwel/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const workDir = process.cwd();
const tempDir = path.join(workDir, 'temp_video_build');
const rawRecordDir = path.join(tempDir, 'raw_pw_video');

if (!fs.existsSync(rawRecordDir)) {
  fs.mkdirSync(rawRecordDir, { recursive: true });
}

// Clear old webm files in rawRecordDir
for (const f of fs.readdirSync(rawRecordDir)) {
  try { fs.unlinkSync(path.join(rawRecordDir, f)); } catch {}
}

async function runFullRecording() {
  console.log('1. Starting local Vite server for recording...');
  const server = await createServer({
    root: workDir,
    server: { port: 5188, strictPort: false }
  });
  await server.listen();
  const address = server.httpServer.address();
  const port = typeof address === 'object' && address ? address.port : 5188;
  const appUrl = `http://localhost:${port}`;
  console.log(`   Vite server listening at ${appUrl}`);

  const { chromium } = await import(PLAYWRIGHT_PATH);

  console.log('2. Launching Google Chrome via Playwright...');
  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    headless: true,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security',
      '--allow-file-access-from-files'
    ]
  });

  // Use 1280x720 viewport with 1.5x deviceScaleFactor -> renders crisp 1920x1080 Full HD where UI buttons & text are large and readable
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1.5,
    recordVideo: {
      dir: rawRecordDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  const timeline = {
    startMs: Date.now(),
    events: []
  };

  const markEvent = (name) => {
    const elapsed = Date.now() - timeline.startMs;
    timeline.events.push({ name, elapsedMs: elapsed, elapsedSec: Number((elapsed / 1000).toFixed(2)) });
    console.log(`   [Timeline ${ (elapsed / 1000).toFixed(1) }s] ${name}`);
  };

  console.log('3. Navigating to Live Commerce App...');
  await page.goto(appUrl, { waitUntil: 'networkidle' });
  timeline.startMs = Date.now();
  markEvent('app_loaded');

  // Inject visual cursor, click ripple, step HUD banner, and PayPal Sandbox Checkout Popup Window helper
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      #demo-cursor {
        position: fixed;
        top: 360px;
        left: 640px;
        width: 30px;
        height: 30px;
        z-index: 2147483647;
        pointer-events: none;
        transition: top 0.42s cubic-bezier(0.22, 1, 0.36, 1), left 0.42s cubic-bezier(0.22, 1, 0.36, 1), transform 0.15s ease;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.65));
      }
      #demo-cursor.clicking {
        transform: scale(0.82);
      }
      .demo-ripple {
        position: fixed;
        width: 44px;
        height: 44px;
        margin-left: -22px;
        margin-top: -22px;
        border-radius: 50%;
        border: 3px solid #f59e0b;
        background: rgba(245, 158, 11, 0.28);
        z-index: 2147483646;
        pointer-events: none;
        animation: demoRippleAnim 0.55s ease-out forwards;
      }
      @keyframes demoRippleAnim {
        0% { transform: scale(0.3); opacity: 1; }
        100% { transform: scale(1.9); opacity: 0; }
      }
      #demo-hud {
        position: fixed;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483640;
        background: rgba(2, 6, 23, 0.92);
        border: 1.5px solid rgba(56, 189, 248, 0.65);
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        color: #f8fafc;
        padding: 5px 16px;
        border-radius: 999px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: none;
        white-space: nowrap;
        transition: opacity 0.25s ease;
      }
      #demo-hud .hud-badge {
        background: #f59e0b;
        color: #020617;
        font-size: 10px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 999px;
      }
      #demo-paypal-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(2, 6, 23, 0.72);
        backdrop-filter: blur(4px);
        z-index: 2147483600;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
      }
      #demo-paypal-window {
        width: 480px;
        background: #ffffff;
        color: #0f172a;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 25px 60px rgba(0,0,0,0.75), 0 0 0 2px #0070ba;
        animation: ppPopIn 0.22s ease-out;
      }
      @keyframes ppPopIn {
        0% { transform: scale(0.92) translateY(12px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = `
      <svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5.5" fill="rgba(245, 158, 11, 0.35)" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M5 4L13 24L16.5 16.5L24 13L5 4Z" fill="#ffffff" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(cursor);

    const hud = document.createElement('div');
    hud.id = 'demo-hud';
    hud.innerHTML = `<span class="hud-badge">LIVE DEMO</span><span id="demo-hud-text">PayPal AI Live Commerce — Full Interactive Walkthrough</span>`;
    document.body.appendChild(hud);

    // Create PayPal Sandbox Checkout Popup Window container
    const ppBackdrop = document.createElement('div');
    ppBackdrop.id = 'demo-paypal-modal-backdrop';
    ppBackdrop.innerHTML = `
      <div id="demo-paypal-window">
        <!-- Browser popup URL bar -->
        <div style="background:#1e293b;color:#cbd5e1;padding:7px 12px;font-size:11px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
          <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
            <span style="color:#10b981;">🔒</span>
            <span style="font-family:monospace;font-size:10.5px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">https://www.sandbox.paypal.com/checkoutnow?token=EC-89A41029X</span>
          </div>
          <div style="display:flex;gap:5px;">
            <span style="width:9px;height:9px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#10b981;display:inline-block;"></span>
            <span style="width:9px;height:9px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
          </div>
        </div>
        <!-- PayPal Header -->
        <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:21px;font-weight:900;font-style:italic;letter-spacing:-0.5px;color:#003087;">Pay<span style="color:#0079C1;">Pal</span></span>
            <span style="background:#fef3c7;color:#b45309;border:1px solid #f59e0b;font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:4px;">SANDBOX VIRTUAL INPUT</span>
          </div>
          <div style="text-align:right;">
            <div id="pp-modal-amount" style="font-size:15px;font-weight:800;color:#0f172a;">$25.00 USD</div>
            <div id="pp-modal-item" style="font-size:10px;color:#64748b;max-width:210px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Gapyeong Eco-friendly Grape Juice</div>
          </div>
        </div>
        <!-- PayPal Virtual Input Body -->
        <div style="padding:14px 18px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;padding:7px 10px;border-radius:8px;font-size:10.5px;font-weight:600;display:flex;align-items:center;gap:6px;">
            <span>💳</span>
            <span>Enter Sandbox virtual account & test card details below (No real charge)</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">PayPal Sandbox Email</label>
              <input id="pp-input-email" type="text" placeholder="sb-buyer@personal.example.com" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">Sandbox Password</label>
              <input id="pp-input-pass" type="password" placeholder="••••••••••••" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">Virtual Test Card Number</label>
              <input id="pp-input-card" type="text" placeholder="4032 •••• •••• ••••" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;font-family:monospace;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">Expiry</label>
              <input id="pp-input-exp" type="text" placeholder="MM/YY" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;font-family:monospace;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">CSC (CVV)</label>
              <input id="pp-input-cvv" type="text" placeholder="3 digits" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;font-family:monospace;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">Recipient Name (Virtual)</label>
              <input id="pp-input-name" type="text" placeholder="Full Name" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
            <div>
              <label style="display:block;font-size:10px;font-weight:700;color:#475569;margin-bottom:3px;">Shipping Address (US)</label>
              <input id="pp-input-addr" type="text" placeholder="Street, City, State, ZIP" style="width:100%;padding:6px 8px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:11px;color:#0f172a;box-sizing:border-box;outline:none;" />
            </div>
          </div>

          <!-- Actions -->
          <div style="margin-top:4px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <span style="font-size:10px;color:#64748b;">🔒 256-bit SSL · Sandbox Test Only</span>
            <button id="pp-return-btn" type="button" style="background:#0070ba;color:#ffffff;border:none;border-radius:8px;padding:8px 16px;font-size:11.5px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,112,186,0.35);">
              ← Return to Live Stream (가상 입력 확인 후 돌아가기)
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(ppBackdrop);

    document.getElementById('pp-return-btn')?.addEventListener('click', () => {
      ppBackdrop.style.display = 'none';
    });

    window.__setHud = (badge, text) => {
      const b = document.querySelector('#demo-hud .hud-badge');
      const t = document.getElementById('demo-hud-text');
      if (b) b.textContent = badge;
      if (t) t.textContent = text;
    };

    window.__moveCursor = (x, y, click = false) => {
      const c = document.getElementById('demo-cursor');
      if (c) {
        c.style.left = `${x}px`;
        c.style.top = `${y}px`;
      }
      if (click) {
        setTimeout(() => {
          if (c) c.classList.add('clicking');
          const r = document.createElement('div');
          r.className = 'demo-ripple';
          r.style.left = `${x}px`;
          r.style.top = `${y}px`;
          document.body.appendChild(r);
          setTimeout(() => {
            if (c) c.classList.remove('clicking');
          }, 180);
          setTimeout(() => r.remove(), 600);
        }, 420);
      }
    };

    window.__openPayPalVirtualModal = (amountStr, itemStr) => {
      const amtEl = document.getElementById('pp-modal-amount');
      const itemEl = document.getElementById('pp-modal-item');
      if (amtEl) amtEl.textContent = amountStr;
      if (itemEl) itemEl.textContent = itemStr;
      ['pp-input-email', 'pp-input-pass', 'pp-input-card', 'pp-input-exp', 'pp-input-cvv', 'pp-input-name', 'pp-input-addr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = '';
          el.style.borderColor = '#cbd5e1';
          el.style.backgroundColor = '#ffffff';
        }
      });
      ppBackdrop.style.display = 'flex';
    };
  });

  const setHud = async (badge, text) => {
    await page.evaluate(({ b, t }) => window.__setHud && window.__setHud(b, t), { b: badge, t: text });
  };

  // Helper to smoothly move cursor to a visible locator, highlight it, and click
  const moveAndClick = async (selector, waitAfterMs = 1200) => {
    const loc = page.locator(selector).first();
    await loc.waitFor({ state: 'visible', timeout: 6000 });
    const box = await loc.boundingBox();
    if (box) {
      const cx = Math.round(box.x + box.width / 2);
      const cy = Math.round(box.y + box.height / 2);
      await page.evaluate(({ x, y }) => window.__moveCursor && window.__moveCursor(x, y, true), { x: cx, y: cy });
      await page.waitForTimeout(480);
    }
    await loc.click({ force: true });
    await page.waitForTimeout(waitAfterMs);
  };

  // Helper to move cursor to an input, click, and type text character-by-character
  const moveAndType = async (selector, text, delayMs = 38, waitAfterMs = 600) => {
    const loc = page.locator(selector).first();
    await loc.waitFor({ state: 'visible', timeout: 6000 });
    const box = await loc.boundingBox();
    if (box) {
      const cx = Math.round(box.x + Math.min(box.width / 2, 80));
      const cy = Math.round(box.y + box.height / 2);
      await page.evaluate(({ x, y }) => window.__moveCursor && window.__moveCursor(x, y, true), { x: cx, y: cy });
      await page.waitForTimeout(460);
    }
    await loc.click({ force: true });
    await loc.fill('');
    await loc.type(text, { delay: delayMs });
    await page.waitForTimeout(waitAfterMs);
  };

  // =========================================================================
  // PART 1: PRODUCT 1 (Gapyeong Eco-friendly Grape Juice - $25.00)
  // =========================================================================
  await setHud('PRODUCT 1 / 2', '🍇 Gapyeong Eco-friendly Grape Juice ($25.00) — Live Stream & Audio On');
  await page.waitForTimeout(1800);

  // 1-1. Click "🔊 Sound On" button on top-right of video player
  markEvent('prod1_unmute_click');
  await moveAndClick('button:has-text("Sound On"):visible', 2500);

  // 1-2. Ask AI Shopping Agent in Live Chat about Product 1
  await setHud('PRODUCT 1 · AI CHAT', '💬 Asking AI Shopping Agent about Organic Grape Juice');
  markEvent('prod1_chat_ask');
  await moveAndType('input[placeholder="Type a message..."]:visible', 'Is this grape juice 100% organic?', 35, 500);
  await moveAndClick('button:has-text("Send"):visible', 2200);

  // 1-3. Click "💳 Pay with PayPal" button on bottom product bar
  await setHud('PRODUCT 1 · PAYPAL', '💳 Clicking "Pay with PayPal" to Open In-Stream Checkout ($25.00 USD)');
  markEvent('prod1_open_paypal_overlay');
  await moveAndClick('button:has-text("Pay with PayPal"):visible', 1800);

  // 1-4. Click the Gold PayPal button area to open the PayPal Sandbox Virtual Input Window
  await setHud('PAYPAL CHECKOUT (PROD 1)', '📝 Entering Virtual Sandbox Values in PayPal Checkout ($25.00 USD)');
  markEvent('prod1_open_paypal_window');
  // Move cursor to the gold PayPal button inside the checkout overlay
  const goldBtnLoc = page.locator('.bg-\\[\\#ffc439\\]:visible, [ref="paypalContainerRef"]:visible').first();
  if (await goldBtnLoc.count() > 0) {
    const box = await goldBtnLoc.boundingBox();
    if (box) {
      await page.evaluate(({ x, y }) => window.__moveCursor && window.__moveCursor(x, y, true), {
        x: Math.round(box.x + box.width / 2),
        y: Math.round(box.y + box.height / 2)
      });
      await page.waitForTimeout(550);
    }
  }
  await page.evaluate(() => {
    window.__openPayPalVirtualModal('$25.00 USD', '🍇 Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)');
  });
  await page.waitForTimeout(800);

  // Fill virtual values into PayPal Checkout Window for Product 1
  await moveAndType('#pp-input-email', 'sb-buyer2026@personal.example.com', 28, 350);
  await moveAndType('#pp-input-pass', 'paypal-demo-2026', 35, 350);
  await moveAndType('#pp-input-card', '4032 8819 2041 9901', 28, 350);
  await moveAndType('#pp-input-exp', '12/28', 45, 300);
  await moveAndType('#pp-input-cvv', '884', 50, 300);
  await moveAndType('#pp-input-name', 'John Doe', 35, 300);
  await moveAndType('#pp-input-addr', '350 5th Ave, Suite 4100, New York, NY 10001', 24, 1400);

  // Return from PayPal Virtual Input Window without real charge
  await setHud('PAYPAL CHECKOUT (PROD 1)', '↩️ Virtual Input Verified — Returning to Live Broadcast');
  markEvent('prod1_return_from_paypal');
  await moveAndClick('#pp-return-btn', 1000);

  // Close the bottom PayPal overlay by clicking "Back"
  await moveAndClick('button:has-text("Back"):visible', 1800);

  // =========================================================================
  // PART 2: SWITCH VIDEO TO PRODUCT 2 (Munhori River Market Knitting - $32.00)
  // =========================================================================
  await setHud('PRODUCT 2 / 2 · VIDEO SWITCH', '🔄 Clicking Product 2 Chip to Switch Live Video (문호리 뜨개질 공방 전환)');
  markEvent('prod2_switch_video_click');
  await moveAndClick('button:has-text("Munhori"):visible', 3200);

  // 2-1. Ask AI Shopping Agent about shipping in Live Chat
  await setHud('PRODUCT 2 · AI CHAT', '💬 Asking AI Agent about Shipping & Delivery Time');
  markEvent('prod2_chat_ask');
  await moveAndType('input[placeholder="Type a message..."]:visible', 'How long does shipping take?', 35, 500);
  await moveAndClick('button:has-text("Send"):visible', 2200);

  // 2-2. Click "Open PayPal Checkout" button inside the AI Chat Product Card (or bottom Pay with PayPal)
  await setHud('PRODUCT 2 · PAYPAL', '💳 Clicking "Open PayPal Checkout" from AI Chat Product Card ($32.00 USD)');
  markEvent('prod2_open_paypal_overlay');
  const openCheckoutChatBtn = page.locator('button:has-text("Open PayPal Checkout"):visible');
  if (await openCheckoutChatBtn.count() > 0) {
    await moveAndClick('button:has-text("Open PayPal Checkout"):visible', 1800);
  } else {
    await moveAndClick('button:has-text("Pay with PayPal"):visible', 1800);
  }

  // 2-3. Open PayPal Sandbox Virtual Input Window for Product 2 ($32.00 USD)
  await setHud('PAYPAL CHECKOUT (PROD 2)', '📝 Entering Virtual Sandbox Values for Knitting Crafts ($32.00 USD)');
  markEvent('prod2_open_paypal_window');
  if (await goldBtnLoc.count() > 0) {
    const box = await goldBtnLoc.boundingBox();
    if (box) {
      await page.evaluate(({ x, y }) => window.__moveCursor && window.__moveCursor(x, y, true), {
        x: Math.round(box.x + box.width / 2),
        y: Math.round(box.y + box.height / 2)
      });
      await page.waitForTimeout(550);
    }
  }
  await page.evaluate(() => {
    window.__openPayPalVirtualModal('$32.00 USD', '🧶 Munhori River Market Handmade Knitting Studio Crafts');
  });
  await page.waitForTimeout(800);

  // Fill virtual values into PayPal Checkout Window for Product 2
  await moveAndType('#pp-input-email', 'sb-artisan-lover@personal.example.com', 26, 350);
  await moveAndType('#pp-input-pass', 'munhori-craft-2026', 35, 350);
  await moveAndType('#pp-input-card', '5412 7500 8834 1029', 28, 350);
  await moveAndType('#pp-input-exp', '09/29', 45, 300);
  await moveAndType('#pp-input-cvv', '319', 50, 300);
  await moveAndType('#pp-input-name', 'Emily Parker', 35, 300);
  await moveAndType('#pp-input-addr', '742 Evergreen Terrace, Los Angeles, CA 90001', 24, 1400);

  // Return from PayPal Virtual Input Window
  await setHud('PAYPAL CHECKOUT (PROD 2)', '↩️ Virtual Input Verified — Returning to Live Broadcast');
  markEvent('prod2_return_from_paypal');
  await moveAndClick('#pp-return-btn', 1000);

  // Also click "Back" on the Secure Checkout overlay to return cleanly
  await moveAndClick('button:has-text("Back"):visible', 1800);

  // =========================================================================
  // PART 3: ADMIN PORTAL FULL TOUR (관리자 화면 전체 둘러보기)
  // =========================================================================
  await setHud('ADMIN PORTAL TOUR', '🔒 Entering Secure Admin Dashboard (관리자 화면 접속 및 둘러보기)');
  markEvent('admin_open_click');
  await moveAndClick('button:has-text("Admin"):visible', 1500);

  // 3-1. Login to Admin Portal
  await moveAndType('input[type="password"]:visible', process.env.ADMIN_PASSWD || '', 45, 500);
  await moveAndClick('button:has-text("Admin Login"):visible', 2000);
  markEvent('admin_logged_in');

  // 3-2. Tour Top Summary Cards & Step 1 Product Registration Form
  await setHud('ADMIN · STEP 1', '✨ Step 1: Product & Video Registration Form (신규 상품 및 동영상 등록 폼)');
  await moveAndType('input[placeholder*="Organic Raspberries"]:visible', 'Yangpyeong Organic Wild Honey Set', 30, 500);
  await page.waitForTimeout(1200);

  // 3-3. Smooth scroll down to Step 2: Video Studio & AI Voice-Over Dubbing Studio
  await setHud('ADMIN · AI DUBBING STUDIO', '🎙️ Step 2: FFmpeg Video Studio & AI Native Voice-Over Dubbing');
  markEvent('admin_scroll_studio');
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: 'smooth' }));
  await page.waitForTimeout(2400);

  // 3-4. Smooth scroll down to Registered Products & Video/Stock List
  await setHud('ADMIN · INVENTORY & VIDEO MAPPING', '📦 Registered Products, Live Stock & Video Mapping Table');
  markEvent('admin_scroll_inventory');
  await page.evaluate(() => window.scrollTo({ top: 820, behavior: 'smooth' }));
  await page.waitForTimeout(1800);

  // Click "✏️ Edit" on Product 1 to briefly show the Product Editor Modal
  const editBtns = page.locator('button:has-text("Edit"):visible');
  if (await editBtns.count() > 0) {
    await moveAndClick('button:has-text("Edit"):visible', 2000);
    await moveAndClick('button:has-text("Cancel"):visible', 1200);
  }

  // Click "🎬 Replace Video & Dubbing" to briefly show the Video & Dubbing Replace Modal
  const replaceBtns = page.locator('button:has-text("Replace Video & Dubbing"):visible');
  if (await replaceBtns.count() > 0) {
    await moveAndClick('button:has-text("Replace Video & Dubbing"):visible', 2200);
    await moveAndClick('button:has-text("Cancel"):visible', 1200);
  }

  // 3-5. Smooth scroll down to AI Custom Q&A Editor and Shipping & Order History
  await setHud('ADMIN · AI FAQ & SHIPPING', '💬 AI Auto-Reply FAQ Editor & Order Shipping Management');
  markEvent('admin_scroll_faq_shipping');
  await page.evaluate(() => window.scrollTo({ top: 1450, behavior: 'smooth' }));
  await page.waitForTimeout(2800);

  // 3-6. Scroll back to top and return to Live Stream View
  await setHud('RETURN TO LIVE STREAM', '← Returning from Admin Dashboard to Live Broadcast');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
  markEvent('admin_back_to_live');
  await moveAndClick('button:has-text("Back to Live Video"):visible', 2500);

  await setHud('PAYPAL AI LIVE COMMERCE', '🎉 Full Interactive Demo Complete — https://vmall.cafeblanc.kr');
  await page.waitForTimeout(2500);
  markEvent('recording_complete');

  const videoObj = page.video();
  await context.close();
  await browser.close();
  await server.close();

  const recordedVideoPath = await videoObj.path();
  console.log('4. Raw Playwright recording saved to:', recordedVideoPath);

  timeline.recordedVideoPath = recordedVideoPath;
  const timelinePath = path.join(tempDir, 'timeline.json');
  fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), 'utf8');
  console.log('5. Timeline saved to:', timelinePath);
}

runFullRecording().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
