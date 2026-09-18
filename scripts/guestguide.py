"""The complete guest handbook, rendered inside the shared White Swan experience.

The bilingual template is a content source only: its old shell, CSS and scripts
are never published. Destination cards also render directly on the homepage.
"""
from pathlib import Path
from lxml import html
from photography import legacy_image, photo
from concierge import link, widget

ROOT = Path(__file__).resolve().parents[1]
DESTINATIONS = ['el-tunco', 'el-zonte', 'la-libertad', 'restaurants', 'waterfalls', 'coatepeque']
TOPICS = ['private_chef', 'in_home_massage', 'airport_transfer', 'guided_tours', 'decoration', 'arrival']


def source(lang):
    doc = html.fromstring((ROOT / 'content/guide.html.template').read_text())
    opposite = 'en' if lang == 'es' else 'es'
    for el in doc.xpath(f'//*[contains(concat(" ",normalize-space(@class)," ")," {opposite} ")]'):
        el.drop_tree()
    return doc


def prepare(el, lang):
    for node in el.iter():
        if not isinstance(node.tag, str):
            continue
        for attr in list(node.attrib):
            if attr == 'style' or attr.startswith('on'):
                del node.attrib[attr]
        classes = set(node.get('class', '').split()) - {'en', 'es', 'reveal', 'in'}
        if classes:
            node.set('class', ' '.join(sorted(classes)))
        elif 'class' in node.attrib:
            del node.attrib['class']
    for img in el.xpath('.//img'):
        replacement = html.fragment_fromstring(legacy_image(Path(img.get('src')).stem, img.get('alt', ''), lang=lang))
        img.getparent().replace(img, replacement)
    for a in el.xpath('.//a'):
        if a.get('target') == '_blank':
            a.set('rel', 'noopener')
        if 'btn' in a.get('class', '').split():
            a.set('class', 'button outline')
        if 'tlink' in a.get('class', '').split():
            a.set('class', 'text-link')
        if 'wa.me/' in a.get('href', ''):
            a.set('data-placement', 'guide')
    return el


def serialize(el):
    return html.tostring(el, encoding='unicode', with_tail=False)


def destinations(lang, path, embedded=False):
    T = lambda en, es: es if lang == 'es' else en
    el = prepare(source(lang).get_element_by_id('explore'), lang)
    el.set('class', 'section destination-section' if embedded else 'handbook-section destination-section')
    el.set('id', 'local-discoveries' if embedded else 'explore')
    el.find('h2').set('id', 'coast-heading' if embedded else 'explore-heading')
    el.set('aria-labelledby', el.find('h2').get('id'))
    intro = el.find('p')
    intro.text = T('Salt-air mornings, little coastal towns and a day out in the hills. A few places to make your own.', 'Mañanas de brisa marina, pueblos costeros y un día entre montañas. Lugares para descubrir a tu ritmo.')
    if embedded:
        el.find('span').text = T('PLACES TO DISCOVER', 'LUGARES POR DESCUBRIR')
        for child in list(el.find('span')): el.find('span').remove(child)
    grid = el.xpath('./div')[0]
    grid.set('class', 'destination-grid')
    for slug, card in zip(DESTINATIONS, grid):
        card.tag = 'article'
        card.set('class', 'destination-card')
        card.set('id', slug)
        heading = card.find('.//h3').text_content()
        cta = html.fragment_fromstring(link(lang, 'guided_tours', path + '#' + slug, placement='guide', label=T('Plan a visit', 'Planea una visita')))
        # Keep the destination in the message so the concierge knows the guest's interest.
        from urllib.parse import urlsplit, parse_qs, urlencode
        query = parse_qs(urlsplit(cta.get('href')).query)
        query['text'][0] += '\n' + T('I’m interested in: ', 'Me interesa: ') + heading
        cta.set('href', 'https://wa.me/50370528003?' + urlencode({'text': query['text'][0]}))
        card.xpath('./div')[1].append(cta)
    note = html.Element('p', attrib={'class': 'fine destination-note'})
    note.text = T('Driving times and activity prices are approximate. Ask your concierge about current arrangements before heading out.', 'Los tiempos de viaje y precios de actividades son aproximados. Consulta los detalles actuales con tu concierge antes de salir.')
    el.append(note)
    return serialize(el)


