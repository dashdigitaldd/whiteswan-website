"""Shipping contracts for the local, deferred public-home film."""
import json
import struct
import unittest
from pathlib import Path
from lxml import html

ROOT=Path(__file__).resolve().parents[1]

class VillaFilmContracts(unittest.TestCase):
    def test_movie_sources_budget_and_fast_start(self):
        film=json.loads((ROOT/'content/villa-film.json').read_text())
        registry=json.loads((ROOT/'content/editorial-assets.json').read_text())['assets']
        allowed={v['url'] for a in registry.values() for v in a['variants']}
        self.assertTrue(set(film['sources']).issubset(allowed))
        self.assertFalse(film['audio'])
        for kind,variant in film['variants'].items():
            data=(ROOT/variant['url'].lstrip('/')).read_bytes()
            self.assertEqual(len(data),variant['bytes'])
            self.assertLess(len(data),(5 if kind=='desktop' else 2)*1024*1024)
            # The browser receives metadata before video samples and can start early.
            boxes=[];offset=0
            while offset+8<=len(data):
                length,typ=struct.unpack('>I4s',data[offset:offset+8])
                if length==1:length=struct.unpack('>Q',data[offset+8:offset+16])[0]
                if not length:break
                boxes.append(typ);offset+=length
            self.assertLess(boxes.index(b'moov'),boxes.index(b'mdat'))

    def test_home_only_deferred_media_and_localized_controls(self):
        for path in ['index.html','es/index.html']:
            doc=html.parse(str(ROOT/path));video=doc.xpath('//video')[0]
            self.assertEqual(video.get('preload'),'none')
            self.assertIsNone(video.get('src'))
            self.assertIsNone(video.get('autoplay'))
            self.assertIsNone(video.get('loop'))
            self.assertIsNotNone(video.get('playsinline'))
            self.assertIsNotNone(video.get('muted'))
            self.assertEqual(len(doc.xpath('//*[@data-film-chapter and @aria-label]')),5)
            self.assertTrue(doc.xpath('//*[@data-hero-frame="day"]//img[@fetchpriority="high"]'))
            self.assertTrue(doc.xpath('//*[@data-hero-frame="night"]//img'))
            self.assertEqual(len(doc.xpath('//*[@data-film-photo]')),2)
            for name in ['data-desktop','data-mobile']:
                self.assertTrue((ROOT/video.get(name).lstrip('/')).exists())
        for path in ['stay/index.html','es/reservar/index.html','photos/index.html','guest/index.html']:
            doc=html.parse(str(ROOT/path));self.assertFalse(doc.xpath('//video[@class="villa-film-video"]'))
