"""Guest-facing details shared with the retained bilingual handbook content."""
from html import escape
from guestguide import source, prepare, serialize
from concierge import link

HOUSE_TOPICS = ['pool', 'beach', 'air-conditioning', 'wifi', 'laundry', 'tv', 'water', 'outdoors', 'housekeeping', 'help']


def faqs(lang):
    """Retain every original FAQ; add practical planning questions from the guide."""
    T = lambda en, es: es if lang == 'es' else en
    doc = source(lang)
    old = doc.get_element_by_id('faq').xpath('./details')
    row = lambda el: (el.find('summary').text_content().strip(), el.xpath('.//p')[0].text_content().strip())
    original = [row(el) for el in old]
    rule = lambda n: doc.get_element_by_id('rules').xpath('./div/div')[n].text_content().strip()
    house = lambda n: doc.get_element_by_id('house').xpath('./details')[n].xpath('.//p')[0].text_content().strip()
    return [
        ('booking','booking',T('How do I book my stay?','¿Cómo reservo mi estadía?'),T('Choose your preferred dates and group size in Plan your stay, then send your request to our host on WhatsApp. Your host confirms availability, the full price and terms before you commit. Choosing dates does not reserve them.','Elige tus fechas y el tamaño del grupo en Planea tu estadía y envía tu solicitud al anfitrión por WhatsApp. Confirmamos disponibilidad, precio total y condiciones antes de reservar. Elegir fechas no las bloquea.')),
        ('pricing','booking',*original[1]),
        ('capacity','booking',*original[4]),
        ('visitors','booking',*original[5]),
        ('pets','booking',T('Can we bring a pet?','¿Podemos llevar mascota?'),rule(5)),
        ('parking','booking',T('Is parking included?','¿Incluye estacionamiento?'),rule(6)),
        ('arrival-times','arrival',T('When are check-in and check-out?','¿A qué hora son la entrada y la salida?'),T('Self check-in is from 4:00 PM. Check-out is at 12 PM. Your host coordinates guest registration before arrival and shares private access instructions through Airbnb three days before your stay.','La entrada autónoma es desde las 4:00 PM y la salida a las 12 PM. Tu anfitrión coordina el registro antes de la llegada y comparte las instrucciones privadas por Airbnb tres días antes de tu estadía.')),
        ('arrival-code','arrival',*original[0]),
        ('early-arrival','arrival',T('Can we arrive earlier?','¿Podemos llegar antes?'),doc.get_element_by_id('arrive').xpath('.//div[@class="split"]//p')[0].text_content().strip()),
        ('late-departure','arrival',T('Can we stay past noon?','¿Podemos quedarnos después del mediodía?'),T('Late check-out is $50 per extra hour when there is no same-day arrival. Request it in advance; your host confirms availability and the agreed time in writing.','La salida tardía cuesta $50 por hora extra cuando no hay llegada ese día. Solicítala con anticipación; tu anfitrión confirma por escrito disponibilidad y hora acordada.')),
        ('transport','arrival',*original[3]),
        ('private-pool','villa',T('Is the pool just for us?','¿La piscina es solo para nosotros?'),T('Yes. The villa and its infinity pool are private for your group. You also have access to the community pool near the beach.','Sí. La villa y su piscina infinita son privadas para tu grupo. También tienes acceso a la piscina comunitaria cerca de la playa.')),
        ('heated-pool','villa',*original[2]),
        ('beach','villa',T('How do we get to the beach?','¿Cómo llegamos a la playa?'),house(1)),
        ('occasions','villa',T('Can you help plan something special?','¿Pueden ayudarnos a planear algo especial?'),T('We can coordinate a chef, massages, groceries, transfers and celebration details. We confirm supplier availability and your quote before any service is booked. Quiet hours begin at 10 PM; parties and loud music are not permitted.','Podemos coordinar chef, masajes, compras, traslados y detalles para celebraciones. Confirmamos disponibilidad y cotización antes de reservar. El horario de silencio empieza a las 10 PM; no se permiten fiestas ni música alta.')),
        ('housekeeping','villa',T('Is housekeeping included?','¿Incluye limpieza?'),house(8)),
        ('laundry','villa',T('Can we use the laundry room?','¿Podemos usar la lavandería?'),house(4)),
        ('children','villa',T('Is a crib available?','¿Hay cuna disponible?'),T('A crib can be ready on arrival if requested ahead. Let your host know when planning your stay.','La cuna puede estar lista a tu llegada si la solicitas con anticipación. Avísale al anfitrión al planear tu estadía.')),
    ]