def guide(lang, head, components):
    from homepage import navigation, footer, booking_path
    T = lambda en, es: es if lang == 'es' else en
    path = '/es/guia/' if lang == 'es' else '/guide/'
    other = '/guide/' if lang == 'es' else '/es/guia/'
    doc = source(lang)
    chapters = [('arrive', T('Arriving', 'Tu llegada')), ('services', T('Little luxuries', 'Pequeños lujos')), ('villa', T('The spaces', 'Los espacios')), ('house', T('At the villa', 'En la villa')), ('rules', T('Good to know', 'Lo esencial')), ('checkout', T('Before you leave', 'Antes de partir')), ('explore', T('Explore the coast', 'Explora la costa')), ('faq', T('Your questions', 'Tus preguntas'))]
    s = head(lang, path, T('Your stay, beautifully considered | White Swan', 'Tu estadía, cuidada en cada detalle | White Swan'), T('The complete White Swan guest guide: arrival, villa amenities, private services and places to explore along the Salvadoran coast.', 'La guía completa de White Swan: llegada, comodidades, servicios privados y lugares para explorar la costa salvadoreña.'), other, 'guide')
    s += f'''<body class="editorial guide-page" id="top">{navigation(lang, 'guide')}<main id="main"><section class="section handbook-intro"><div><span class="eyebrow">WHITE SWAN / {T('YOUR PERSONAL GUIDE', 'TU GUÍA PERSONAL')}</span><h1>{T('Settle in.<br><em>Make it yours.</em>', 'Llega con calma.<br><em>Siéntete en casa.</em>')}</h1><p>{T('The thoughtful details that make a stay feel effortless. From your first arrival to one last dip in the pool.', 'Los detalles que hacen que todo fluya. Desde tu llegada hasta el último chapuzón en la piscina.')}</p><div class="actions"><a class="text-link" href="#arrive">{T('Before you arrive', 'Antes de llegar')} ↓</a>{link(lang, 'host', path, 'guide', T('Ask your concierge', 'Habla con tu concierge'))}</div></div><figure>{photo(27, lang, True)}<figcaption>{T('A slower rhythm. A place of your own.', 'Otro ritmo. Un lugar para ti.')}</figcaption></figure></section><div class="handbook-layout"><aside class="handbook-index"><span class="eyebrow">{T('DURING YOUR STAY', 'DURANTE TU ESTADÍA')}</span><nav aria-label="{T('Guest guide chapters', 'Capítulos de la guía')}">{''.join(f'<a href="#{key}"><span>0{i+1}</span>{label}</a>' for i,(key,label) in enumerate(chapters))}</nav><a class="text-link" href="{booking_path(lang)}">{T('Plan your stay', 'Planea tu estadía')} →</a></aside><div class="handbook-content">'''
    for key, label in chapters:
        if key == 'explore':
            s += destinations(lang, path)
            continue
        el = prepare(doc.get_element_by_id(key), lang)
        el.set('class', f'handbook-section handbook-{key}')
        heading = el.find('h2')
        if key == 'villa':
            heading = el.find('.//h2')
        heading.set('id', key + '-heading')
        el.set('aria-labelledby', key + '-heading')
        if key == 'villa':
            el.tag = 'section'
            gallery = '/es/fotos/' if lang == 'es' else '/photos/'
            el.append(html.fragment_fromstring(f'<a class="text-link" href="{gallery}">{T("Explore the complete photo tour", "Explora el recorrido fotográfico completo")} →</a>'))
        if key == 'arrive':
            a = el.xpath('.//a[contains(@href,"wa.me")]')[0]
            a.getparent().replace(a, html.fragment_fromstring(link(lang, 'arrival', path + '#arrive', 'guide', T('Coordinate your arrival', 'Coordina tu llegada'))))
        if key == 'arrive':
            directions = html.fragment_fromstring(f'<a class="text-link" href="https://maps.app.goo.gl/yr366aJLwmnjH1g9A" target="_blank" rel="noopener">{T("Driving directions", "Cómo llegar")} ↗</a>')
            el.insert(3, directions)
        if key == 'services':
            for card, topic in zip(el.xpath('./div[contains(@class,"grid")]/div'), TOPICS):
                card.tag = 'article'
                a = card.xpath('.//a')[0]
                a.getparent().replace(a, html.fragment_fromstring(link(lang, topic, path + '#services', 'guide', T('Ask your concierge', 'Consulta a tu concierge'))))
            el.append(html.fragment_fromstring(f'<p class="fine">{T("Service prices are indicative. Your host confirms the quote, availability and payment arrangements before booking.", "Los precios de servicios son orientativos. Tu anfitrión confirma cotización, disponibilidad y forma de pago antes de reservar.")}</p>'))
        # Guests can ask about early/late arrival here regardless of booking channel.
        for a in el.xpath('.//a[contains(@href,"airbnb.com/inbox")]'):
            a.getparent().replace(a, html.fragment_fromstring(link(lang, 'arrival', path + '#' + key, 'guide', T('Ask your host', 'Consulta a tu anfitrión'))))
        s += serialize(el)
    contact_note = serialize(prepare(doc.get_element_by_id('contact').xpath('.//p')[0],lang))
    s += f'''<section class="handbook-section handbook-contact" id="contact"><span class="eyebrow">WHITE SWAN CONCIERGE</span><h2>{T('Always a<br><em>conversation away.</em>', 'Siempre a<br><em>un mensaje de distancia.</em>')}</h2><p>{T('For plans, practical details or something you need at the villa, your host and on-site team are here to help in English and Spanish.', 'Para tus planes, detalles prácticos o algo que necesites en la villa, tu anfitrión y equipo en sitio te ayudan en español e inglés.')}</p>{contact_note}<div class="actions">{link(lang, 'host', path + '#contact', 'guide', T('Message Sergio · Host', 'Escribe a Sergio · Anfitrión'), 'button')}<a class="text-link" href="https://wa.me/50378551720" target="_blank" rel="noopener" data-placement="guide">{T('Message Wendy · On-site', 'Escribe a Wendy · En sitio')} ↗</a></div></section><section class="handbook-section handbook-book" id="book"><span class="eyebrow">{T('YOUR NEXT CHAPTER', 'TU PRÓXIMA HISTORIA')}</span><h2>{T('A little longer.<br><em>Or another time.</em>', 'Un poco más.<br><em>O una próxima vez.</em>')}</h2><p>{T('Choose your preferred dates on our website. Your host will help with availability, the full price and the details of your stay.', 'Elige tus fechas preferidas en nuestra web. Tu anfitrión te ayuda con la disponibilidad, el precio total y los detalles de tu estadía.')}</p><a class="button" href="{booking_path(lang)}">{T('Plan your stay', 'Planea tu estadía')} →</a></section></div></div></main>{footer(lang)}{widget(lang,path)}{components(lang)}</body></html>'''
    return s
