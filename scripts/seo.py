"""Public search metadata and verified property facts; no private provider data."""
from html import escape
import json
from pathlib import Path
from photography import registry, listing_key, GALLERY_ORDER
ROOT=Path(__file__).resolve().parents[1]
BASE='https://staywhiteswan.com'
PAGES={
 'home': {'en':'/','es':'/es/','label':('The villa','La villa'),'updated':'2026-09-18',
  'title':('White Swan | Ocean-View Villa in Xanadu, El Salvador','Casa de playa en Xanadu, El Salvador | White Swan'),
  'description':('Stay at White Swan, a private four-bedroom villa in Xanadu, El Salvador, with an infinity pool and Pacific views. Explore the house and plan your stay.','White Swan, tu casa de playa privada en Xanadu, El Salvador: cuatro habitaciones, piscina infinita y vista al Pacífico. Conoce la casa y planea tu estadía.')},
 'gallery': {'en':'/photos/','es':'/es/fotos/','label':('Villa photos','Fotos de la villa'),'updated':'2026-09-18',
  'title':('White Swan Villa Photos | Pool, Bedrooms & Ocean Views','Fotos de White Swan | Piscina, habitaciones y vista al mar'),
  'description':('Explore 35 photos of White Swan Villa in Xanadu, El Salvador: four bedrooms, a private infinity pool, kitchen, terrace and Pacific Ocean views.','Explora 35 fotos de White Swan en Xanadu, El Salvador: cuatro habitaciones, piscina infinita privada, cocina, terraza y vistas al océano Pacífico.')},
 'stay': {'en':'/stay/','es':'/es/reservar/','label':('Plan your stay','Planea tu estadía'),'updated':'2026-09-18',
  'title':('Plan Your Stay at White Swan Villa | Xanadu, El Salvador','Planea tu estadía en White Swan | Xanadu, El Salvador'),
  'description':('Plan a private villa stay at White Swan in Xanadu. Share your dates and group size on WhatsApp; your host confirms availability, price and booking terms.','Planea tu estadía en White Swan, Xanadu. Comparte fechas y número de huéspedes por WhatsApp; el anfitrión confirma disponibilidad, precio y condiciones.')},
 'guide': {'en':'/guide/','es':'/es/guia/','label':('Guest guide','Guía del huésped'),'updated':'2026-09-18',
  'title':('White Swan Guest Guide | Villa Services & Surf City','Guía de White Swan | Servicios de la villa y Surf City'),
  'description':('Your White Swan guest guide: arrival, villa amenities, private chef, massages, house rules and places to explore near Xanadu on El Salvador’s coast.','Tu guía de White Swan: llegada, comodidades, chef privado, masajes, reglas de la casa y lugares para descubrir cerca de Xanadu, en la costa salvadoreña.')},
 'privacy': {'en':'/privacy/','es':'/es/privacidad/','label':('Privacy','Privacidad'),'updated':'2026-09-18',
  'title':('Privacy & Cookies | White Swan Villa','Privacidad y cookies | White Swan'),
  'description':('How White Swan handles guest enquiries, contact details, optional analytics and privacy requests.','Cómo White Swan gestiona consultas, datos de contacto, analítica opcional y solicitudes de privacidad.'),'index':False},
}

def metadata(lang,path,kind):
    page=PAGES[kind]
    assert page[lang]==path,(kind,path)
    n=lang=='es'
    return page['title'][n],page['description'][n]

def breadcrumbs(lang,kind):
    if kind=='home':return ''
    home=PAGES['home'][lang];label=PAGES[kind]['label'][lang=='es']
    return f'<nav class="page-breadcrumbs" aria-label="{"Ruta de navegación" if lang=="es" else "Breadcrumb"}"><a href="{home}">White Swan</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>'

def structured_data(lang,path,title,description,kind):
    url=BASE+path;home=BASE+PAGES['home'][lang]; assets=registry();n=lang=='es'
    image=assets[listing_key(29)]
    primary={'@type':'ImageObject','@id':url+'#primaryimage','url':BASE+image['full'],'contentUrl':BASE+image['full'],'width':image['width'],'height':image['height'],'caption':('White Swan Villa and its private pool in Xanadu, El Salvador','White Swan y su piscina privada en Xanadu, El Salvador')[n]}
    business={'@type':'LodgingBusiness','@id':BASE+'/#villa','name':'White Swan Villa','alternateName':'White Swan','url':BASE+'/',
      'description':('Private four-bedroom ocean-view villa with an infinity pool in Xanadu, Tamanique, El Salvador.','Villa privada de cuatro habitaciones con vista al mar y piscina infinita en Xanadu, Tamanique, El Salvador.')[n],
      'telephone':'+50370528003','address':{'@type':'PostalAddress','addressLocality':'Tamanique','addressRegion':'La Libertad','addressCountry':'SV'},
      'containedInPlace':{'@type':'Place','name':'Xanadu, El Salvador'},'checkinTime':'16:00','checkoutTime':'12:00',
      'image':[BASE+assets[listing_key(i)]['full'] for i in [29,28,32,9,3,27]],'sameAs':['https://www.airbnb.com/rooms/47911834'],
      'knowsLanguage':['en','es'], 'containsPlace':{'@type':'Accommodation','name':'White Swan Villa','numberOfBedrooms':4,'numberOfBathroomsTotal':3.5},
      'amenityFeature':[{'@type':'LocationFeatureSpecification','name':en if lang=='en' else es,'value':True} for en,es in [('Private infinity pool','Piscina infinita privada'),('Ocean view','Vista al mar'),('Equipped kitchen','Cocina equipada'),('Wi-Fi','Wi-Fi'),('Air conditioning','Aire acondicionado')]]}
    website={'@type':'WebSite','@id':BASE+'/#website','url':BASE+'/','name':'White Swan','alternateName':'White Swan Villa','inLanguage':['en','es'],'publisher':{'@id':BASE+'/#villa'}}
    webpage={'@type':'ImageGallery' if kind=='gallery' else 'WebPage','@id':url+'#webpage','url':url,'name':title,'description':description,'inLanguage':lang,'isPartOf':{'@id':BASE+'/#website'},'about':{'@id':BASE+'/#villa'},'primaryImageOfPage':{'@id':url+'#primaryimage'},'dateModified':PAGES[kind]['updated']}
    graph=[website,business,primary,webpage]
    if kind!='home':
        graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'White Swan','item':home},{'@type':'ListItem','position':2,'name':PAGES[kind]['label'][n],'item':url}]})
        webpage['breadcrumb']={'@id':url+'#breadcrumb'}
    if kind=='gallery':
        from photography import PHOTOS
        webpage['associatedMedia']=[{'@type':'ImageObject','contentUrl':BASE+assets[listing_key(i)]['full'],'caption':PHOTOS[i]['alt'][lang]} for i in GALLERY_ORDER]
    return json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')

