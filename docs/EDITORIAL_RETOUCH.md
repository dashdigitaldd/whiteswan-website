# Editorial photo treatment — September 18, 2026

The owner authorized subtle photo enhancements across the entire website and rejected the poolside daybed photograph. The selected collection contains **45 edited photographs**: the previously selected hero, 34 other listing photographs and ten existing website photographs. No rejected daybed image is rendered or linked by the photo viewer.

Method: **built-in image generation, edit mode**. Every local source was inspected before editing. Each asset received its own call. The results were visually reviewed, copied into the workspace and resized/compressed to responsive WebP files with Pillow. Pillow was not used for creative photo alteration.

The treatment aims for soft highlights, warmer natural light, legible interiors and restrained coastal color. Generative editing can redraw small objects, textures, foliage, sky and reflections, so these images are promotional editorial treatments, not pixel-identical documentary originals. No new room, amenity or service is intended or claimed. Original source photos are retained separately.

## Saved files and coverage

The complete source-to-output mapping, including every final saved path, is **[content/editorial-assets.json](../content/editorial-assets.json)**. New assets are in `assets/enhanced/`; the selected hero remains `assets/editorial/villa-light-{640,960,1536}.webp`. Ignored masters are saved as `artifacts/editorial/<asset-key>-master.png`, with the earlier hero in `artifacts/editorial/villa-light-master.png`.

Shared rendering covers the English and Spanish homepages, stay pages, gallery thumbnails and full-size views, and every guest-guide photograph. Original legacy guide photographs are replaced by the equivalent edited listing view where possible. Listing 2569999123 and legacy `daybed`, `massage` and `early` files are not used. The opening villa inset is now the ocean-view primary bedroom; the massage card uses a calm bedroom setting and does not depict a treatment.

## Exact prompt for the 44 new edits

Each prompt below was followed by ` Subject: `, the asset's exact `description` from the registry, and a final period. Each call had one referenced image: the registry's source path resolved from the repository root.

```text
Use case: style-transfer. Edit target: the supplied real hospitality photograph. Apply ONLY a subtle premium editorial photographic color grade and tonal correction. Preserve the exact scene, composition, crop, perspective, architecture, room dimensions, furniture, every object, vegetation, people, lettering, sky, weather, and time of day. No added or removed objects, no redesigned room, no fictional amenities, no new view. Gently soften harsh highlights, lift dark shadow detail, refine natural white balance, retain warm sunlight, make foliage and water quietly rich but realistic, retain tactile detail. Elegant coastal hospitality magazine photography, natural and restrained, never HDR or oversaturated. Existing flaws and all physical features must remain accurate. Output one photograph matching the source aspect ratio, longest edge about 1536px. No text added, no borders.
```

## Earlier hero prompt

```text
Edit the supplied photograph with ONLY a subtle professional color grade and tonal correction. This is a REAL villa listing and must remain an accurate documentary photograph. Do not reconstruct or redraw the scene. Match the source image precisely: identical composition, perspective, crop, edges, every window pane, pool boundary, pool steps, cushions, railings, outdoor furniture, wires, vegetation and the existing clear sky. Do not add clouds or objects, remove objects or improve architecture. Keep original textures and shapes. Gently reduce harsh contrast, soften bright highlights, lift shaded facade detail, warm the existing sunlight a little and balance pool cyan naturally. Quiet fine-art hospitality photography, restrained and realistic. NO new ripples, NO replaced sky, NO additional lights, NO room changes. Output one high-resolution 3:2 landscape image.
```
