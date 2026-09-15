"""Prepare reviewed listing photographs. Run explicitly; never fetch during a site build."""
from pathlib import Path
from urllib.parse import urlsplit
import concurrent.futures, json, time, urllib.request
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'artifacts/listing-originals'
OUTPUT=ROOT/'assets/listing'
SOURCE.mkdir(parents=True,exist_ok=True)
OUTPUT.mkdir(parents=True,exist_ok=True)
photos=json.loads((ROOT/'content/listing-photos.json').read_text())['photos']
def prepare(photo):
    url=urlsplit(photo['sourceUrl'])
    if url.scheme!='https' or url.hostname!='a0.muscache.com' or '/Hosting-47911834/original/' not in url.path:
        raise ValueError('Only reviewed White Swan listing image URLs are accepted.')
    if not photo['id'].isdigit():raise ValueError('Photo IDs must be numeric.')
    source=SOURCE/(photo['id']+'.jpg')
    if not source.exists():
        for attempt in range(3):
            try:
                with urllib.request.urlopen(photo['sourceUrl'],timeout=45) as response:source.write_bytes(response.read())
                break
            except Exception:
                if attempt==2:raise
                time.sleep(1)
    with Image.open(source) as original:
        original=ImageOps.exif_transpose(original).convert('RGB')
        for width in [480,960,1600,1920]:
            variant=original.copy();variant.thumbnail((width,width*2))
            variant.save(OUTPUT/f'{photo["id"]}-{width}.webp','WEBP',quality=80,method=4)
    return photo['id']
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for photo_id in pool.map(prepare,photos):print('Prepared',photo_id)
