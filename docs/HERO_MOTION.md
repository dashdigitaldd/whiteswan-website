# Day-to-night cover

The homepage uses the existing daytime house photograph and the same `guide-transfer` night photograph as the closing invitation. No video, generated property imagery, remote animation library or runtime API is involved.

- The house stays visible immediately, including without JavaScript.
- After both photographs decode, a 24-second alternating 1–1.045 scale animation adds gentle movement. A 3.2-second opacity dissolve switches scenes every 14 seconds.
- Daylight / After dark buttons select a photograph and stop automatic playback. A separate localized pause/play button controls movement and rotation. Keyboard focus entering the controls pauses playback.
- Reduced-motion and data-saver preferences disable autoplay. Reduced motion also removes the dissolve and zoom, while keeping manual scene selection. Changing the preference at runtime stops playback; it never restarts without a guest action.
- The timer and zoom pause while the cover is outside the viewport or the document is hidden. Returning starts a fresh 14-second hold.
- The daytime photo keeps high fetch priority. The night photo has low priority. If either image cannot decode, the controls stay hidden and daylight remains the fallback.
- The fixed cover dimensions prevent layout shifts between differently sized source photographs. Mobile uses a 3:2 viewport.

Implementation: `scripts/homepage.py::hero_scene`, `assets/hero-motion.js`, and the cinematic-cover rules in `assets/hospitality.css`. Regenerate with `scripts/build.py` after template changes.

Validation on 18 September 2026: automatic rotation, manual selection, pause/play, keyboard pause, offscreen suspension, stable image area, runtime reduced-motion changes, EN/ES at 320/390/768/1440 pixels, decoded-image screenshots, no-JavaScript rendering and failed-image fallback. Existing form success/failure/retry and analytics consent checks also passed using mocked responses. No live messages or enquiries were sent.