def faq_section(lang):
    T = lambda en, es: es if lang == 'es' else en
    path='/es/' if lang=='es' else '/'
    guide='/es/guia/' if lang=='es' else '/guide/'
    groups=[('booking',T('Planning your stay','Planea tu estadía')),('arrival',T('Arriving & leaving','Llegada y salida')),('villa',T('Life at the villa','La vida en la villa'))]
    s=f'''<section class="section faq-suite" id="faq" aria-labelledby="faq-title"><div class="faq-intro"><span class="eyebrow">05 — {T('YOUR STAY, SIMPLIFIED','TU ESTADÍA, SIN COMPLICACIONES')}</span><h2 id="faq-title">{T('A little clarity.<br><em>A lot to look forward to.</em>','Todo más claro.<br><em>Mucho por disfrutar.</em>')}</h2><p>{T('From your first question to your last morning. The details, all in one place.','Desde tu primera pregunta hasta la última mañana. Los detalles, todos en un solo lugar.')}</p>{link(lang,'host',path+'#faq',label=T('Ask us something else','Haznos otra pregunta'))}<a class="text-link" href="{guide}">{T('Your complete guest guide','Tu guía completa')} →</a>{stay_details(lang)}</div><div class="faq-library"><div class="faq-controls" hidden><label for="faq-search">{T('Find an answer','Encuentra una respuesta')}</label><div class="faq-search-field"><input id="faq-search" type="search" placeholder="{T('Try “pool”, “pets” or “check-in”','Prueba “piscina”, “mascotas” o “entrada”')}" autocomplete="off" aria-controls="faq-results"><button type="button" data-faq-clear aria-label="{T('Clear search','Borrar búsqueda')}" hidden>×</button></div><div class="faq-filters" role="group" aria-label="{T('Question topics','Temas de preguntas')}"><button type="button" data-faq-filter="all" aria-pressed="true">{T('All questions','Todas')}</button>{''.join(f'<button type="button" data-faq-filter="{key}" aria-pressed="false">{label}</button>' for key,label in groups)}</div><p class="faq-count" role="status" aria-live="polite"></p></div><div id="faq-results">'''
    for group,label in groups:
        s+=f'<div class="faq-group" data-faq-group="{group}"><h3>{label}</h3>'
        for key,category,q,a in faqs(lang):
            if category!=group:continue
            s+=f'<details id="question-{key}" data-faq-item data-faq-category="{group}"><summary><span>{escape(q)}</span><i aria-hidden="true">+</i></summary><div class="faq-answer"><p>{escape(a)}</p></div></details>'
        s+='</div>'
    return s+f'''</div><div class="faq-empty" hidden><h3>{T('Let’s find out together.','Lo resolvemos contigo.')}</h3><p>{T('No matching question yet. Try another word or ask your host.','No encontramos esa pregunta. Prueba otra palabra o consulta a tu anfitrión.')}</p>{link(lang,'host',path+'#faq',label=T('Ask your host','Consulta a tu anfitrión'))}</div></div></section>'''


def stay_details(lang):
    T=lambda en,es:es if lang=='es' else en
    guide='/es/guia/' if lang=='es' else '/guide/'
    items = [
        ('arrive', T('Check-in', 'Entrada'), '16:00', T('Arrival & directions', 'Llegada e indicaciones')),
        ('checkout', T('Check-out', 'Salida'), '12:00', T('Departure details', 'Detalles de salida')),
        ('rules', T('Quiet hours from', 'Silencio desde'), '22:00', T('House & community rules', 'Reglas de la casa y comunidad')),
        ('house', T('At the villa', 'En la villa'), T('Your guide', 'Tu guía'), T('Wi-Fi, pool & everyday comforts', 'Wi-Fi, piscina y comodidades')),
    ]
    s=f'<div class="stay-at-a-glance" id="stay-details" aria-label="{T("Your stay essentials","Lo esencial de tu estadía")}">'
    for key,label,value,description in items:
        s+=f'<a class="essential-card" href="{guide}#{key}"><span><small>{label}</small><strong>{value}</strong></span><span>{description}<i aria-hidden="true">↗</i></span></a>'
    return s+'</div>'


def service_detail(lang,topic):
    T=lambda en,es:es if lang=='es' else en
    index={'private_chef':0,'in_home_massage':1,'decoration':4}[topic]
    card=prepare(source(lang).get_element_by_id('services').xpath('./div[contains(@class,"grid")]/div')[index],lang)
    pieces=card.xpath('.//div[@class="price"]|.//div[@class="notice"]')
    return f'<details class="service-detail"><summary>{T("The details & planning ahead","Los detalles y cómo planear")}<span aria-hidden="true">+</span></summary><div>'+''.join(serialize(el) for el in pieces)+'</div></details>'


def extra_details(lang):
    """Keep the less prominent original services discoverable from the homepage."""
    T=lambda en,es:es if lang=='es' else en
    guide='/es/guia/' if lang=='es' else '/guide/'
    source_card=source(lang).get_element_by_id('services').xpath('./div[@class="card"]')[0]
    p=prepare(source_card,lang).find('.//p')
    # Each item in the source uses a centred dot. Keep its exact factual text.
    text=p.text_content().strip()
    for icon in ['🚗','👥','🧺','👶']:text=text.replace(icon,'')
    items=[item.strip() for item in text.split('·')]
    return f'''<details class="thoughtful-extras"><summary><span>{T('A few more thoughtful extras','Otros detalles para tu estadía')}<small>{T('Car rental · Extra guests · Housekeeping · A crib for little ones','Renta de auto · Huéspedes extra · Limpieza · Cuna')}</small></span><i aria-hidden="true">+</i></summary><div class="extras-content">{''.join(f'<p>{escape(item)}</p>' for item in items)}<a class="text-link" href="{guide}#services">{T('All services, prices & planning details','Todos los servicios, precios y detalles')} →</a></div></details>'''
