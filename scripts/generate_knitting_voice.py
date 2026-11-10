import asyncio
import os
import subprocess
import edge_tts

# Video duration is 32 seconds.
# We will create 3 balanced segments:
# Segment 1: Welcome to Munhori River Market knitting studio (0s ~ 8s)
# Segment 2: Introducing crochet & knitting crafts, warm eco-friendly yarn (10s ~ 19s)
# Segment 3: Limited handcrafted collection, instant checkout with PayPal (21s ~ 29s)

segments = [
    {
        "text": "Welcome to Munhori River Market craft studio. Every piece is hand-knitted with gentle care using pure, eco-friendly yarn.",
        "file": "seg1.mp3",
        "start": 1.0
    },
    {
        "text": "From delicate crochet details to cozy needle-knitted scarves and pouches, our artisan creations bring natural warmth to your day.",
        "file": "seg2.mp3",
        "start": 11.0
    },
    {
        "text": "This handmade studio collection is available in limited quantities. Tap the one-click PayPal button below to order now.",
        "file": "seg3.mp3",
        "start": 21.5
    }
]

async def generate():
    voice = "en-US-MichelleNeural" # Gentle, mature, warm female tone
    for i, s in enumerate(segments):
        tts = edge_tts.Communicate(s["text"], voice, rate="-6%", pitch="-4Hz")
        await tts.save(s["file"])
        print(f"Generated {s['file']}")

asyncio.run(generate())
