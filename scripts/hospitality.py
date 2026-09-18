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
    s=f'''<section class="section faq-suite" id="faq" aria-labelledby="faq-title"><div class="faq-intro"><span class="eyebrow">06 — {T('FREQUENTLY ASKED QUESTIONS','PREGUNTAS FRECUENTES')}</span><h2 id="faq-title">{T('A little clarity.<br><em>A lot to look forward to.</em>','Todo más claro.<br><em>Mucho por disfrutar.</em>')}</h2><p>{T('From your first question to your last morning. The details, all in one place.','Desde tu primera pregunta hasta la última mañana. Los detalles, todos en un solo lugar.')}</p>{link(lang,'host',path+'#faq',label=T('Ask us something else','Haznos otra pregunta'))}<a class="text-link" href="{guide}">{T('Your complete guest guide','Tu guía completa')} →</a><div class="faq-signature"><img src="/assets/swan-mark.svg" alt="" width="48" height="48"><span>WHITE SWAN<small>{T('Thoughtfully hosted.','Cada detalle, cuidado.')}</small></span></div></div><div class="faq-library"><div class="faq-controls" hidden><label for="faq-search">{T('Find an answer','Encuentra una respuesta')}</label><div class="faq-search-field"><input id="faq-search" type="search" placeholder="{T('Try “pool”, “pets” or “check-in”','Prueba “piscina”, “mascotas” o “entrada”')}" autocomplete="off" aria-controls="faq-results"><button type="button" data-faq-clear aria-label="{T('Clear search','Borrar búsqueda')}" hidden>×</button></div><div class="faq-filters" role="group" aria-label="{T('Question topics','Temas de preguntas')}"><button type="button" data-faq-filter="all" aria-pressed="true">{T('All questions','Todas')}</button>{''.join(f'<button type="button" data-faq-filter="{key}" aria-pressed="false">{label}</button>' for key,label in groups)}</div><p class="faq-count" role="status" aria-live="polite"></p></div><div id="faq-results">'''
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
    cards=[('arrive','16:00',T('Arrive, then exhale.','Llega y respira.'),T('Self check-in, a welcome gift and the details arranged before you arrive.','Entrada autónoma, un regalo de bienvenida y los detalles coordinados antes de llegar.'),T('Arrival & directions','Llegada e indicaciones')),
           ('house','04',T('The comforts of home.','Como en casa.'),T('From Wi-Fi and streaming to the pool, beach, laundry and outdoor living. Settle in and feel at home.','Desde Wi-Fi y streaming hasta piscina, playa, lavandería y exterior. Todo para sentirte en casa.'),T('Explore the house guide','Explora la guía de la casa')),
           ('rules','22:00',T('Good neighbours. Quiet nights.','Buenos vecinos. Noches tranquilas.'),T('Quiet hours from 10 PM. Everything to know about guests, pets, parking and the community.','Silencio desde las 10 PM. Todo sobre huéspedes, mascotas, estacionamiento y la comunidad.'),T('Community essentials','Reglas de la comunidad')),
           ('checkout','12:00',T('One last slow morning.','Una última mañana sin prisa.'),T('Check-out at noon. Five simple steps; we take care of the rest. Ask us if you’d like more time.','Salida al mediodía. Cinco pasos sencillos; nosotros hacemos el resto. Consúltanos si quieres más tiempo.'),T('Departure details','Detalles de salida'))]
    s=f'''<section class="section stay-essentials" id="stay-details" aria-labelledby="essentials-title"><div class="section-heading"><div><span class="eyebrow">05 — {T('BEAUTIFULLY TAKEN CARE OF','CADA DETALLE, CUIDADO')}</span><h2 id="essentials-title">{T('Less to think about.<br><em>More time to be here.</em>','Menos preocupaciones.<br><em>Más tiempo para disfrutar.</em>')}</h2></div><p>{T('Your arrival, the everyday comforts, the little things before you leave. Everything from our guest guide, close at hand.','Tu llegada, las comodidades de cada día y los detalles antes de partir. Todo lo de nuestra guía, a tu alcance.')}</p></div><div class="essentials-grid">'''
    for key,number,title,copy,label in cards:
        s+=f'<a class="essential-card" href="{guide}#{key}"><span class="essential-number">{number}<small>{T("bedrooms","habitaciones") if key=="house" else T("local time","hora local")}</small></span><h3>{title}</h3><p>{copy}</p><span class="essential-link">{label}<span aria-hidden="true">→</span></span></a>'
    s+=f'''</div><div class="home-comforts"><span>{T('A place for the everyday, too.','También para las cosas de cada día.')}</span><div>'''
    for key,label in [('wifi','Wi-Fi'),('air-conditioning',T('Air conditioning','Aire acondicionado')),('tv',T('TV & streaming','TV y streaming')),('water',T('Drinking water','Agua potable')),('outdoors',T('BBQ & outdoor living','BBQ y exterior')),('housekeeping',T('Housekeeping','Limpieza')),('help',T('Help at the house','Ayuda en la casa'))]:
        s+=f'<a href="{guide}#house-{key}">{label} ↗</a>'
    return s+f'''</div></div><div class="essentials-foot"><a class="text-link" href="{guide}">{T('Open your complete guest guide','Abre tu guía completa')} →</a><a class="text-link" href="#faq">{T('Read the FAQs','Lee las preguntas frecuentes')} ↓</a></div></section>'''


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
