"""Refresh the curated public review snapshot without exposing private provider fields.

HOSPITABLE_API_KEY and HOSPITABLE_PROPERTY_ID are server/CLI environment values.
This command never runs in the browser. It does not select new reviews or deploy.
Changed wording requires explicit --accept-changes after editorial review.
"""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
API = 'https://public.api.hospitable.com/v2'

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

def refresh(accept_changes=False):
    key = os.environ.get('HOSPITABLE_API_KEY')
    property_id = os.environ.get('HOSPITABLE_PROPERTY_ID')
    if not key or not property_id:
        raise ValueError('Set HOSPITABLE_API_KEY and HOSPITABLE_PROPERTY_ID in your shell environment. Never commit them.')
    import uuid
    uuid.UUID(property_id)
    opener = urllib.request.build_opener(NoRedirect())
    reviews = {}
    page = 1
    expected_total = None
    while True:
        url = f'{API}/properties/{property_id}/reviews?per_page=100&page={page}'
        req = urllib.request.Request(url, headers={'Authorization':f'Bearer {key}','Accept':'application/json'})
        with opener.open(req, timeout=30) as response:
            payload = json.load(response)
        meta = payload.get('meta', {})
        if page == 1:
            expected_total = meta.get('total')
        for item in payload['data']:
            reviews[item['id']] = item
        last = int(meta.get('last_page', 1))
        if last > 100:
            raise ValueError('Review history exceeds the import limit; inspect pagination before continuing.')
        if page >= last:
            break
        page += 1
    if expected_total is not None and len(reviews) != expected_total:
        raise ValueError('Incomplete review response; the published snapshot has not been changed.')
    path = ROOT/'content/guest-reviews.json'
    snapshot = json.loads(path.read_text())
    for lang, selected in snapshot['reviews'].items():
        for i, prior in enumerate(selected):
            item = reviews.get(prior['source_id'])
            if not item or item.get('platform') != 'airbnb':
                raise ValueError('A selected Airbnb review is missing; review the snapshot manually.')
            public = item.get('public', {})
            if public.get('rating') != 5 or not isinstance(public.get('review'), str) or not public['review'].strip():
                raise ValueError('A selected review no longer meets the published selection criteria.')
            if public['review'] != prior['text'] and not accept_changes:
                raise ValueError('Selected review wording changed. Inspect the public review before using --accept-changes.')
            # Explicit allowlist: never copy guest profiles, private feedback, reservations or host responses.
            selected[i] = {'source_id':item['id'],'platform':'airbnb','rating':5,'date':item['reviewed_at'][:10],'text':public['review']}
    snapshot['retrieved_at'] = datetime.now(timezone.utc).date().isoformat()
    tmp = path.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False)+'\n')
    tmp.replace(path)
    print(f'Refreshed {sum(len(v) for v in snapshot["reviews"].values())} selected public reviews from {len(reviews)} provider records. Rebuild and review before publishing.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--accept-changes', action='store_true')
    args = parser.parse_args()
    try:
        refresh(args.accept_changes)
    except (ValueError, KeyError, urllib.error.URLError) as error:
        if isinstance(error, urllib.error.HTTPError):
            parser.exit(1, f'Hospitable returned HTTP {error.code}; the snapshot has not changed.\n')
        parser.exit(1, f'Review refresh stopped: {error}\n')
