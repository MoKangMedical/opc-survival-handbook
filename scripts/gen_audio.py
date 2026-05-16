#!/usr/bin/env python3
"""OPC 手册音频生成 —— 康波研究院同款四层流水线"""
import asyncio, subprocess, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from narration_scripts import SCRIPTS

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

VOICE = "zh-CN-YunyangNeural"
RATE = "-7%"
PITCH = "-2Hz"

async def gen_one(num, text):
    tmp = os.path.join(AUDIO_DIR, f"ch{num}_raw.mp3")
    out = os.path.join(AUDIO_DIR, f"ch{num}.mp3")

    # Step 1: TTS synthesis
    cmd = [
        "edge-tts", "--voice", VOICE,
        "--rate=-7%", "--pitch=-2Hz",
        "--text", text, "--write-media", tmp
    ]
    proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    await proc.communicate()

    if not os.path.exists(tmp):
        print(f"  ✗ ch{num}: TTS failed")
        return

    raw_size = os.path.getsize(tmp)

    # Step 2: ffmpeg post-processing (loudnorm + resample + mono + bitrate)
    ff_cmd = [
        "ffmpeg", "-y", "-i", tmp,
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=9",
        "-ar", "24000", "-ac", "1",
        "-b:a", "48k", "-f", "mp3", out
    ]
    subprocess.run(ff_cmd, capture_output=True)

    final_size = os.path.getsize(out)
    # Get duration
    dur_proc = subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration",
        "-of", "csv=p=0", out], capture_output=True, text=True)
    duration = float(dur_proc.stdout.strip()) if dur_proc.stdout.strip() else 0

    os.remove(tmp)
    print(f"  ✓ ch{num}.mp3 | {duration:.1f}s | {final_size//1024}KB | {text[:30]}...")

async def main():
    print(f"Voice: {VOICE} | Rate: {RATE} | Pitch: {PITCH}")
    print(f"Output: {AUDIO_DIR}\n")

    tasks = [gen_one(num, text) for num, text in sorted(SCRIPTS.items())]
    await asyncio.gather(*tasks)

    # Report
    total = sum(os.path.getsize(os.path.join(AUDIO_DIR, f"ch{n}.mp3"))
                for n in SCRIPTS if os.path.exists(os.path.join(AUDIO_DIR, f"ch{n}.mp3")))
    count = len([n for n in SCRIPTS if os.path.exists(os.path.join(AUDIO_DIR, f"ch{n}.mp3"))])
    print(f"\n✓ {count}/10 generated | Total: {total//1024}KB")

if __name__ == "__main__":
    asyncio.run(main())
