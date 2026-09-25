# White Swan brand

The owner supplied the White Swan Beach House navy-and-gold logo on 25 September 2026 and authorized its use in the private app and public website. Use the supplied artwork, not the previous waves icon, generic swan illustration or a recreated wordmark.

- Navy: `#041839`, sampled from the lettering; primary actions and navigation.
- Gold: `#d6b14c`; decorative accents and selection highlights.
- Bronze: `#806018`; gold-family text on light backgrounds with stronger contrast.
- Ivory: `#faf8f2`; a quiet background that keeps the navy logo legible.

The transparent 1254 × 1254 PNG is retained byte for byte (SHA-256 `e50bcaa0ecb1fa1196c19602507829516096dcf6043446d29dff55014e486c6b`). A CSS frame displays its main artwork at the original proportions, excluding empty canvas margins; it does not stretch, recolor or regenerate the mark. Use the same frame in both repositories. Do not apply the earlier photographic retouch filters to the logo.

Gold is an accent, not white text on a bright-gold button. Use navy with white labels for primary actions. Confirmation, warning, error and message-authorship colors retain their distinct meanings. Desktop and mobile headers provide a named home link/button; public footers repeat the same artwork. The logo remains visible without JavaScript.

Implementation: [artwork](../assets/brand/white-swan-logo.png), [brand styles](../assets/brand.css), [shared header/footer](../scripts/homepage.py). The CSS bundle includes the brand layer last; rebuild all localized pages with `scripts/build.py`. No domain, contact number, analytics or booking-mode change is part of this identity update.
