#!/usr/bin/env python3
"""Generate 65 OPC course narration MP3 files.

Pipeline:
1. Read short narration scripts under 500 chars from docs/course/narration.
2. Synthesize with edge_tts using zh-CN-YunyangNeural by default.
3. Normalize and transcode with ffmpeg:
   loudnorm=I=-16:TP=-1.5:LRA=9, 24000Hz, mono, MP3, 64kbps.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import edge_tts
except ImportError:  # pragma: no cover - user-facing dependency message
    edge_tts = None


REPO_ROOT = Path(__file__).resolve().parents[1]
COURSE_ROOT = REPO_ROOT / "docs" / "course"
CATALOG_PATH = COURSE_ROOT / "data" / "catalog.json"
NARRATION_DIR = COURSE_ROOT / "narration"
AUDIO_DIR = COURSE_ROOT / "audio"

DEFAULT_VOICE = "zh-CN-YunyangNeural"
DEFAULT_RATE = "-7%"
DEFAULT_PITCH = "-2Hz"
DEFAULT_BITRATE = "64k"
LOUDNORM = "loudnorm=I=-16:TP=-1.5:LRA=9"


def count_chars(text: str) -> int:
    return len("".join(text.split()))


def load_lessons() -> list[dict]:
    if not CATALOG_PATH.exists():
        raise SystemExit(f"Missing {CATALOG_PATH}. Run: node scripts/build_course_content.mjs")
    payload = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    return payload["lessons"]


def ffmpeg_path(explicit: str | None) -> str:
    if explicit:
        return explicit
    found = shutil.which("ffmpeg")
    if not found:
        raise SystemExit("ffmpeg not found. Install ffmpeg or pass --ffmpeg /path/to/ffmpeg")
    return found


def ffprobe_path() -> str | None:
    return shutil.which("ffprobe")


async def synthesize(text: str, media_path: Path, voice: str, rate: str, pitch: str) -> None:
    if edge_tts is None:
        raise SystemExit("edge-tts is not installed. Run: .venv/bin/python -m pip install edge-tts")
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(media_path))


def normalize_audio(raw_path: Path, out_path: Path, ffmpeg: str, bitrate: str) -> None:
    cmd = [
        ffmpeg,
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(raw_path),
        "-af",
        LOUDNORM,
        "-ar",
        "24000",
        "-ac",
        "1",
        "-b:a",
        bitrate,
        "-f",
        "mp3",
        str(out_path),
    ]
    subprocess.run(cmd, check=True)


def probe_audio(path: Path) -> str:
    probe = ffprobe_path()
    if not probe:
        return "ffprobe unavailable"
    cmd = [
        probe,
        "-v",
        "error",
        "-show_entries",
        "format=duration:stream=sample_rate,channels,bit_rate",
        "-of",
        "json",
        str(path),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        return "probe failed"
    data = json.loads(proc.stdout or "{}")
    stream = (data.get("streams") or [{}])[0]
    duration = float((data.get("format") or {}).get("duration") or 0)
    return f"{duration:.1f}s | {stream.get('sample_rate')}Hz | {stream.get('channels')}ch | {stream.get('bit_rate', 'n/a')}bps"


async def generate_one(lesson: dict, args: argparse.Namespace, ffmpeg: str) -> bool:
    lesson_id = lesson["id"]
    narration_path = NARRATION_DIR / f"{lesson_id}.txt"
    out_path = AUDIO_DIR / f"{lesson_id}.mp3"
    if out_path.exists() and not args.force:
        print(f"skip {lesson_id}: exists")
        return True

    text = narration_path.read_text(encoding="utf-8").strip()
    chars = count_chars(text)
    if chars < 150 or chars > 500:
        raise SystemExit(f"{lesson_id} narration length {chars} outside 150-500 chars")

    if args.dry_run:
        print(f"dry-run {lesson_id}: {chars} chars -> {out_path.relative_to(REPO_ROOT)}")
        return True

    with tempfile.TemporaryDirectory(prefix="opc-course-audio-") as tmpdir:
        raw_path = Path(tmpdir) / f"{lesson_id}-raw.mp3"
        await synthesize(text, raw_path, args.voice, args.rate, args.pitch)
        normalize_audio(raw_path, out_path, ffmpeg, args.bitrate)

    print(f"ok {lesson_id}: {chars} chars | {probe_audio(out_path)} | {out_path.stat().st_size // 1024}KB")
    return True


async def main() -> None:
    parser = argparse.ArgumentParser(description="Generate OPC course narration audio.")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--rate", default=DEFAULT_RATE)
    parser.add_argument("--pitch", default=DEFAULT_PITCH)
    parser.add_argument("--bitrate", default=DEFAULT_BITRATE, choices=["48k", "64k"])
    parser.add_argument("--limit", type=int, default=0, help="Generate only the first N lessons.")
    parser.add_argument("--start", type=int, default=1, help="Start lesson number.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--ffmpeg", default=None)
    args = parser.parse_args()

    if edge_tts is None and not args.dry_run:
        raise SystemExit("edge-tts is not installed. Run: .venv/bin/python -m pip install edge-tts")

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    lessons = [row for row in load_lessons() if row["number"] >= args.start]
    if args.limit:
        lessons = lessons[: args.limit]
    ffmpeg = ffmpeg_path(args.ffmpeg)

    print(f"Voice: {args.voice} | Rate: {args.rate} | Pitch: {args.pitch} | Bitrate: {args.bitrate}")
    print(f"Post: {LOUDNORM} | 24000Hz | mono | MP3")
    print(f"Output: {AUDIO_DIR.relative_to(REPO_ROOT)}")

    ok = 0
    for lesson in lessons:
        if await generate_one(lesson, args, ffmpeg):
            ok += 1

    total_size = sum(path.stat().st_size for path in AUDIO_DIR.glob("lesson-*.mp3"))
    print(f"Generated/available: {ok}/{len(lessons)} in this run | course audio total {total_size // 1024}KB")


if __name__ == "__main__":
    asyncio.run(main())
