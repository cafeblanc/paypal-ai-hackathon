import subprocess

# Combine seg1 (delay 1.0s = 1000ms), seg2 (delay 11.5s = 11500ms), seg3 (delay 21.0s = 21000ms)
# Video file: public/demo_video/munhori-knitting.mp4 (duration 32.0s)

filter_complex = (
    "[0:a]adelay=1000|1000[a1];"
    "[1:a]adelay=11500|11500[a2];"
    "[2:a]adelay=21000|21000[a3];"
    "[a1][a2][a3]amix=inputs=3:duration=longest:dropout_transition=0,volume=1.8[aout]"
)

# Step 1: create 32s full audio track
cmd_audio = [
    "ffmpeg", "-y",
    "-i", "seg1.mp3",
    "-i", "seg2.mp3",
    "-i", "seg3.mp3",
    "-filter_complex", filter_complex,
    "-map", "[aout]",
    "-t", "32",
    "-c:a", "aac",
    "-b:a", "192k",
    "scripts/knitting_full_audio.m4a"
]

print("Mixing audio with duration=longest...")
subprocess.run(cmd_audio, check=True)

# Step 2: merge with original video stream
cmd_merge = [
    "ffmpeg", "-y",
    "-i", "public/demo_video/munhori-knitting.mp4",
    "-i", "scripts/knitting_full_audio.m4a",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-t", "32",
    "public/demo_video/munhori-knitting-new.mp4"
]

print("Merging video and audio...")
subprocess.run(cmd_merge, check=True)
print("Merge complete!")
