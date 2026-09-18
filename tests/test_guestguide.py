"""Guard the content migration: retained chapters, destinations and entry points."""
import sys
import unittest
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from guestguide import source, DESTINATIONS


def normalized(el):
    return ' '.join(el.text_content().split())


class GuestGuide(unittest.TestCase):
    def test_existing_handbook_content_survives(self):
        for lang, path in [('en', 'guide'), ('es', 'es/guia')]:
            original = source(lang)
            published = html.parse(str(ROOT / path / 'index.html')).getroot()
            for key in ['arrive', 'services', 'villa', 'house', 'rules', 'checkout', 'faq']:
                old = original.get_element_by_id(key)
                new = published.get_element_by_id(key)
                for paragraph in old.xpath('.//p'):
                    # Checkout paragraph contains a deliberately updated channel CTA.
                    if paragraph.xpath('.//a'): continue
                    self.assertIn(normalized(paragraph), normalized(new), (lang,key))
                self.assertEqual(len(old.xpath('.//details')), len(new.xpath('.//details')))
            for element in original.get_element_by_id('rules').xpath('./div/div'):
                self.assertIn(normalized(element), normalized(published.get_element_by_id('rules')))
            self.assertFalse(published.xpath('//style|//script[not(@src) and not(@type="application/ld+json")]'))
            self.assertEqual(len(published.xpath('//main')),1)
            self.assertEqual(len(published.xpath('//a[@href="https://wa.me/50378551720"]')),1)
            self.assertEqual(len(published.xpath('//a[@href="https://maps.app.goo.gl/yr366aJLwmnjH1g9A"]')),1)
            self.assertNotIn('All bookings run through Airbnb', normalized(published))

    def test_all_destinations_share_one_content_source(self):
        for lang, homepath, guidepath in [('en','','guide'),('es','es','es/guia')]:
            homepage=html.parse(str(ROOT/homepath/'index.html')).getroot()
            guide=html.parse(str(ROOT/guidepath/'index.html')).getroot()
            for slug in DESTINATIONS:
                home=homepage.get_element_by_id(slug)
                handbook=guide.get_element_by_id(slug)
                self.assertEqual(normalized(home), normalized(handbook))
            for card in source(lang).get_element_by_id('explore').xpath('.//div[@class="card"]'):
                for p in card.xpath('.//p'):
                    self.assertIn(normalized(p),normalized(homepage.get_element_by_id('local-discoveries')))
