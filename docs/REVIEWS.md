# Public guest reviews

## Current snapshot

On September 16, 2026 the authenticated Hospitable property-reviews API returned **173 reviews** across two pages: 166 with public rating 5 and seven with public rating 4. The public website displays **six selected five-star reviews**, three in each language. It does not present the selected subset as an overall rating or an unfiltered feed.

`content/guest-reviews.json` contains an explicit allowlist: source review ID, platform, public rating, date and original public review text. Names were not supplied in these review records, so attribution says “Airbnb guest” with the month/year. Do not infer names from reservations or private chat. The reviews link to the listing’s full Airbnb reviews page.

English selection: views/amenities and returning; communication and hospitality; comfort and a well-equipped house. Spanish selection: a complete stay; cleanliness/privacy/responsiveness; rooms and kitchen. Text is verbatim, with no AI paraphrase, invented testimony, omitted negative clause or unlabelled translation. The UI explicitly identifies a selected five-star collection.

## Safe refresh

Set `HOSPITABLE_API_KEY` and `HOSPITABLE_PROPERTY_ID` in the maintainer’s secure shell environment, then run:

```sh
python3 scripts/sync-reviews.py
python3 scripts/build.py
python3 scripts/check.py
```

The sync script follows API pagination, rejects incomplete responses, refuses redirects carrying credentials, and writes only the allowlisted public fields for the already-curated IDs. Private feedback, detailed private ratings, reservation IDs, profiles and host responses never enter the published snapshot. Credentials stay out of the repository and browser. New visitors read static HTML; they do not hit Hospitable.

Missing reviews, rating changes or changed wording stop the refresh before writing. Inspect changed public wording before using `--accept-changes`. Adding or replacing a selection is an editorial change; inspect the complete public review and update its ID intentionally. Review the generated diff before merging. The snapshot is not a scheduled live sync; future automation should propose an editorial PR, not silently publish every new review.

Raw provider responses are private working artifacts outside this repository. Do not copy them into GitHub.
