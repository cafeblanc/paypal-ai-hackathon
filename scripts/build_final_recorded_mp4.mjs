import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const workDir = process.cwd();
const tempDir = path.join(workDir, 'temp_video_build');
const timelinePath = path.join(tempDir, 'timeline.json');
const timeline = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));

const rawWebm = timeline.recordedVideoPath;
const finalMp4 = path.join(workDir, 'paypal_ai_hackathon_demo.mp4');

// Determine exact offset between rawWebm total duration and timeline recording_complete
const probeOut = execSync(`ffmpeg -i "${rawWebm}" 2>&1 || exit /b 0`, { encoding: 'utf8' });
const durMatch = probeOut.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
let totalWebmSec = 117.68;
if (durMatch) {
  totalWebmSec = Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);
}
const lastEventSec = timeline.events[timeline.events.length - 1].elapsedSec;
const trimStartSec = Math.max(0, Number((totalWebmSec - lastEventSec - 0.5).toFixed(2)));

const getEventSec = (name, fallback) => {
  const ev = timeline.events.find(e => e.name === name);
  return ev ? ev.elapsedSec : fallback;
};

const tUnmute = getEventSec('prod1_unmute_click', 1.83);
const tSwitchProd2 = getEventSec('prod2_switch_video_click', 35.67);
const tAdminOpen = getEventSec('admin_open_click', 68.25);
const tAdminLoggedIn = getEventSec('admin_logged_in', 74.89);
const tBackToLive = getEventSec('admin_back_to_live', 98.01);

// Cut out the Admin password login screen completely (from right after clicking Admin button to right after login completes)
const cutLoginStartRel = Number((tAdminOpen + 0.45).toFixed(2)); // 68.70s (cursor clicks Admin button)
const cutLoginEndRel = Number((tAdminLoggedIn - 1.60).toFixed(2)); // 73.29s (Admin Dashboard is already open)
const skippedDur = Number((cutLoginEndRel - cutLoginStartRel).toFixed(2));

const rawPartAStart = trimStartSec;
const rawPartADur = cutLoginStartRel;
const rawPartBStart = Number((trimStartSec + cutLoginEndRel).toFixed(2));
const rawPartBDur = Number((totalWebmSec - rawPartBStart).toFixed(2));
const finalDurationSec = Number((rawPartADur + rawPartBDur).toFixed(2));

console.log(`Splicing out Admin Password Screen (${skippedDur}s removed) -> Final Duration: ${finalDurationSec}s`);

const grapeMp4 = path.join(workDir, 'public/demo_video/gapyeong-grape.mp4');
const knittingMp4 = path.join(workDir, 'public/demo_video/munhori-knitting.mp4');

// 1. Prepare audio segments matching each phase of the spliced screen
const seg1Audio = path.join(tempDir, 'aud_seg1_grape.m4a');
const seg1Dur = Number((tSwitchProd2 - tUnmute).toFixed(2));
execSync(`ffmpeg -y -stream_loop 1 -i "${grapeMp4}" -vn -af "afade=t=in:st=0:d=0.4,afade=t=out:st=${Math.max(0, seg1Dur - 0.5)}:d=0.5" -t ${seg1Dur} -ar 44100 -ac 2 -c:a aac -b:a 160k "${seg1Audio}"`, { stdio: 'inherit' });

const seg2Audio = path.join(tempDir, 'aud_seg2_knitting.m4a');
const seg2Dur = Number((cutLoginStartRel - tSwitchProd2).toFixed(2));
execSync(`ffmpeg -y -stream_loop 1 -i "${knittingMp4}" -vn -af "afade=t=in:st=0:d=0.4,afade=t=out:st=${Math.max(0, seg2Dur - 0.5)}:d=0.5" -t ${seg2Dur} -ar 44100 -ac 2 -c:a aac -b:a 160k "${seg2Audio}"`, { stdio: 'inherit' });

