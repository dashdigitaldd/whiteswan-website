# Public homepage film

The English and Spanish homepages play a 22-second film made from the approved property photographs. Five scenes cover the villa, infinity pool, dining terrace and kitchen, primary bedroom, and villa at night. The interior scene uses two frames, arranged vertically on phones. The film uses fixed photographs and cross-dissolves. It contains no live-action footage.

The film has no sound. Titles and controls use the page language. Visitors can pause, replay, choose a scene, or switch to the daylight and night photographs. The film ends on the night scene and does not loop.

## Playback and loading

The daylight picture remains the first image and works without JavaScript. The video has no initial source and requests no preload. Automatic playback waits for that picture to load, the cover to enter the viewport, and an idle callback. Reduced motion, data saver, or a reported 2G/3G connection prevents automatic video loading. Visitors can still choose to play it.

Playback pauses when the cover leaves the viewport, the tab is hidden, or the page enters the back-forward cache. A manual pause remains in effect when the visitor returns. Changes to estimated connection speed do not interrupt an active film. A changed reduced-motion or data-saver preference returns to the photograph. A failed video leaves the photographs and gallery available.

The desktop MP4 is 1920 by 1080 pixels, about 8.2 MiB. The phone version is 960 by 1200 pixels, about 4.2 MiB. Both use H.264 at 30 frames per second with metadata at the start of the file. Lossless intermediate clips avoid repeated compression during rendering. Each published filename includes a content hash so browsers request the current export after an update. The player selects one version for the visit and does not download another after a resize.

## Editing

Source photographs, sizes and chapter times are recorded in `content/villa-film.json`. Render the files with `.venv/bin/python scripts/render-villa-film.py`. FFmpeg with libx264 is required. Keep all source photographs in the approved image registry.

The hero markup and translated titles are in `scripts/homepage.py`. Playback is in `assets/hero-motion.js`; visual styles are in `assets/villa-film.css`. Run `.venv/bin/python scripts/build.py` after changes. The generated static pages and media files are committed so hosting requires no renderer.

Photographs keep fixed framing throughout playback. Zoom, pan and sliding transitions caused visible wobble in the first export and have been removed, along with hover and scroll zooms on the page. The original photographs still set the limit on available detail.

The player tests cover deferred requests, pause and resume, user preferences, source selection, chapter changes, blocked autoplay and media errors. The asset tests check size budgets, fast-start metadata and public-page scope.

Run `.venv/bin/python scripts/check-villa-film.py` after each render. It decodes two frames from every scene in each export and checks that the photograph has not shifted between them. The threshold allows minor H.264 reconstruction differences.
