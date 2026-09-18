"""One curated image registry for every public page and responsive size."""
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / 'content/listing-photos.json').read_text())
PHOTOS = CATALOG['photos']
EXCLUDED_IDS = {'2569999123'}  # Owner rejected the poolside daybed photograph.
GALLERY_ORDER = [29,28,32,9,27,31,35,8,10,11,12,13,14,15,16,17,18,1,7,2,0,3,4,5,6,24,25,26,19,20,21,22,23,33,34]
PHOTO_COUNT = len(GALLERY_ORDER)
ALIASES = {
    'bedroom':9, 'bath':22, 'kitchen':4, 'living':1, 'latecheckout':9,
    'dusk':31, 'hero':29, 'pool':28, 'poolwide':28, 'outdoor':24,
    'daybed':27, 'early':11, 'massage':12, 'tours':35, 'dining':7,
    'arrival':33, 'house':32,
}

def listing_key(index):
    identifier = str(PHOTOS[index]['id'])
    if identifier in EXCLUDED_IDS:
        raise ValueError('This photograph is excluded from the public website')
    return f'listing-{identifier}'

def registry():
    return json.loads((ROOT / 'content/editorial-assets.json').read_text())['assets']

def full_photo(index):
    return registry()[listing_key(index)]['full']

def markup(key, alt, hero=False, sizes='(max-width: 700px) 100vw, 50vw'):
    asset = registry()[key]
    srcset = ', '.join(f'{v["url"]} {v["width"]}w' for v in asset['variants'])
    load = 'fetchpriority="high"' if hero else 'loading="lazy"'
    return f'<img src="{asset["src"]}" srcset="{srcset}" sizes="{sizes}" width="{asset["width"]}" height="{asset["height"]}" alt="{escape(alt)}" {load} decoding="async">'

def photo(index, lang, hero=False, sizes='(max-width: 700px) 100vw, 50vw'):
    return markup(listing_key(index), PHOTOS[index]['alt'][lang], hero, sizes)

def legacy_image(name, alt, hero=False, lang=None):
    if name in ALIASES:
        index = ALIASES[name]
        # The replacement's alt describes its actual scene, not the old image.
        if lang:
            alt = PHOTOS[index]['alt'][lang]
        return markup(listing_key(index), alt, hero)
    return markup(f'guide-{name}', alt, hero)
