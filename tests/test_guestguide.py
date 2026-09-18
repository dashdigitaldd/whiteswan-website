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

    def test_original_faqs_are_complete_on_homepage(self):
        for lang,path in [('en','index.html'),('es','es/index.html')]:
            published=html.parse(str(ROOT/path)).getroot()
            faq=published.get_element_by_id('faq')
            for detail in source(lang).get_element_by_id('faq').xpath('./details'):
                self.assertIn(normalized(detail.find('summary')),normalized(faq))
                self.assertIn(normalized(detail.xpath('.//p')[0]),normalized(faq))
            self.assertEqual(len(faq.xpath('.//details')),18)
            self.assertTrue(published.xpath('//header//a[contains(@href,"#faq")]'))
            self.assertTrue(published.xpath('//footer//a[contains(@href,"#faq")]'))
            self.assertEqual(len(published.xpath('//*[@class="essential-card"]')),4)
            services=published.get_element_by_id('services')
            guide='/es/guia/' if lang=='es' else '/guide/'
            self.assertTrue(services.xpath('.//a[@href=$href]',href=guide+'#services'))
            for topic in ['private_chef','in_home_massage','decoration']:
                self.assertTrue(services.xpath('.//a[@data-topic=$topic and starts-with(@href,"https://wa.me/")]',topic=topic))

    def test_operational_details_and_all_chapters_survive(self):
        for lang,path in [('en','guide/index.html'),('es','es/guia/index.html')]:
            published=html.parse(str(ROOT/path)).getroot()
            original=source(lang)
            # Beyond paragraph coverage: prices, lead times, all rules and checkout steps.
            for key in ['arrive','services','villa','house','rules','checkout','explore','faq']:
                old=original.get_element_by_id(key)
                new=published.get_element_by_id(key)
                for item in old.xpath('.//h3|.//summary|.//div[@class="price"]|.//div[contains(@class,"notice")]|.//li[not(.//a)]'):
                    self.assertIn(normalized(item),normalized(new),(lang,key))
            for key in ['book','contact']:
                self.assertIsNotNone(published.get_element_by_id(key))
            self.assertIn('airbnb.com/inbox',str(html.tostring(published.get_element_by_id('contact'))))

    def test_homepage_anchors_and_ids_are_valid(self):
        for path in ['index.html','es/index.html','guide/index.html','es/guia/index.html']:
            published=html.parse(str(ROOT/path)).getroot()
            ids=published.xpath('//@id')
            self.assertEqual(len(ids),len(set(ids)),path)
            for href in published.xpath('//a[starts-with(@href,"#")]/@href'):
                self.assertIn(href[1:],ids,(path,href))
