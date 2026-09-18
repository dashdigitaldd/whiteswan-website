# Service imagery

Created with the built-in image generation tool on 18 September 2026. These three images illustrate services; they are not supplier portraits, property photographs or promises of a particular arrangement. A visible EN/ES note and image alt text identify their illustrative status. Real supplier photography can replace them when available.

## Assets

- Chef: `assets/services/chef-{480,960,1536}.webp`
- Massage table: `assets/services/massage-{480,960,1536}.webp`
- Champagne, flowers and balloons: `assets/services/celebration-{480,960,1536}.webp`

All nine responsive files are committed. Only mechanical resizing and WebP compression were applied after generation. `content/service-imagery.json` registers sizes and provenance separately from the genuine listing/guide photographs. `content/service-imagery-prompts.json` contains the exact final prompt set. `scripts/photography.py` renders them on the homepage; no model calls occur at runtime.

Do not use these illustrations in the property's listing-photo gallery or describe the depicted chef as a real supplier. Keep on-request availability/quote wording and the public illustrative label.
