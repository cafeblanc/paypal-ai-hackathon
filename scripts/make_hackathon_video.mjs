import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('=== Building PayPal AI Commerce Hackathon Demo Video ===');

const FONT_ENG = 'C\\:/Windows/Fonts/arial.ttf';
const workDir = process.cwd();
const tempDir = path.join(workDir, 'temp_video_build');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

function makeTextFile(name, text) {
  const filePath = path.join(tempDir, `${name}.txt`);
  fs.writeFileSync(filePath, text, 'utf8');
  return filePath.replace(/\\/g, '/').replace(/:/g, '\\:');
}

function runFFmpeg(cmd, desc) {
  console.log(`[FFmpeg] ${desc}...`);
  execSync(`ffmpeg -y ${cmd}`, { stdio: 'inherit' });
}

// 1. Scene 1: Intro Title Card (5 seconds)
const t1_badge = makeTextFile('t1_badge', 'PayPal AI Commerce Hackathon 2026 Submission');
const t1_title = makeTextFile('t1_title', 'PayPal AI Live Commerce');
const t1_sub = makeTextFile('t1_sub', 'Real-Time Agentic Live Streaming Commerce Platform');
const t1_feat = makeTextFile('t1_feat', 'Official PayPal Checkout  *  Multilingual AI Agent  *  Multi-Device Sync');
const t1_url = makeTextFile('t1_url', 'Live Demo: https://vmall.cafeblanc.kr  |  GitHub: cafeblanc/paypal-ai-hackathon');

const introOut = path.join(tempDir, '01_intro.mp4');
runFFmpeg(`-f lavfi -i color=c=0x090d16:s=1920x1080:d=5 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "drawtext=fontfile='${FONT_ENG}':textfile='${t1_badge}':fontsize=32:fontcolor=0xf59e0b:x=(w-text_w)/2:y=240,drawtext=fontfile='${FONT_ENG}':textfile='${t1_title}':fontsize=68:fontcolor=white:x=(w-text_w)/2:y=340,drawtext=fontfile='${FONT_ENG}':textfile='${t1_sub}':fontsize=36:fontcolor=0x38bdf8:x=(w-text_w)/2:y=470,drawtext=fontfile='${FONT_ENG}':textfile='${t1_feat}':fontsize=28:fontcolor=0x94a3b8:x=(w-text_w)/2:y=580,drawtext=fontfile='${FONT_ENG}':textfile='${t1_url}':fontsize=30:fontcolor=0x10b981:x=(w-text_w)/2:y=760" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -t 5 "${introOut}"`, '1/6 Generating Intro Scene');

// 2. Scene 2: Live Stream Sync - Gapyeong Grape Juice (28s)
const t2_top1 = makeTextFile('t2_top1', '* LIVE');
const t2_top2 = makeTextFile('t2_top2', '2 Viewers');
const t2_top3 = makeTextFile('t2_top3', '|  Open Festival Live Stream');
const t2_top4 = makeTextFile('t2_top4', 'PayPal AI Live Commerce');
const t2_bot1 = makeTextFile('t2_bot1', 'Featured Product: Gapyeong Eco-friendly Grape Juice (100% Pure Squeezed)');
const t2_bot2 = makeTextFile('t2_bot2', 'Price: $25.00 USD  |  Stock: 998 pcs  |  PayPal Sandbox Gateway Ready');

