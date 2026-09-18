"""Resize/compress selected built-in image edits; does not perform creative edits.

Run after the image-edit pass has saved artifacts/editorial/completed.json.
Generation masters stay ignored. Publish only WebP renditions and provenance.
"""
from pathlib import Path
import json
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
completed = json.loads((ROOT/'artifacts/editorial/completed.json').read_text())
assets = {}
for item in completed:
    key = item['key']
    master = ROOT/f'artifacts/editorial/{key}-master.png'
    if not master.exists():
        shutil.copyfile(item['output'], master)
    output = ROOT/'assets/enhanced'
    output.mkdir(exist_ok=True)
    with Image.open(master) as source:
        original = ImageOps.exif_transpose(source).convert('RGB')
        # Preserve aspect ratio, never upscale or crop the generated master.
        original.thumbnail((1536,1800), Image.Resampling.LANCZOS)
        w,h = original.size
        variants = []
        for width in sorted(set([min(480,w),min(960,w),w])):
            name = f'{key}-{width}.webp'
            path = output/name
            if not path.exists():
                im = original.resize((width,round(h*width/w)),Image.Resampling.LANCZOS)
                im.save(path,'WEBP',quality=82,method=6)
            variants.append({'width':width,'url':f'/assets/enhanced/{name}'})
        assets[key] = {'source':str(Path(item['source']).relative_to(ROOT)),
            'description':item['description'], 'method':'built-in-image-edit',
            'src':next((v['url'] for v in variants if v['width']==min(960,w)),variants[-1]['url']),
            'full':variants[-1]['url'],'width':w,'height':h,'variants':variants}
assets['listing-2569961419'] = {
    'source':'assets/listing/2569961419-1920.webp',
    'description':'The sunlit villa and private pool',
    'method':'built-in-image-edit',
    'src':'/assets/editorial/villa-light-960.webp',
    'full':'/assets/editorial/villa-light-1536.webp','width':1536,'height':1024,
    'variants':[{'width':w,'url':f'/assets/editorial/villa-light-{w}.webp'} for w in [640,960,1536]],
}
(ROOT/'content/editorial-assets.json').write_text(json.dumps({'edited_at':'2026-09-18','assets':assets},ensure_ascii=False,indent=2)+'\n')
print(f'Prepared {len(assets)} curated image assets.')
