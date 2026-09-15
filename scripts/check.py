from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import subprocess,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
pages=['index.html','es/index.html','guide/index.html','es/guia/index.html','privacy/index.html','es/privacidad/index.html']
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
for file in ['assets/site.js','assets/config.js']:subprocess.run(['node','--check',str(root/file)],check=True)
print('Six localized pages, local assets, metadata, sitemap, CNAME and JavaScript checks passed.')
