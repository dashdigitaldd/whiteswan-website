"""Public conversation entry points. No model, credentials or private knowledge here."""
from html import escape
from urllib.parse import urlencode

# Topic is visitor-supplied intent, never authorization or proof of a booking.
TOPICS = {
 'villa': ('The villa & amenities','La villa y sus comodidades','I have a question about the villa, its spaces or amenities.','Tengo una pregunta sobre la villa, sus espacios o comodidades.','other'),
 'arrival': ('Arrival & getting here','Llegada y cómo llegar','I would like information about getting to White Swan and general arrival arrangements.','Quisiera información sobre cómo llegar a White Swan y la llegada en general.','other'),
 'policies': ('House rules & practical details','Reglas y detalles prácticos','I have a question about house rules or practical details for my stay.','Tengo una pregunta sobre las reglas de la casa o detalles prácticos de mi estadía.','other'),
 'stay': ('Planning a stay','Planear una estadía','I would like help planning a stay at White Swan.','Quisiera ayuda para planear una estadía en White Swan.','stay'),
 'private_chef': ('Private chef','Chef privado','I am interested in a private chef during my stay.','Me interesa un chef privado durante mi estadía.','private_chef'),
 'in_home_massage': ('In-villa massage','Masaje en la villa','I am interested in arranging a massage at the villa.','Me interesa coordinar un masaje en la villa.','in_home_massage'),
 'grocery_shopping': ('Groceries before arrival','Compras antes de llegar','I would like to ask about grocery shopping before arrival.','Quisiera consultar sobre compras de supermercado antes de llegar.','grocery_shopping'),
 'drinks_delivery': ('Drinks & refreshments','Bebidas y refrescos','I would like to ask about drinks and refreshment delivery.','Quisiera consultar sobre entrega de bebidas y refrescos.','drinks_delivery'),
 'airport_transfer': ('Airport transfers','Traslados del aeropuerto','I would like to ask about an airport transfer.','Quisiera consultar sobre un traslado del aeropuerto.','airport_transfer'),
 'guided_tours': ('Explore the coast','Explorar la costa','I would like recommendations for local activities and tours.','Quisiera recomendaciones de actividades y paseos locales.','guided_tours'),
 'decoration': ('A special occasion','Una ocasión especial','I would like help arranging a celebration at White Swan.','Quisiera ayuda para organizar una celebración en White Swan.','decoration'),
 'host': ('Speak with the host','Hablar con el anfitrión','I would like to speak with the White Swan host.','Quisiera hablar con el anfitrión de White Swan.','other'),
}

def whatsapp(lang,topic,path):
    row=TOPICS[topic];es=lang=='es'
    assert path.startswith('/') and not path.startswith('//') and '?' not in path
    message=('¡Hola White Swan! ' if es else 'Hello White Swan! ')+row[3 if es else 2]
    message+='\n'+('Estoy viendo: ' if es else 'I’m looking at: ')+'https://staywhiteswan.com'+path
    message+='\n'+('Prefiero conversar en español.' if es else 'I’d prefer to chat in English.')
    return 'https://wa.me/50370528003?'+urlencode({'text':message})

def link(lang,topic,path,placement='service',label=None,classes='text-link'):
    label=label or TOPICS[topic][lang=='es']
    return f'<a class="{classes}" href="{escape(whatsapp(lang,topic,path),quote=True)}" target="_blank" rel="noopener" data-topic="{topic}" data-service="{TOPICS[topic][4]}" data-placement="{placement}">{escape(label)} <span aria-hidden="true">↗</span></a>'

def section(lang):
    T=lambda en,es:es if lang=='es' else en
    path=('/es/' if lang=='es' else '/')+'#concierge'
    groups=[('villa','arrival','policies','host'),('private_chef','in_home_massage','grocery_shopping','drinks_delivery','airport_transfer','guided_tours','decoration')]
    s=f'''<section class="section conversation-section" id="concierge" aria-labelledby="concierge-title"><div><span id="contact" class="anchor-target" aria-hidden="true"></span><span class="eyebrow">{T('A CONVERSATION AWAY','A UN MENSAJE DE DISTANCIA')}</span><h2 id="concierge-title">{T('Before you arrive.<br><em>While you unwind.</em>','Antes de llegar.<br><em>Mientras descansas.</em>')}</h2><p>{T('Wondering about the villa? Dreaming of a dinner by the pool? Ask White Swan on WhatsApp — for the little questions and the thoughtful extras.','¿Tienes una pregunta sobre la villa? ¿Imaginas una cena junto a la piscina? Escríbenos por WhatsApp para resolver tus dudas y coordinar esos detalles especiales.')}</p><p class="conversation-note">{T('Choose a topic to start. Your message opens in WhatsApp, ready for you to send.','Elige un tema para empezar. Tu mensaje se abre en WhatsApp, listo para que lo envíes.')}</p></div><div class="conversation-topics">'''
    for i,topics in enumerate(groups):
        s+=f'<div><h3>{T("A little local knowledge" if i==0 else "Something just for you","Lo que quieres saber" if i==0 else "Algo especial para ti")}</h3>'
        for topic in topics:s+=link(lang,topic,path,placement='service',classes='concierge-topic')
        s+='</div>'
    return s+f'''<p class="fine">{T('Services, prices and availability are confirmed with you before anything is booked.','Los servicios, precios y disponibilidad se confirman contigo antes de reservar.')}</p></div></section>'''

def widget(lang,path):
    T=lambda en,es:es if lang=='es' else en
    topics=['villa','stay','host','private_chef','in_home_massage','grocery_shopping','drinks_delivery','airport_transfer','arrival','policies','guided_tours','decoration']
    return f'''<details class="concierge-launcher"><summary aria-label="{T('Ask White Swan on WhatsApp','Pregunta a White Swan por WhatsApp')}"><span class="chat-symbol" aria-hidden="true">✧</span><span>{T('Ask White Swan','Pregunta a White Swan')}<small>WhatsApp</small></span><span class="concierge-toggle" aria-hidden="true">+</span></summary><div class="concierge-panel"><span class="eyebrow">WHITE SWAN CONCIERGE</span><h2>{T('What’s on your mind?','¿En qué te ayudamos?')}</h2><p>{T('Villa questions, local tips or a little something extra. Choose a topic to continue on WhatsApp.','Preguntas sobre la villa, consejos locales o algo especial. Elige un tema para continuar por WhatsApp.')}</p><nav aria-label="{T('WhatsApp enquiry topics','Temas de consulta por WhatsApp')}">{''.join(link(lang,topic,path,'other',classes='concierge-topic') for topic in topics)}</nav><p class="fine">{T('You send the message. You can ask for the host at any time.','Tú envías el mensaje. Puedes pedir hablar con el anfitrión en cualquier momento.')}</p></div></details>'''
