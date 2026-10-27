"""Check actual decoded frames for camera drift after rendering the film."""
import io
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
FILM = json.loads((ROOT / 'content/villa-film.json').read_text())


def frame(path, second):
    data = subprocess.check_output([
        FFMPEG, '-v', 'error', '-ss', str(second), '-i', str(path),
        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png',
        '-threads', '1', '-'])
    return Image.open(io.BytesIO(data)).convert('RGB')


for kind, variant in FILM['variants'].items():
    path = ROOT / variant['url'].lstrip('/')
    drift = []
    # Compare holds outside the four dissolves. Small H.264 reconstruction
    # differences are allowed; a moving crop changes many pixels and fails.
    for start, end in [(1, 3.5), (6, 7.5), (10, 11.5), (14, 15.5), (18.5, 20)]:
        first, last = frame(path, start), frame(path, end)
        assert first.size == (variant['width'], variant['height'])
        delta = sum(ImageStat.Stat(ImageChops.difference(first, last)).mean) / 3
        assert delta < .5, f'{kind}: framing moved between {start}s and {end}s ({delta:.3f}/255)'
        drift.append(round(delta, 4))
    print(f'{kind}: fixed framing passed in all five scenes; mean pixel drift {drift}')