const grapeIn = path.join(workDir, 'public/demo_video/gapyeong-grape.mp4');
const grapeOut = path.join(tempDir, '02_grape_stream.mp4');
runFFmpeg(`-i "${grapeIn}" -vf "scale=1280:720,pad=1920:1080:320:180:color=0x090d16,drawbox=x=316:y=176:w=1288:h=728:color=0x334155:t=4,drawbox=x=0:y=0:w=1920:h=120:color=0x020617:t=fill,drawtext=fontfile='${FONT_ENG}':textfile='${t2_top1}':fontsize=32:fontcolor=0xef4444:x=80:y=45,drawtext=fontfile='${FONT_ENG}':textfile='${t2_top2}':fontsize=30:fontcolor=white:x=200:y=46,drawtext=fontfile='${FONT_ENG}':textfile='${t2_top3}':fontsize=30:fontcolor=0x94a3b8:x=370:y=46,drawtext=fontfile='${FONT_ENG}':textfile='${t2_top4}':fontsize=32:fontcolor=0x38bdf8:x=1440:y=45,drawbox=x=0:y=960:w=1920:h=120:color=0x020617:t=fill,drawtext=fontfile='${FONT_ENG}':textfile='${t2_bot1}':fontsize=28:fontcolor=white:x=80:y=985,drawtext=fontfile='${FONT_ENG}':textfile='${t2_bot2}':fontsize=26:fontcolor=0xf59e0b:x=80:y=1025" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -ar 44100 -ac 2 -t 28 "${grapeOut}"`, '2/6 Generating Live Stream Scene 1 (Grape Juice $25.00)');

// 3. Scene 3: PayPal 1-Click Checkout & Instant Capture (15 seconds)
const t3_head = makeTextFile('t3_head', 'FEATURE HIGHLIGHT: 1-Click PayPal Sandbox Checkout');
const t3_p1 = makeTextFile('t3_p1', '* Secure PayPal Gateway ($25.00 USD)');
const t3_p2 = makeTextFile('t3_p2', '* Accurate Currency Parsing: Exact $25.00 USD passed to PayPal Orders API');
const t3_p3 = makeTextFile('t3_p3', '* Automated Shipping Localization: United States (US), 350 5th Avenue, NY');
const t3_p4 = makeTextFile('t3_p4', '* Official PayPal SDK Smart Buttons + 1-Click Instant Fallback Checkout');
const t3_p5 = makeTextFile('t3_p5', '* Order Status: Completed (Sandbox) - Instant Stock Deduction (999 -> 998)');
const t3_p6 = makeTextFile('t3_p6', '* Tracking Number Generated: US-784219 (Live Notification Delivered)');
const t3_cap = makeTextFile('t3_cap', 'PayPal Order Captured: PAYID-791823401 | Amount: $25.00 USD | Status: APPROVED');

const checkoutOut = path.join(tempDir, '03_checkout_feature.mp4');
runFFmpeg(`-f lavfi -i color=c=0x090d16:s=1920x1080:d=15 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "drawbox=x=160:y=120:w=1600:h=840:color=0x0f172a:t=fill,drawbox=x=160:y=120:w=1600:h=840:color=0x1e293b:t=3,drawtext=fontfile='${FONT_ENG}':textfile='${t3_head}':fontsize=34:fontcolor=0xf59e0b:x=220:y=170,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p1}':fontsize=42:fontcolor=white:x=220:y=260,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p2}':fontsize=28:fontcolor=0x38bdf8:x=260:y=350,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p3}':fontsize=28:fontcolor=0x94a3b8:x=260:y=420,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p4}':fontsize=28:fontcolor=0x94a3b8:x=260:y=490,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p5}':fontsize=28:fontcolor=0x10b981:x=260:y=560,drawtext=fontfile='${FONT_ENG}':textfile='${t3_p6}':fontsize=28:fontcolor=0x10b981:x=260:y=630,drawbox=x=260:y=720:w=1400:h=120:color=0x020617:t=fill,drawbox=x=260:y=720:w=1400:h=120:color=0x3b82f6:t=2,drawtext=fontfile='${FONT_ENG}':textfile='${t3_cap}':fontsize=26:fontcolor=0x60a5fa:x=300:y=765" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -t 15 "${checkoutOut}"`, '3/6 Generating PayPal Checkout Scene');

