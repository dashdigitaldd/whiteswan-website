"""Create responsive WebP copies of the approved generated service images.

Only resize and compress. Retain the composition and color of each master.
Masters are local artifacts; deploy the WebP copies and retain prompt provenance.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'content/service-imagery.json').read_text())
registry_path = ROOT / 'content/editorial-assets.json'
registry = json.loads(registry_path.read_text())
output = ROOT / 'assets/services'
output.mkdir(exist_ok=True)

for item in manifest['assets']:
    master = ROOT / item['master']
    with Image.open(master) as source:
        original = source.convert('RGB')
        w, h = original.size
        variants = []
        for width in sorted({min(320, w), min(640, w), min(960, w), w}):
            filename = f'{item["key"]}-{width}.webp'
            original.resize((width, round(h * width / w)), Image.Resampling.LANCZOS).save(
                output / filename, 'WEBP', quality=84, method=6)
            variants.append({'width': width, 'url': f'/assets/services/{filename}'})
    registry['assets'][item['key']] = {
        'source': item['master'],
        'description': item['alt']['en'],
        'method': manifest['method'],
        'provenance': 'content/service-imagery.json',
        'src': next(v['url'] for v in variants if v['width'] == min(960, w)),
        'full': variants[-1]['url'],
        'width': w, 'height': h, 'variants': variants,
    }
registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n')
print(f'Prepared {len(manifest["assets"])} service images; existing photographs retained.')
