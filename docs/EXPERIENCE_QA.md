# Guest experience refinement — September 22, 2026

The existing ivory, pine and bronze design and approved property photographs are retained. The polish pass makes supporting copy, FAQs, navigation and service actions easier to read; touch targets and keyboard focus remain visible. The primary hero action consistently says “Plan your stay.” The general WhatsApp enquiry prompt now speaks to the guest's plans rather than describing an unconfigured form.

The stay layout puts date selection alongside the villa introduction on desktop and before the photo on mobile. Dates and group size survive a language switch, and the request summary presents arrival, departure and party size separately. See [booking behavior and remaining activation requirements](BOOKING.md).

The photo viewer now shows a localized loading state and a retry action on failure. It hides the previous photo while the next loads, ignores stale requests and preserves keyboard navigation after retry. Filters, captions, Escape and swipe behavior remain available.

Validation performed on the local preview:

- Static checks and all 17 existing Python tests passed.
- All ten localized routes checked for horizontal overflow at 320, 390, 768 and 1440 pixels.
- Both languages: future-date validation, night count, request summary, editing, larger-group option, language carryover, and rejection of invalid query parameters. No-JavaScript visitors retain a WhatsApp link.
- Both languages: gallery failure and retry, matching image/caption, arrow navigation and Escape; mobile menu dismissal; contextual WhatsApp enquiry fallback.
- Mock enquiry failure preserves details; retry displays a verified receipt; reopening resets the form. Declining analytics suppresses events and campaign attribution; opting in sends no contact details in events.
- Desktop/mobile visual review of the homepage, villa section, services, FAQs and stay pages. Reduced-motion mode remains supported. No live messages, reservations or payments were made.

These are local preview checks. The public domain changes only after the upstream owner merges the website PR. Direct booking, payments, WhatsApp reception and automatic agent replies still require their documented activation work.