// 4. Scene 4: Dynamic Live Product Switching - Munhori Knitting (21s)
const t4_top1 = makeTextFile('t4_top1', '* LIVE');
const t4_top2 = makeTextFile('t4_top2', '2 Viewers');
const t4_top3 = makeTextFile('t4_top3', '|  Dynamic Product & Video Switching');
const t4_top4 = makeTextFile('t4_top4', 'PayPal AI Live Commerce');
const t4_bot1 = makeTextFile('t4_bot1', 'Switched Product: Munhori Artisanal Knitting Studio Kit');
const t4_bot2 = makeTextFile('t4_bot2', 'Price: $74.00 USD  |  Handmade Artisanal Crafts  |  Instant Video Hot-Swap');

const knittingIn = path.join(workDir, 'public/demo_video/munhori-knitting.mp4');
const knittingOut = path.join(tempDir, '04_knitting_stream.mp4');
runFFmpeg(`-i "${knittingIn}" -vf "scale=1280:720,pad=1920:1080:320:180:color=0x090d16,drawbox=x=316:y=176:w=1288:h=728:color=0x334155:t=4,drawbox=x=0:y=0:w=1920:h=120:color=0x020617:t=fill,drawtext=fontfile='${FONT_ENG}':textfile='${t4_top1}':fontsize=32:fontcolor=0xef4444:x=80:y=45,drawtext=fontfile='${FONT_ENG}':textfile='${t4_top2}':fontsize=30:fontcolor=white:x=200:y=46,drawtext=fontfile='${FONT_ENG}':textfile='${t4_top3}':fontsize=30:fontcolor=0x94a3b8:x=370:y=46,drawtext=fontfile='${FONT_ENG}':textfile='${t4_top4}':fontsize=32:fontcolor=0x38bdf8:x=1440:y=45,drawbox=x=0:y=960:w=1920:h=120:color=0x020617:t=fill,drawtext=fontfile='${FONT_ENG}':textfile='${t4_bot1}':fontsize=28:fontcolor=white:x=80:y=985,drawtext=fontfile='${FONT_ENG}':textfile='${t4_bot2}':fontsize=26:fontcolor=0xf59e0b:x=80:y=1025" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -ar 44100 -ac 2 -t 21 "${knittingOut}"`, '4/6 Generating Scene 4 (Dynamic Product Switch $74.00)');

// 5. Scene 5: Multilingual AI Agent & Admin Security (15 seconds)
const t5_head = makeTextFile('t5_head', 'AGENTIC COMMERCE & MANAGEMENT SUITE');
const t5_p1 = makeTextFile('t5_p1', '* Multilingual AI Copilot (EN / KO / JA / ZH / ES / FR)');
const t5_p2 = makeTextFile('t5_p2', '* Real-time Customer Support & Context-Aware Product Recommendations');
const t5_p3 = makeTextFile('t5_p3', '* Multi-Device Real-Time Live Presence Count (/api/viewers Vercel Serverless)');
const t5_p4 = makeTextFile('t5_p4', '* Secured Admin Authentication backed by Vercel ADMIN_PASSWD env');
const t5_p5 = makeTextFile('t5_p5', '* Live Stream Video Hot-Swap & Real-Time Product Replacement Engine');
const t5_p6 = makeTextFile('t5_p6', '* Real-Time Sales Dashboard & Live Inventory Tracking');
const t5_tech = makeTextFile('t5_tech', 'Architecture: Vite React + TailwindCSS + Vercel Serverless + PayPal SDK');