const adjustedBackToLive = Number((tBackToLive - skippedDur).toFixed(2));
const seg3Audio = path.join(tempDir, 'aud_seg3_return.m4a');
const seg3Dur = Math.max(2, Number((finalDurationSec - adjustedBackToLive).toFixed(2)));
execSync(`ffmpeg -y -i "${knittingMp4}" -vn -af "afade=t=in:st=0:d=0.4,afade=t=out:st=${Math.max(0, seg3Dur - 0.5)}:d=0.5" -t ${seg3Dur} -ar 44100 -ac 2 -c:a aac -b:a 160k "${seg3Audio}"`, { stdio: 'inherit' });

// Combine audio segments with exact millisecond delays on a stereo base track
const delay1Ms = Math.round(tUnmute * 1000);
const delay2Ms = Math.round(tSwitchProd2 * 1000);
const delay3Ms = Math.round(adjustedBackToLive * 1000);

const fullAudioPath = path.join(tempDir, 'full_synced_audio.m4a');
const filterComplex = [
  `[1:a]adelay=${delay1Ms}|${delay1Ms}[a1]`,
  `[2:a]adelay=${delay2Ms}|${delay2Ms}[a2]`,
  `[3:a]adelay=${delay3Ms}|${delay3Ms}[a3]`,
  `[0:a][a1][a2][a3]amix=inputs=4:duration=first:dropout_transition=0,volume=2.2[aout]`
].join(';');

execSync(
  `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo:d=${finalDurationSec} -i "${seg1Audio}" -i "${seg2Audio}" -i "${seg3Audio}" -filter_complex "${filterComplex}" -map "[aout]" -c:a aac -b:a 192k -t ${finalDurationSec} "${fullAudioPath}"`,
  { stdio: 'inherit' }
);

// 2. Encode Part A and Part B video (cropping out Playwright's gray padding -> scaling 1280x720 viewport to 1920x1080)
const partAVid = path.join(tempDir, 'partA_vid.mp4');
const partBVid = path.join(tempDir, 'partB_vid.mp4');
const joinedVid = path.join(tempDir, 'joined_vid.mp4');

console.log('Encoding Part A (Live Stream Products 1 & 2 + PayPal Virtual Inputs)...');
execSync(
  `ffmpeg -y -ss ${rawPartAStart} -t ${rawPartADur} -i "${rawWebm}" -vf "crop=1280:720:0:0,scale=1920:1080:flags=lanczos,fps=30" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -an "${partAVid}"`,
  { stdio: 'inherit' }
);

console.log('Encoding Part B (Direct Admin Dashboard Tour without Login Password Screen + Return to Live)...');
execSync(
  `ffmpeg -y -ss ${rawPartBStart} -t ${rawPartBDur} -i "${rawWebm}" -vf "crop=1280:720:0:0,scale=1920:1080:flags=lanczos,fps=30" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -an "${partBVid}"`,
  { stdio: 'inherit' }
);

const concatTxt = path.join(tempDir, 'vid_parts.txt');
fs.writeFileSync(concatTxt, `file '${partAVid.replace(/\\/g, '/')}'\nfile '${partBVid.replace(/\\/g, '/')}'\n`, 'utf8');
execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" -c copy "${joinedVid}"`, { stdio: 'inherit' });

console.log('Muxing final 1920x1080 Full HD MP4 with synchronized audio...');
execSync(
  `ffmpeg -y -i "${joinedVid}" -i "${fullAudioPath}" -map 0:v:0 -map 1:a:0 -c:v copy -c:a copy -movflags +faststart -t ${finalDurationSec} "${finalMp4}"`,
  { stdio: 'inherit' }
);

const stat = fs.statSync(finalMp4);
console.log('\n======================================================');
console.log('✅ Final Full-Flow Screen-Recorded Video Created!');
console.log('Path:', finalMp4);
console.log('Size:', (stat.size / (1024 * 1024)).toFixed(2), 'MB');
console.log('Duration:', finalDurationSec, 'seconds (1920x1080 Full HD, 30fps)');
console.log('======================================================\n');
