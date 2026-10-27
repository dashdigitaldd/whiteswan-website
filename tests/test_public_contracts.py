"""Run with: python3 -m unittest discover -s tests (dev requirements installed)."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
import homepage
spec=importlib.util.spec_from_file_location('review_sync',ROOT/'scripts/sync-reviews.py')
sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)

class Response:
    def __init__(self,data): self.data=data
    def __enter__(self): return self
    def __exit__(self,*args): pass
    def read(self,*args): return json.dumps(self.data).encode()

class PublicContracts(unittest.TestCase):
    def test_platform_owned_booking_in_both_languages(self):
        for lang in ['en','es']:
            page=homepage.stay(lang,lambda *a:'',lambda *a:'')
            for identifier in ['stay-request','stay-contact','availability-days','stay-received']:
                self.assertIn('id="'+identifier+'"', page)
            self.assertNotIn('data-booking-provider="hospitable"',page)
            self.assertNotIn('type="password"',page)
            self.assertIn('name="contactConsent"',page)

    def sync_fixture(self,rating=5,text='A lovely stay.',accept=False,author=None):
        prior={'source_id':'public-1','platform':'airbnb','rating':5,'date':'2026-01-01','text':'A lovely stay.'}
        if author: prior['author']=author
        raw={'id':'public-1','platform':'airbnb','reviewed_at':'2026-01-01T12:00:00Z','public':{'rating':rating,'review':text,'response':'host response'},'private':{'feedback':'PRIVATE-SENTINEL'},'reservation_id':'PRIVATE-RESERVATION'}
        with tempfile.TemporaryDirectory() as tmp:
            base=Path(tmp);(base/'content').mkdir();path=base/'content/guest-reviews.json'
            before=json.dumps({'retrieved_at':'2026-01-01','reviews':{'en':[prior]}})
            path.write_text(before)
            class Opener:
                def open(self,req,timeout):return Response({'data':[raw],'meta':{'last_page':1,'total':1}})
            with patch.object(sync,'ROOT',base),patch.dict(sync.os.environ,{'HOSPITABLE_API_KEY':'synthetic','HOSPITABLE_PROPERTY_ID':'012da0cc-8dde-4493-a0cf-bcfcde22be01'}),patch.object(sync.urllib.request,'build_opener',return_value=Opener()):
                if rating!=5 or text!=prior['text'] and not accept:
                    with self.assertRaises(ValueError):sync.refresh(accept)
                    self.assertEqual(path.read_text(),before)
                else:
                    sync.refresh(accept)
                    result=path.read_text()
                    self.assertNotIn('PRIVATE',result)
                    self.assertNotIn('host response',result)
                    updated=json.loads(result)['reviews']['en'][0]
                    self.assertEqual(set(updated),set(prior)-({'author'} if text!=prior['text'] else set()))
                    return updated

    def test_refresh_never_exports_private_fields(self):self.sync_fixture()
    def test_rating_change_preserves_published_snapshot(self):self.sync_fixture(rating=4)
    def test_changed_wording_requires_editorial_acceptance(self):self.sync_fixture(text='Changed review.')
    def test_explicitly_accepted_wording_remains_allowlisted(self):self.sync_fixture(text='Changed review.',accept=True)

    def test_verified_public_author_survives_refresh_but_requires_rematch_after_edit(self):
        author={'first_name':'Sample','image':'/assets/reviewers/sample.webp','profile_url':'https://www.airbnb.com/users/profile/123','source_image_url':'https://a0.muscache.com/sample.jpeg','airbnb_review_id':'123','verified_at':'2026-10-27'}
        self.assertEqual(self.sync_fixture(author=author)['author'],author)
        self.assertNotIn('author',self.sync_fixture(author=author,text='Changed review.',accept=True))

    def test_review_cards_keep_verbatim_text_and_matched_public_identity(self):
        from lxml import html
        snapshot=json.loads((ROOT/'content/guest-reviews.json').read_text())
        for lang in ['en','es']:
            page=html.fromstring(homepage.guest_reviews(lang))
            cards=page.xpath('.//figure')
            for card,review in zip(cards,snapshot['reviews'][lang]):
                self.assertEqual(card.find('.//blockquote/p').text,review['text'])
                self.assertEqual(card.find('.//figcaption//strong').text,review['author']['first_name'])
                self.assertEqual(card.find('.//figcaption//img').get('src'),review['author']['image'])


class ConciergeLinks(unittest.TestCase):
    def test_all_topics_are_contextual_native_links(self):
        from concierge import TOPICS, whatsapp, widget
        from urllib.parse import urlsplit, parse_qs
        for lang in ['en','es']:
            for topic in TOPICS:
                url=urlsplit(whatsapp(lang,topic,'/es/#concierge' if lang=='es' else '/#concierge'))
                self.assertEqual(url.netloc,'wa.me')
                self.assertEqual(url.path,'/50370528003')
                message=parse_qs(url.query)['text'][0]
                self.assertIn(TOPICS[topic][3 if lang=='es' else 2],message)
                self.assertIn('https://staywhiteswan.com/',message)
                self.assertNotIn('utm_',message)
            rendered=widget(lang,'/photos/')
            self.assertEqual(rendered.count('data-topic='),12)
            self.assertIn('<details',rendered)
            self.assertIn('target="_blank" rel="noopener"',rendered)
    def test_context_rejects_external_or_query_paths(self):
        from concierge import whatsapp
        for path in ['//outside.invalid','https://outside.invalid','/?email=private']:
            with self.assertRaises(AssertionError):whatsapp('en','villa',path)

if __name__=='__main__':unittest.main()