const aiAdminOut = path.join(tempDir, '05_ai_admin.mp4');
runFFmpeg(`-f lavfi -i color=c=0x090d16:s=1920x1080:d=15 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "drawbox=x=160:y=120:w=1600:h=840:color=0x0f172a:t=fill,drawbox=x=160:y=120:w=1600:h=840:color=0x1e293b:t=3,drawtext=fontfile='${FONT_ENG}':textfile='${t5_head}':fontsize=34:fontcolor=0x38bdf8:x=220:y=170,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p1}':fontsize=38:fontcolor=white:x=220:y=260,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p2}':fontsize=28:fontcolor=0x94a3b8:x=260:y=340,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p3}':fontsize=28:fontcolor=0x94a3b8:x=260:y=410,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p4}':fontsize=28:fontcolor=0xf59e0b:x=260:y=480,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p5}':fontsize=28:fontcolor=0x94a3b8:x=260:y=550,drawtext=fontfile='${FONT_ENG}':textfile='${t5_p6}':fontsize=28:fontcolor=0x10b981:x=260:y=620,drawbox=x=260:y=710:w=1400:h=130:color=0x020617:t=fill,drawbox=x=260:y=710:w=1400:h=130:color=0x10b981:t=2,drawtext=fontfile='${FONT_ENG}':textfile='${t5_tech}':fontsize=28:fontcolor=0x34d399:x=300:y=760" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -t 15 "${aiAdminOut}"`, '5/6 Generating AI Agent & Admin Highlight Scene');

// 6. Scene 6: Outro (6 seconds)
const t6_title = makeTextFile('t6_title', 'PayPal AI Live Commerce');
const t6_sub = makeTextFile('t6_sub', 'Built for PayPal AI Commerce Hackathon 2026');
const t6_lbl = makeTextFile('t6_lbl', 'Live Production Web App:');
const t6_url = makeTextFile('t6_url', 'https://vmall.cafeblanc.kr');
const t6_git = makeTextFile('t6_git', 'GitHub Repository: https://github.com/cafeblanc/paypal-ai-hackathon');
const t6_thx = makeTextFile('t6_thx', 'Thank You for Watching!');

const outroOut = path.join(tempDir, '06_outro.mp4');
runFFmpeg(`-f lavfi -i color=c=0x090d16:s=1920x1080:d=6 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "drawtext=fontfile='${FONT_ENG}':textfile='${t6_title}':fontsize=64:fontcolor=0xf59e0b:x=(w-text_w)/2:y=240,drawtext=fontfile='${FONT_ENG}':textfile='${t6_sub}':fontsize=36:fontcolor=white:x=(w-text_w)/2:y=350,drawtext=fontfile='${FONT_ENG}':textfile='${t6_lbl}':fontsize=28:fontcolor=0x94a3b8:x=(w-text_w)/2:y=460,drawtext=fontfile='${FONT_ENG}':textfile='${t6_url}':fontsize=42:fontcolor=0x38bdf8:x=(w-text_w)/2:y=520,drawtext=fontfile='${FONT_ENG}':textfile='${t6_git}':fontsize=28:fontcolor=0x94a3b8:x=(w-text_w)/2:y=620,drawtext=fontfile='${FONT_ENG}':textfile='${t6_thx}':fontsize=44:fontcolor=0x10b981:x=(w-text_w)/2:y=740" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac -t 6 "${outroOut}"`, '6/6 Generating Outro Scene');

// 7. Concatenate all 6 scenes into final video
const concatListFile = path.join(tempDir, 'concat_list.txt');
const scenes = [introOut, grapeOut, checkoutOut, knittingOut, aiAdminOut, outroOut];
fs.writeFileSync(concatListFile, scenes.map(s => `file '${s.replace(/\\/g, '/')}'`).join('\n'));

const finalOut = path.join(workDir, 'paypal_ai_hackathon_demo.mp4');
runFFmpeg(`-f concat -safe 0 -i "${concatListFile}" -c copy "${finalOut}"`, 'Finalizing Video Concatenation');

const stat = fs.statSync(finalOut);
console.log('\n========================================');
console.log('🎉 SUCCESS! Final Hackathon Video Created:');
console.log('Path:', finalOut);
console.log('Size:', (stat.size / (1024 * 1024)).toFixed(2), 'MB');
console.log('Duration: 89 seconds (1080p Full HD, 30fps)');
console.log('========================================\n');
