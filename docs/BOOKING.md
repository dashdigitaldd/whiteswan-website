# Booking within the White Swan website

## Implemented now

Primary navigation, hero, villa-facts, mobile and closing CTAs route to **`/stay/`** or **`/es/reservar/`**. The bilingual pages have a property photograph, date/group selection, a stay summary with a correct night count, edit controls and an explicit host-reviewed request handoff to the existing WhatsApp number. Dates are validated against the current date in America/El_Salvador; departure must follow arrival. Larger groups must ask the host rather than being advertised as automatically permitted.

The default mode makes no availability, price, inventory hold, booking, payment or message-delivery claim. Preparing the request only creates a local summary; the guest must send it in WhatsApp. Dates remain editable and no card details are collected. No-JavaScript visitors can contact the host directly. Airbnb remains a secondary alternative, not the main CTA destination.

## Hospitable Direct activation dependency

The public API is authenticated and reviews are connected. The returned property object does **not** supply the account-specific booking-widget code or prove Direct activation. No Direct site, paid plan, payment method or live reservation was created by this release.

Hospitable’s current plan comparison lists **Direct Lite** for non-Stripe markets, with an embedded booking widget and booking requests, but without payment processing, Instant Book or custom quotes. This is the candidate for on-site booking requests in El Salvador while an external Promerica payment arrangement is assessed. Eligibility and widget availability must still be verified in this account; the generic widget article is less explicit about Lite than the plan comparison.

The owner/account operator should open **Direct Bookings → Website**, set up the White Swan property as a self-hosted site, and use **Copy widget code**. Confirm any subscription/add-on charges before activating a paid plan. Use the website property URL `https://staywhiteswan.com/stay/`; verify the Spanish equivalent works with the same property widget. No DNS change is needed.

Paste the exact exported public embed into `content/hospitable-widget.html.template` and regenerate. `scripts/homepage.py` detects a non-comment embed and replaces the temporary request form with the actual widget in both languages. Never put an API/MCP token in that file. Do not manufacture a widget URL from the API property UUID. Use the current dynamic loader exported by Hospitable (August 2026 onward), not an old iframe recipe.

Before release, verify the correct property, live availability, full quote/fees/taxes, mobile layout, language, booking terms, error states and the request status in Hospitable. Use an explicitly authorized test booking; the preview checks do not create one. For Lite, distinguish a booking request, acceptance and externally verified payment. Verify booking events enter the private app via its existing integration; page navigation alone is not CRM ingestion.

## Payments

Direct Premium payouts currently support US/UK/Australian bank accounts; Direct Basic relies on Stripe-supported merchant countries. Neither establishes a payout route to this owner’s Salvadoran Promerica personal account. Use the separate Promerica onboarding and payment architecture in `PAYMENTS.md`. Accommodation advance, remaining balance and damage deposits need distinct records and agreed terms. Hosted checkout and verified payment events are required before showing a paid/confirmed state.

Sources checked September 16, 2026:

- [Direct plans, including Lite](https://help.hospitable.com/en/articles/14509386-all-about-direct-bookings)
- [Bank accounts and supported regions](https://help.hospitable.com/en/articles/14849116-set-up-a-bank-account-for-direct-bookings)
- [Generate and embed the booking widget](https://help.hospitable.com/en/articles/14804519-how-to-add-a-booking-widget-to-your-website)

## Validation

Static checks cover all ten localized pages, local links, metadata, sitemap, JavaScript syntax, public review field allowlisting and internal booking CTA destinations. Browser checks cover 320/390/768/1440px, both languages, keyboard/menu controls, date validation, night counts, group labels, editing a prepared request, the unsent WhatsApp handoff and no-JavaScript behavior. No live messages, reservations or payments are used in tests.
