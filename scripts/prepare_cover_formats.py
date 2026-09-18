"""Mechanical AVIF encoding of existing selected cover photos; no visual retouch."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
for name,source in [('villa-light','assets/editorial/villa-light-1536.webp'),('villa-night','assets/enhanced/guide-transfer-1536.webp')]:
    image=Image.open(ROOT/source).convert('RGB')
    for width in [640,960,1536]:
        resized=image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS)
        resized.save(ROOT/f'assets/editorial/{name}-{width}.avif',quality=60,speed=6)
print('Six AVIF cover variants written; original WebP files remain the fallback.')