def extra_meta(lang,path,title,description,kind):
    image=BASE+'/assets/editorial/villa-light-1536.webp';alt=('White Swan villa and infinity pool in Xanadu, El Salvador','Villa White Swan y piscina infinita en Xanadu, El Salvador')[lang=='es']
    robots='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' if PAGES[kind].get('index',True) else 'noindex,follow'
    s=f'<meta name="robots" content="{robots}"><meta property="og:site_name" content="White Swan"><meta property="og:locale" content="{"es_SV" if lang=="es" else "en_US"}"><meta property="og:locale:alternate" content="{"en_US" if lang=="es" else "es_SV"}"><meta property="og:image:type" content="image/webp"><meta property="og:image:width" content="1536"><meta property="og:image:height" content="1024"><meta property="og:image:alt" content="{alt}"><meta name="twitter:title" content="{escape(title)}"><meta name="twitter:description" content="{escape(description)}"><meta name="twitter:image" content="{image}"><meta name="twitter:image:alt" content="{alt}">'
    verification=json.loads((ROOT/'content/search-verification.json').read_text())
    import re
    for key in ['google-site-verification','msvalidate.01']:
        value=verification.get(key,'')
        if value:
            assert re.fullmatch(r'[A-Za-z0-9_-]+',value),'Invalid public site-verification token'
            s+=f'<meta name="{key}" content="{value}">'
    if kind=='home':
        s+='<link rel="preload" as="image" type="image/avif" href="/assets/editorial/villa-light-960.avif" imagesrcset="/assets/editorial/villa-light-640.avif 640w, /assets/editorial/villa-light-960.avif 960w, /assets/editorial/villa-light-1536.avif 1536w" imagesizes="(max-width: 700px) 100vw, 65vw" fetchpriority="high">'
    return s

def build_discovery():
    from lxml import html
    from xml.etree.ElementTree import Element,SubElement,ElementTree,register_namespace,indent
    ns='http://www.sitemaps.org/schemas/sitemap/0.9';im='http://www.google.com/schemas/sitemap-image/1.1'
    register_namespace('',ns);register_namespace('image',im)
    tree=Element('{'+ns+'}urlset');assets=registry();lookup={a['src']:a['full'] for a in assets.values()}
    for kind,config in PAGES.items():
        if not config.get('index',True):continue
        for lang in ['en','es']:
            path=config[lang];url=SubElement(tree,'{'+ns+'}url');SubElement(url,'{'+ns+'}loc').text=BASE+path;SubElement(url,'{'+ns+'}lastmod').text=config['updated']
            doc=html.parse(str(ROOT/path.strip('/')/'index.html'))
            urls=[]
            for src in doc.xpath('//main//img/@src'):
                full=lookup.get(src)
                if full and full not in urls:urls.append(full)
            for full in urls:SubElement(SubElement(url,'{'+im+'}image'),'{'+im+'}loc').text=BASE+full
    indent(tree,space='  ');ElementTree(tree).write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n'+''.join('Disallow: '+p+'\n' for p in ['/content/','/scripts/','/tests/','/docs/','/artifacts/'])+'Sitemap: '+BASE+'/sitemap.xml\n')


def build_not_found():
    (ROOT/'404.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | White Swan</title><meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/assets/site.min.css"><link rel="icon" href="/assets/favicon.svg"></head><body class="editorial"><main class="section"><span class="eyebrow">WHITE SWAN · 404</span><h1>Let’s get you back<br>to the villa.</h1><p>This page may have moved. Your next stay is still waiting.</p><div class="actions"><a class="button" href="/">White Swan home →</a><a class="text-link" href="/stay/">Plan your stay →</a></div><hr><div lang="es"><h2>Volvamos a la villa.</h2><p>Esta página no está disponible. Continúa explorando White Swan.</p><a class="text-link" href="/es/">Ver White Swan en español →</a></div></main></body></html>\n''')
