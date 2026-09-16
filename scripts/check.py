from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import subprocess,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
pages=['stay/index.html','es/reservar/index.html','index.html','es/index.html','guide/index.html','es/guia/index.html','privacy/index.html','es/privacidad/index.html','photos/index.html','es/fotos/index.html']
class Page(HTMLParser):
 def __init__(self):super().__init__();self.tags=[]
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
for file in pages:
 p=Page();p.feed((root/file).read_text())
 assert sum(t=='h1' for t,a in p.tags)==1,file+' needs one h1'
 assert next(a['lang'] for t,a in p.tags if t=='html')==('es' if file.startswith('es/') else 'en')
 canonical=[a['href'] for t,a in p.tags if t=='link' and a.get('rel')=='canonical'];assert len(canonical)==1
 assert len([a for t,a in p.tags if t=='link' and a.get('hreflang')])==3
 for tag,a in p.tags:
  for key in ['src','href']:
   value=a.get(key,'');u=urlsplit(value)
   if u.scheme or u.netloc or not u.path:continue
   target=root/u.path.lstrip('/') if u.path.startswith('/') else (root/file).parent/u.path
   if u.path.endswith('/'):target=target/'index.html'
   assert target.exists(),(file,value)
  if tag=='img':assert a.get('alt') is not None and a.get('width') and a.get('height'),(file,a)
  if tag=='a' and a.get('target')=='_blank':assert 'noopener' in a.get('rel',''),(file,a)
 assert 'googletagmanager.com' not in (root/file).read_text()
assert (root/'CNAME').read_text().strip()=='staywhiteswan.com'
ET.parse(root/'sitemap.xml')
for file in ['assets/site.js','assets/config.js','assets/gallery.js','assets/booking.js']:subprocess.run(['node','--check',str(root/file)],check=True)
print('Ten localized pages, local assets, metadata, sitemap, CNAME and JavaScript checks passed.')

# Published testimonials contain only explicitly selected public review fields.
import json
reviews=json.loads((root/'content/guest-reviews.json').read_text())
for lang,rows in reviews['reviews'].items():
 assert lang in ['en','es'] and len(rows)==3
 for r in rows:
  assert set(r)=={'source_id','platform','rating','date','text'}
  assert r['platform']=='airbnb' and r['rating']==5 and len(r['text'])>20
for file in ['index.html','es/index.html','photos/index.html','es/fotos/index.html']:
 p=Page();p.feed((root/file).read_text())
 for tag,a in p.tags:
  if a.get('data-placement') in ['hero','navigation','sticky','facts']:
   assert a.get('href')==('/es/reservar/' if file.startswith('es/') else '/stay/'),(file,a)
print('Curated public review fields and on-site booking entry points passed.')
