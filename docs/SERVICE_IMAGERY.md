# Service imagery

The owner commissioned three close-up service images on 27 October 2026: a chef finishing a fish dish, a hand massage, and a celebration table with sparkling wine and flowers. They appear on the English and Spanish homepages with an illustrative-image caption.

The images were created with the built-in image-generation tool. The exact prompts and source filenames are in `content/service-imagery.json`. The responsive files are registered in `content/editorial-assets.json`.

Each image has 320, 640, 960 and 1448 pixel WebP copies in `assets/services/`, with filenames starting `service-chef-closeup`, `service-massage-closeup` and `service-celebration-closeup`. Local PNG masters are in the ignored `artifacts/service-imagery/` folder. Run `scripts/prepare-service-images.py` to resize and compress those masters. A normal site build uses the committed WebP files and needs no model calls.

Keep these images out of the property photo gallery. They illustrate the services; the people, dish and arrangement are generated. Existing supplier contacts, prices and availability rules still apply.

## Retired images

The earlier chef, massage table and celebration illustrations from 18 September 2026 remain as historical files. Their filenames are `chef-{480,960,1536}.webp`, `massage-{480,960,1536}.webp` and `celebration-{480,960,1536}.webp`. Their original prompts remain in `content/service-imagery-prompts.json`. They are no longer rendered on any page or included in the publication allowlist.
