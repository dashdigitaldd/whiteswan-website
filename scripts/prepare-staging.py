"""Package public-only files for a non-indexable Cloudflare preview. No deployment."""
from pathlib import Path
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'artifacts' / 'cloudflare-staging'
PUBLIC = DEST / 'public'
if PUBLIC.exists():
    shutil.rmtree(PUBLIC)
PUBLIC.mkdir(parents=True, exist_ok=True)
for name in ['index.html', '404.html', 'sitemap.xml', 'assets', 'es', 'guide', 'privacy', 'photos', 'stay', 'website-photos']:
    source = ROOT / name
    if source.is_dir():
        shutil.copytree(source, PUBLIC / name, dirs_exist_ok=True)
    else:
        shutil.copy2(source, PUBLIC / name)
# The pilot origin is public configuration, never an API key.
(PUBLIC / 'assets/config.js').write_text("window.WHITE_SWAN_CONFIG = Object.freeze({intakeOrigin: 'https://white-swan-intake-staging.dashdigitaldd.workers.dev', analyticsEnabled: false});\n")
(PUBLIC / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
(PUBLIC / '_headers').write_text('/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n')
(DEST / 'wrangler.json').write_text(json.dumps({
    'name': 'white-swan-website-staging',
    'compatibility_date': '2026-09-25',
    'workers_dev': True,
    'preview_urls': False,
    'assets': {'directory': './public', 'not_found_handling': '404-page'},
}, indent=2) + '\n')
print('Staging assets prepared; production CNAME, robots and runtime configuration unchanged.')
