import { wifiSvg } from './wifi-code.mjs';

const icons = {
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  book:'<path d="M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>',
  spark:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6ZM20 2v4m-2-2h4"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
  chat:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"/><path d="M7 11h10m-10 4h6"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external:'<path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-6"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-3-5"/>',
  key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-6-6 3-3m0 6 3-3"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  wave:'<path d="M2 8c2-3 4 3 6 0s4 3 6 0 4 3 8 0M2 14c2-3 4 3 6 0s4 3 6 0 4 3 8 0M2 20c2-3 4 3 6 0s4 3 6 0 4 3 8 0"/>',
  wifi:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".5"/>',
  wind:'<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h5a3 3 0 1 1-3 3"/>',
  heart:'<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1C-2 11 12 21 12 21S26 11 20 5Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  utensils:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M18 3c-4 4-4 10 0 10h2M20 3v18"/>',
  car:'<path d="m4 9 2-6h12l2 6M3 9h18v9H3ZM5 18v3m14-3v3M6 13h1m10 0h1"/>',
  shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z"/><path d="m8 12 3 3 5-6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 3h.01"/>',
  suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M8 11v6m8-6v6"/>',
};
const aliases={waves:'wave',sparkles:'spark','heart-handshake':'heart','glass-water':'wave',tv:'book',shirt:'suitcase',moon:'sun'};
const icon = (name,cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[aliases[name] || name] || icons.book}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (en,es) => lang==='es'?es:en;
const local = value => typeof value === 'string' ? value : value?.[lang] ?? value?.en ?? '';
const main=document.querySelector('#main'),nav=document.querySelector('#guest-nav'),sheet=document.querySelector('#topic-sheet');
const params=new URLSearchParams(location.search);
const preview=params.get('preview')==='1';
let lang='en'; try {lang=localStorage.getItem('white-swan-guest-language') || (navigator.language.startsWith('es')?'es':'en');}catch{}
if(!['en','es'].includes(lang))lang='en';
let view='stay',data=null,content=null,token='',lastCheck=0,checking=false,searchTerm='',activeTopic=null,returnFocus=null,exploreCategory='restaurants',welcomeOffered=false;
const basePhoto='/assets/editorial/villa-light-1536.webp';
const terracePhoto='/assets/enhanced/listing-2569998613-960.webp';
const hostLink=(message)=>`https://wa.me/50370528003?text=${encodeURIComponent(message)}`;
const hostAnchor=(label,message,cls='button')=>`<a class="${cls}" href="${esc(hostLink(message))}" target="_blank" rel="noopener noreferrer">${icon('chat')}${esc(label)}${icon('external')}</a>`;
const normalise=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const civil = (day,options={}) => new Intl.DateTimeFormat(lang==='es'?'es-SV':'en-US',{month:'short',day:'numeric',...options,timeZone:'UTC'}).format(new Date(`${day}T12:00:00Z`));
const time = value => {
  if(!value)return text('Ask your host','Consulte al anfitrión');
  const match=String(value||'').match(/(\d{1,2}):(\d{2})/);
  if(!match)return esc(value);
  return new Intl.DateTimeFormat(lang==='es'?'es-SV':'en-US',{hour:'numeric',minute:'2-digit',timeZone:'UTC'}).format(new Date(`2000-01-01T${match[1].padStart(2,'0')}:${match[2]}:00Z`));
};
const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/El_Salvador',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(data?.now||Date.now()));
function phase(){const day=today();return day<data.stay.arrival?'before':day>=data.stay.departure?'departure':'during';}
function external(url,label,cls='button secondary') {if(!/^https:\/\//.test(url||''))return ''; return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}${icon('external')}</a>`;}
function photo(src,alt,cls='',eager=false){return `<img class="${cls}" src="${esc(src||terracePhoto)}" alt="${esc(alt)}" width="1536" height="1024" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;}
function sectionTitle(title,description=''){return `<div class="section-heading"><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:''}</div>`;}
function renderChrome(){
  document.querySelector('.skip-link').textContent=text('Skip to content','Ir al contenido');
  document.querySelector('.brand').setAttribute('aria-label',text('White Swan guest home','Inicio de huéspedes White Swan'));
  document.querySelector('.language').setAttribute('aria-label',text('Language','Idioma'));
  document.documentElement.lang=lang; document.title=text('Your stay · White Swan','Su estadía · White Swan');
  document.querySelector('.header-wordmark').textContent=text('Your place by the Pacific.','Su lugar junto al Pacífico.');
  document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===lang)));
  nav.setAttribute('aria-label',text('Your guest guide','Guía de su estadía'));
  nav.innerHTML=[['stay','home','Your stay','Su estadía'],['house','book','The house','La casa'],['experiences','spark','Experiences','Experiencias'],['explore','compass','Explore','Explorar'],['help','chat','Help','Ayuda']].map(([id,g,en,es])=>`<button type="button" data-view="${id}" ${view===id?'aria-current="page"':''}>${icon(g)}<span>${text(en,es)}</span></button>`).join('');
  const notice=document.querySelector('#preview-notice'); notice.hidden=!preview;
  if(preview) notice.textContent=text('Preview · Sample stay. No guest data or active booking.','Vista previa · Estadía de ejemplo. Sin datos de huéspedes ni reserva activa.');
}
function paragraphs(value, className = '') {
  const copy = local(value);
  return (Array.isArray(copy) ? copy : copy ? [copy] : []).map(p => `<p${className ? ` class="${className}"` : ''}>${esc(p)}</p>`).join('');
}
function sourceLinks(item, className = 'text-link') {
  const links = [...(item.links || [])];
  if (item.mapUrl && !links.some(link => link.url === item.mapUrl)) links.push({url:item.mapUrl,label:{en:'Directions',es:'Cómo llegar'}});
  if (item.menuUrl && !links.some(link => link.url === item.menuUrl)) links.unshift({url:item.menuUrl,label:{en:'View menu',es:'Ver menú'}});
  return [...(item.menus || []).map(link => external(link.url,local(link.label)||text('View menu','Ver menú'),'button secondary menu-link')), ...links.map(link => external(link.url,local(link.label)||text('Open link','Abrir enlace'),className))].join('');
}
function callLink(number, label) {
  const digits = String(number || '').replace(/[^+\d]/g,'');
  if (!/^\+?\d{3,15}$/.test(digits)) return '';
  const display = /^\+503\d{8}$/.test(digits) ? `${digits.slice(0,4)} ${digits.slice(4,8)} ${digits.slice(8)}` : number;
  return `<a class="text-link" href="tel:${esc(digits)}">${esc(label || display)}</a>`;
}
function addressBlock() {
  return `<section class="address-block">${icon('pin')}<div><h2>${text('Your address','Su dirección')}</h2><p>${esc(local(content.arrival.address))}</p>${external(content.arrival.directionsUrl,text('Open directions','Abrir indicaciones'),'text-link')}</div></section>`;
}
function welcomeLetter(compact = false) {
  const welcome = content.welcome;
  return `<div class="host-letter${compact?' compact':''}">${welcome.image ? photo(welcome.image,text('A welcome from White Swan','Una bienvenida de White Swan'),'letter-photo') : ''}<div><h2>${esc(local(welcome.title))}</h2>${paragraphs(welcome.subtitle,'letter-subtitle')}${paragraphs(welcome.body)}<p class="host-signature">${esc(local(welcome.signature)||'Wendy & Sergio')}</p>${compact ? `<button class="text-button" type="button" data-sheet="welcome">${text('A welcome from your hosts','Una bienvenida de sus anfitriones')}${icon('arrow')}</button>` : `<button class="button primary" type="button" data-close>${text('Make yourself at home','Disfrute de la casa')}${icon('arrow')}</button>`}</div></div>`;
}
function stayView() {
  const s=data.stay;
  const welcome=phase()==='departure'?text('Until next time','Hasta la próxima'):text('Welcome','Bienvenido');
  return `<div class="stay-layout"><section class="welcome-photo">${photo(basePhoto,text('White Swan villa and infinity pool','Villa White Swan y piscina infinita'),'',true)}<span class="private-badge">${icon('shield')}${text('Your private guest guide','Su guía privada')}</span><div class="welcome-copy"><h1>${welcome}${s.firstName?`, ${esc(s.firstName)}`:''}.</h1><p>${text('From our family to yours.','De nuestra familia para la suya.')}</p><button type="button" class="welcome-invitation" data-sheet="welcome">${text('A note from Wendy & Sergio','Un mensaje de Wendy y Sergio')}${icon('arrow')}</button></div></section>
  <section class="stay-itinerary" aria-labelledby="stay-title"><h2 id="stay-title">${text('All yours, for a little while.','Su casa, por unos días.')}</h2><p class="muted">White Swan · Xanadu, El Salvador</p><div class="stay-dates"><div><span>${text('Check-in','Entrada')}</span><strong>${esc(civil(s.arrival))}</strong><small>${time(s.checkIn)}</small></div><span class="date-line" aria-hidden="true">${icon('arrow')}</span><div><span>${text('Check-out','Salida')}</span><strong>${esc(civil(s.departure))}</strong><small>${time(s.checkOut)}</small></div></div><div class="stay-detail">${icon('users')}<span>${s.guestCount===null?text('Your group','Su grupo'):`${s.guestCount} ${text(s.guestCount===1?'guest':'guests',s.guestCount===1?'huésped':'huéspedes')}`}</span><span>${text('El Salvador time','Hora de El Salvador')}</span></div>${external(content.arrival.directionsUrl,text('Get directions','Cómo llegar'),'button primary')}<button type="button" class="text-button" data-sheet="arrival">${text('Arrival essentials','Lo esencial para llegar')}${icon('arrow')}</button></section></div>
  <div class="quick-actions" aria-label="${text('Useful shortcuts','Accesos útiles')}"><button type="button" data-sheet="wifi">${icon('wifi')}<span>${text('Connect to Wi-Fi','Conectarse al Wi-Fi')}</span>${icon('arrow')}</button><button type="button" data-view="explore">${icon('utensils')}<span>${text('Restaurants & menus','Restaurantes y menús')}</span>${icon('arrow')}</button><button type="button" data-view="help">${icon('chat')}<span>${text('Your hosts & useful contacts','Anfitriones y contactos útiles')}</span>${icon('arrow')}</button></div>
  ${welcomeLetter(true)}
  ${content.aboutHome ? `<section class="at-home about-home"><div class="about-home-gallery">${(content.aboutHome.images||[{src:content.aboutHome.image||terracePhoto,alt:{en:'Inside White Swan',es:'Dentro de White Swan'}}]).map(item=>photo(item.src,local(item.alt))).join('')}</div><div class="at-home-copy"><h2>${esc(local(content.aboutHome.title))}</h2>${paragraphs(content.aboutHome.body)}<ul class="home-facts">${(content.aboutHome.facts||[]).map(item=>`<li>${esc(local(item))}</li>`).join('')}</ul><button class="text-button" type="button" data-view="house">${text('Explore your home','Conozca su casa')}${icon('arrow')}</button></div></section>` : ''}
  ${addressBlock()}
  <div class="stay-next"><button class="button secondary" type="button" data-view="experiences">${text('Services for your stay','Servicios para su estadía')}${icon('arrow')}</button><button class="button secondary" type="button" data-sheet="checkout">${text('Departure checklist','Lista de salida')}${icon('arrow')}</button></div>`;
}
function houseRows() {
  const q=normalise(searchTerm);
  const rows=content.houseTopics.filter(item=>!q||normalise([local(item.title),local(item.summary),...(item.body[lang]||[])].join(' ')).includes(q));
  return rows.length?rows.map(item=>`<button type="button" class="house-row" data-topic="${esc(item.id)}">${icon(item.icon)}<span><strong>${esc(local(item.title))}</strong><small>${esc(local(item.summary))}</small></span>${icon('arrow')}</button>`).join(''):`<div class="empty-search"><h2>${text('Let us help you find it.','Le ayudamos a encontrarlo.')}</h2><p>${text('Try another word, or ask your host.','Pruebe otra palabra o consulte con su anfitrión.')}</p>${hostAnchor(text('Ask your host','Consultar al anfitrión'),text('Hi! I have a question about the house: ','¡Hola! Tengo una consulta sobre la casa: ')+searchTerm,'button secondary')}</div>`;
}
function houseView() {
  return `${sectionTitle(text('Feel right at home.','Siéntase como en casa.'),text('The practical details, exactly where you need them.','Los detalles prácticos, justo donde los necesita.'))}<div class="house-shortcuts"><button class="button secondary" type="button" data-sheet="wifi">${icon('wifi')}${text('Wi-Fi & QR code','Wi-Fi y código QR')}</button><button class="button secondary" type="button" data-sheet="arrival">${icon('pin')}${text('Address & arrival','Dirección y llegada')}</button><button class="button secondary" type="button" data-sheet="checkout">${icon('suitcase')}${text('Departure checklist','Lista de salida')}</button></div><label class="guide-search">${icon('search')}<input type="search" id="house-search" value="${esc(searchTerm)}" placeholder="${text('Pool, drinking water, house rules…','Piscina, agua para tomar, reglas…')}" aria-label="${text('Search the house guide','Buscar en la guía de la casa')}" autocomplete="off"></label><div class="house-directory" id="house-results">${houseRows()}</div><div class="house-help">${icon('chat')}<div><h2>${text('Something not quite right?','¿Algo no está bien?')}</h2><p>${text('Wendy and Sergio are here to help.','Wendy y Sergio están para ayudarle.')}</p></div><button class="button secondary" type="button" data-view="help">${text('Contact your hosts','Contactar a sus anfitriones')}</button></div>`;
}
function experiencesView() {
  return `${sectionTitle(text('A little extra, arranged for you.','Algo especial para su estadía.'),text('Breakfast at home, a massage or dinner prepared just for you.','Desayuno en casa, un masaje o una cena preparada para usted.'))}<p class="guide-note">${esc(local(content.serviceNote))}</p><div class="service-cards">${content.experiences.map(item=>`<article class="service-card">${item.image?photo(item.image,local(item.title)):''}<div class="service-copy"><h2>${esc(local(item.title))}</h2>${item.priceLabel?`<p class="service-price">${esc(local(item.priceLabel))}</p>`:''}${paragraphs(item.description)}${item.details?paragraphs(item.details):''}${item.menuChoices?.length?`<div class="menu-options"><h3>${text('Menu choices','Opciones de menú')}</h3><ul>${item.menuChoices.map(option=>`<li>${esc(local(option))}</li>`).join('')}</ul>${hostAnchor(text('Request the dinner menu','Pedir el menú de la cena'),text('Hi Wendy and Sergio! Could you send us the current private chef menus for our stay?','¡Hola Wendy y Sergio! ¿Nos pueden enviar los menús actuales del chef para nuestra estadía?'),'text-link')}</div>`:''}<div class="guide-links">${sourceLinks(item)}</div>${hostAnchor(text('Ask Wendy & Sergio','Consultar a Wendy y Sergio'),text(`Hi Wendy and Sergio! We are interested in ${local(item.title).toLowerCase()} during our White Swan stay. Could you confirm availability and the current price?`,`¡Hola Wendy y Sergio! Nos interesa ${local(item.title).toLowerCase()} durante nuestra estadía en White Swan. ¿Nos confirman disponibilidad y precio actual?`),'button secondary')}</div></article>`).join('')}</div>
  ${content.transportRates?.length?`<section class="transport-section"><h2>${text('Private transport','Transporte privado')}</h2><p>${text('Plan a day out with a driver who knows the way.','Planee un paseo con un conductor que conoce el camino.')}</p><div class="transport-rates">${content.transportRates.map(item=>`<article><div><h3>${esc(local(item.title))}</h3>${paragraphs(item.description)}${item.groupSize?`<small>${esc(local(item.groupSize))}</small>`:''}${item.schedule?`<small>${esc(local(item.schedule))}</small>`:''}</div><strong>${esc(local(item.priceLabel))}</strong></article>`).join('')}</div>${paragraphs(content.transportNote,'fine-print')}${hostAnchor(text('Arrange transport','Coordinar transporte'),text('Hi Wendy and Sergio! Could you help us arrange transport for our stay?','¡Hola Wendy y Sergio! ¿Nos ayudan a coordinar transporte para nuestra estadía?'),'button primary')}</section>`:''}<p class="fine-print section-note">${text('A WhatsApp message is an enquiry. Your host or provider confirms availability, final price and payment before a service is booked.','El mensaje de WhatsApp es una consulta. El anfitrión o proveedor confirma disponibilidad, precio final y pago antes de reservar el servicio.')}</p>`;
}
function exploreCard(item) {
  return `<article class="place">${item.image?photo(item.image,local(item.title)):''}<div>${item.distance?`<p class="place-distance">${esc(local(item.distance))}</p>`:''}<h2>${esc(local(item.title))}</h2>${paragraphs(item.description)}${item.priceLabel?`<p class="service-price">${esc(local(item.priceLabel))}</p>`:''}${item.address?`<p class="place-address">${icon('pin')}${esc(local(item.address))}</p>`:''}<div class="guide-links">${sourceLinks(item)}${item.phone?callLink(item.phone):''}</div>${item.note?`<p class="fine-print">${esc(local(item.note))}</p>`:''}</div></article>`;
}
function exploreView() {
  const groups=[['restaurants',text('Restaurants','Restaurantes'),content.restaurants||[]],['places',text('Things to do','Qué hacer'),content.places],['nearby',text('Everyday essentials','Lo que necesita cerca'),content.essentialsNearby]];
  const selected=groups.find(group=>group[0]===exploreCategory)||groups[0];
  return `${sectionTitle(text('Our favourite places. Yours to discover.','Nuestros lugares favoritos. Para que los descubra.'),text('Where we love to eat, explore and spend a day by the coast.','Nuestros lugares para comer, pasear y disfrutar la costa.'))}<div class="explore-tabs" role="group" aria-label="${text('Explore categories','Categorías para explorar')}">${groups.map(([id,label,items])=>`<button type="button" data-explore="${id}" aria-pressed="${exploreCategory===id}">${label}<span>${items.length}</span></button>`).join('')}</div><div class="places">${selected[2].map(exploreCard).join('')}</div><p class="fine-print section-note">${text('These are the hosts’ recommendations. Check current opening hours, menus and reservations directly with each venue.','Estas son recomendaciones de sus anfitriones. Consulte horarios, menús y reservas directamente con cada lugar.')}</p>`;
}
function hostContacts() {
  const hosts=data?.privateGuide?.hosts||[];
  const profiles=content.hostProfiles||[{id:'wendy',name:'Wendy'},{id:'sergio',name:'Sergio'}];
  return `<section class="host-contacts"><h2>${text('Wendy & Sergio, your hosts','Wendy y Sergio, sus anfitriones')}</h2>${paragraphs(content.help?.intro)}<div class="host-contact-list">${profiles.map(profile=>{const host=hosts.find(item=>item.id===profile.id);return `<article><div class="host-initial" aria-hidden="true">${esc(profile.name.slice(0,1))}</div><div><h3>${esc(profile.name)}</h3>${paragraphs(profile.intro)}${host?`${callLink(host.phone)}${external(`https://wa.me/${host.whatsapp}`,'WhatsApp','text-link')}`:''}</div></article>`;}).join('')}</div>${!hosts.length?`<p class="private-note">${icon('shield')}${text('Their direct numbers appear when you open your private stay link.','Sus números directos aparecen al abrir el enlace privado de su estadía.')}</p>`:''}${paragraphs(content.help?.contactNote,'fine-print')}<div class="guide-links">${hostAnchor(text('Message White Swan','Escribir a White Swan'),text('Hi Wendy and Sergio! We have a question about our stay. ','¡Hola Wendy y Sergio! Tenemos una consulta sobre nuestra estadía. '),'button primary')}${external('https://www.airbnb.com/inbox',text('Airbnb messages','Mensajes de Airbnb'),'text-link')}</div></section>`;
}
function helpView() {
  return `${sectionTitle(text('We are here for you.','Estamos para ayudarle.'),text('Your hosts, useful contacts and a little care for the end of your stay.','Sus anfitriones, contactos útiles y los detalles para despedirnos.'))}${hostContacts()}${addressBlock()}
  <section class="important-contacts"><h2>${text('Important contacts','Contactos importantes')}</h2><div class="contact-directory">${(content.contacts||[]).map(item=>`<article><div><h3>${esc(local(item.title))}</h3>${paragraphs(item.description)}${item.hours?`<p class="contact-hours">${esc(local(item.hours))}</p>`:''}${item.address?`<p>${esc(local(item.address))}</p>`:''}${item.verificationNote?`<p class="fine-print">${esc(local(item.verificationNote))}</p>`:''}</div><div class="contact-actions">${callLink(item.phone)}${sourceLinks(item)}</div></article>`).join('')}</div></section>
  <div class="help-layout"><section><h2>${text('Good to know','Es bueno saber')}</h2><div class="faq-list">${content.faqs.map(item=>`<details><summary>${esc(local(item.question))}${icon('arrow')}</summary>${paragraphs(item.answer)}</details>`).join('')}</div></section><aside class="help-aside"><h2>${text('Before you head home','Antes de volver a casa')}</h2><p>${text('Everything for a relaxed departure.','Todo para una salida tranquila.')}</p><button type="button" data-sheet="checkout" class="button secondary">${text('Departure checklist','Lista de salida')}${icon('arrow')}</button><button type="button" data-sheet="review" class="text-button">${text('A note about reviews','Una nota sobre las reseñas')}${icon('arrow')}</button><button type="button" data-sheet="thank-you" class="text-button">${text('A thank-you from Wendy & Sergio','Un agradecimiento de Wendy y Sergio')}${icon('arrow')}</button></aside></div>${thankYouBlock()}`;
}
function thankYouBlock() {
  if(!content.thankYou)return '';
  return `<section class="thank-you-block">${content.thankYou.image?photo(content.thankYou.image,text('White Swan memories','Recuerdos de White Swan')):''}<div><h2>${esc(local(content.thankYou.title))}</h2>${paragraphs(content.thankYou.body)}<p class="host-signature">${esc(local(content.thankYou.signature))}</p><button class="text-button" type="button" data-sheet="review">${text('About leaving a review','Sobre su reseña')}${icon('arrow')}</button></div></section>`;
}
function offerWelcome() {
  if(welcomeOffered||!data||!content)return;
  welcomeOffered=true;
  const key=preview?'preview':`${data.stay.arrival}/${data.stay.departure}`;
  try {if(sessionStorage.getItem('white-swan-welcome-seen')===key)return;}catch{}
  openSheet('welcome');
}
function wifiSheet() {
  const wifi=data?.privateGuide?.wifi;
  if(!wifi)return `<div class="sheet-emblem">${icon('wifi')}</div><p class="sheet-intro">${text('Your connection, ready when you arrive.','Su conexión, lista cuando llegue.')}</p><p>${preview?text('The sample preview keeps the real network, password and QR code private. Open your host’s private stay link to see them.','La vista previa protege el nombre real de la red, la contraseña y el código QR. Abra el enlace privado de su anfitrión para verlos.'):text('Your Wi-Fi details are not available here right now. Please check your arrival message or ask Wendy and Sergio.','Los datos del Wi-Fi no están disponibles aquí en este momento. Revise su mensaje de llegada o consulte con Wendy y Sergio.')}</p>${external('https://www.airbnb.com/inbox',text('Open Airbnb messages','Abrir mensajes de Airbnb'),'button secondary')}`;
  let svg='';
  try {svg=wifiSvg(wifi);}catch{}
  return `<p class="sheet-intro">${text('Settle in. Get connected.','Acomódese y conéctese.')}</p>${svg?`<div class="wifi-qr" role="img" aria-label="${text('Scan this QR code to join the house Wi-Fi','Escanee este código QR para conectarse al Wi-Fi de la casa')}">${svg}</div><p class="wifi-scan-note">${text('Scan with another phone’s camera to join.','Escanee con la cámara de otro teléfono para conectarse.')}</p>`:''}<dl class="wifi-details"><div><dt>${text('Network','Red')}</dt><dd>${esc(wifi.network)}</dd></div><div><dt>${text('Password','Contraseña')}</dt><dd>${esc(wifi.password)}</dd></div></dl><button type="button" data-copy-wifi class="button primary">${text('Copy Wi-Fi password','Copiar contraseña')}</button><p class="fine-print">${text('For your group’s use during this stay.','Para el uso de su grupo durante esta estadía.')}</p>`;
}

function render({focus=false}={}){
  renderChrome(); if(!data||!content)return;
  nav.hidden=false; main.className=`guest-main view-${view}`;
  main.innerHTML=({stay:stayView,house:houseView,experiences:experiencesView,explore:exploreView,help:helpView}[view])()+`<footer class="guest-footer"><span>White Swan Beach House</span><span>${text('Made for your time here.','Pensado para su estadía.')}</span></footer>`;
  if(focus){window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});}
}
function showGate(kind){
  nav.hidden=true; main.className='guest-main';
  const missing=kind==='missing', temporary=kind==='temporary';
  main.innerHTML=`<section class="gate"><div class="gate-photo"></div><div class="gate-content">${icon('key')}<h1>${missing?text('Your stay starts here.','Su estadía comienza aquí.'):temporary?text('One moment, please.','Un momento, por favor.'):text('Let us get you a new link.','Le ayudamos con un nuevo enlace.')}</h1><p>${missing?text('Open the private link your host sent you to find your stay details and everything you need for the house.','Abra el enlace privado que le envió su anfitrión para ver su estadía y la guía de la casa.'):temporary?text('We could not check your stay just now. Please try again, or contact your host.','No pudimos consultar su estadía en este momento. Intente de nuevo o comuníquese con su anfitrión.'):text('This private link is no longer available. Your host can send you a fresh one.','Este enlace privado ya no está disponible. Su anfitrión puede enviarle uno nuevo.')}</p>${temporary?`<button class="button primary" type="button" data-retry>${text('Try again','Intentar de nuevo')}</button>`:''}${hostAnchor(text('Contact your host','Contactar al anfitrión'),text('Hi! Could you send me the private guide link for my stay at White Swan?','¡Hola! ¿Me puede enviar el enlace privado de la guía para mi estadía en White Swan?'),'button secondary')}<small>${text('Your stay information stays private.','La información de su estadía se mantiene privada.')}</small></div></section>`;
}
function openSheet(id){
  if(!sheet.open)returnFocus=document.activeElement;activeTopic=id;
  let title='',body='';
  if(id==='welcome'){
    title=text('A little welcome','Una pequeña bienvenida');body=welcomeLetter();
  }else if(id==='wifi'){
    title=text('Your Wi-Fi','Su Wi-Fi');body=wifiSheet();
  }else if(id==='review'){
    const review=content.review;title=local(review.title);body=`${paragraphs(review.intro,'sheet-intro')}${paragraphs(review.hostNote)}<ol class="review-ratings">${review.ratings.map(item=>`<li><span class="rating-stars" aria-label="${item.stars} ${text('stars','estrellas')}">${Array.from({length:item.stars},()=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1Z"/></svg>').join('')}</span><span>${esc(local(item.label))}</span></li>`).join('')}</ol>${paragraphs(review.note,'fine-print')}<div class="guide-links">${sourceLinks(review)}</div>`;
  }else if(id==='thank-you'){
    title=local(content.thankYou.title);body=thankYouBlock();
  }else if(id==='arrival'){
    title=local(content.arrival.title);body=`<div class="arrival-address">${icon('pin')}<span>${esc(local(content.arrival.address))}</span></div><p class="sheet-intro">${esc(local(content.arrival.intro))}</p><ol class="arrival-steps">${content.arrival.steps.map(item=>`<li><h3>${esc(local(item.title))}</h3><p>${esc(local(item.body))}</p></li>`).join('')}</ol>${external(content.arrival.directionsUrl,text('Open directions','Abrir indicaciones'),'button primary')}<p class="fine-print">${text('For a different arrival time, please ask your host first.','Para llegar a otra hora, consulte primero con su anfitrión.')}</p>`;
  }else if(id==='access'){
    title=text('Your access instructions','Sus instrucciones de acceso');body=`<div class="sheet-emblem">${icon('key')}</div><p class="sheet-intro">${text('Your host shares access instructions through Airbnb three days before arrival.','Su anfitrión comparte las instrucciones de acceso por Airbnb tres días antes de su llegada.')}</p><p>${text('Door and safe instructions remain in your private arrival message. Wi-Fi details are available in this guide when you open your private stay link.','Las instrucciones de puerta y caja fuerte están en su mensaje privado de llegada. Los datos del Wi-Fi están en esta guía al abrir el enlace privado de su estadía.')}</p>${external('https://www.airbnb.com/inbox',text('Open Airbnb messages','Abrir mensajes de Airbnb'),'button primary')}${hostAnchor(text('Ask your host','Consultar al anfitrión'),text('Hi! Could you help me find the access instructions for my stay?','¡Hola! ¿Me puede ayudar a encontrar las instrucciones de acceso para mi estadía?'),'button secondary')}`;
  }else if(id==='checkout'){
    title=text('An easy goodbye.','Una salida sin complicaciones.');body=`<p class="sheet-intro">${data.stay.checkOut?`${text('Check-out is at','La salida es a las')} ${time(data.stay.checkOut)}.`:text('Please confirm your checkout time with your host.','Confirme su hora de salida con su anfitrión.')} ${text('Thank you for taking care of our home.','Gracias por cuidar nuestra casa.')}</p><div class="departure-list">${content.checkout.map(item=>`<label><input type="checkbox" data-check="${esc(item.id)}"><span>${esc(local(item))}</span></label>`).join('')}</div><p class="fine-print">${text('This checklist is only on your screen. It does not notify the host that you have left.','Esta lista es solo para usted. No le avisa al anfitrión que ya salió.')}</p>${hostAnchor(text('Let your host know you have left','Avisar al anfitrión que ya salió'),text('Hi! We have checked out of White Swan. Thank you for our stay!','¡Hola! Ya salimos de White Swan. ¡Gracias por la estadía!'),'button primary')}<div class="guide-links"><button type="button" class="text-button" data-sheet="review">${text('A note about reviews','Una nota sobre las reseñas')}${icon('arrow')}</button><button type="button" class="text-button" data-sheet="thank-you">${text('A thank-you from your hosts','Un agradecimiento de sus anfitriones')}${icon('arrow')}</button></div>`;
  }else{
    const item=content.houseTopics.find(item=>item.id===id);if(!item)return;
    title=local(item.title);body=`<div class="sheet-emblem">${icon(item.icon)}</div><p class="sheet-intro">${esc(local(item.summary))}</p>${paragraphs(item.body)}<div class="guide-links">${sourceLinks(item)}</div>${item.action==='airbnb'?external('https://www.airbnb.com/inbox',text('Open Airbnb messages','Abrir mensajes de Airbnb'),'button primary'):item.action==='map'?external(content.arrival.directionsUrl,text('Open map','Abrir mapa'),'button primary'):hostAnchor(text('Ask your host','Consultar al anfitrión'),text(`Hi! I have a question about ${local(item.title).toLowerCase()}. `,`¡Hola! Tengo una consulta sobre ${local(item.title).toLowerCase()}. `),'button secondary')}`;
  }
  sheet.classList.toggle('welcome-sheet',id==='welcome');
  sheet.querySelector('.sheet-inner').innerHTML=`<div class="sheet-heading"><h2 id="sheet-title">${esc(title)}</h2><button type="button" data-close aria-label="${text('Close','Cerrar')}">${icon('close')}</button></div><div class="sheet-body">${body}</div>`;
  if(!sheet.open)sheet.showModal();
  sheet.scrollTop=0;
}
async function verify(){
  if(checking||preview)return;checking=true;
  try{
    const response=await fetch('/api/guest-companion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(12000)});
    if(!response.ok){data=null;sheet.close();if(response.status===404){try{sessionStorage.removeItem('white-swan-guest-access');}catch{}token='';showGate('expired');}else showGate('temporary');return;}
    const result=await response.json();
    if(!result.stay || !/^\d{4}-\d{2}-\d{2}$/.test(result.stay.arrival)||!/^\d{4}-\d{2}-\d{2}$/.test(result.stay.departure))throw Error('invalid');
    const changed=!data||JSON.stringify([data.stay,data.privateGuide])!==JSON.stringify([result.stay,result.privateGuide]);data=result;lastCheck=Date.now();if(changed){render();if(sheet.open&&activeTopic)openSheet(activeTopic);}offerWelcome();
  }catch{data=null;sheet.close();showGate('temporary');}finally{checking=false;}
}
document.addEventListener('click',async event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.matches('.brand')){event.preventDefault();if(data){view='stay';render({focus:true});}return;}
  if(target.dataset.language){lang=target.dataset.language;try{localStorage.setItem('white-swan-guest-language',lang);}catch{}renderChrome();if(data){render();if(sheet.open)openSheet(activeTopic);}else showGate(token?'temporary':'missing');return;}
  if(target.dataset.view&&data){view=target.dataset.view;searchTerm='';render({focus:true});}
  if(target.dataset.explore&&data){exploreCategory=target.dataset.explore;render();document.querySelector(`[data-explore="${exploreCategory}"]`)?.focus({preventScroll:true});}
  if(target.hasAttribute('data-copy-wifi')&&data?.privateGuide?.wifi){
    try{await navigator.clipboard.writeText(data.privateGuide.wifi.password);target.textContent=text('Password copied','Contraseña copiada');document.querySelector('#status').textContent=text('Wi-Fi password copied.','Contraseña del Wi-Fi copiada.');}
    catch{document.querySelector('#status').textContent=text('Select the password above to copy it.','Seleccione la contraseña de arriba para copiarla.');}
  }
  if(target.dataset.sheet)openSheet(target.dataset.sheet);
  if(target.dataset.topic)openSheet(target.dataset.topic);
  if(target.hasAttribute('data-close'))sheet.close();
  if(target.hasAttribute('data-retry')){if(content)verify();else boot();}
});
sheet.addEventListener('close',()=>{if(activeTopic==='welcome'&&data){try{sessionStorage.setItem('white-swan-welcome-seen',preview?'preview':`${data.stay.arrival}/${data.stay.departure}`);}catch{}}activeTopic=null;(returnFocus?.isConnected?returnFocus:main).focus({preventScroll:true});});
document.addEventListener('input',event=>{if(event.target.id==='house-search'){searchTerm=event.target.value;document.querySelector('#house-results').innerHTML=houseRows();document.querySelector('#status').textContent=text('House guide results updated.','Se actualizaron los resultados de la guía.');}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&Date.now()-lastCheck>60000)verify();});
setInterval(()=>{if(!document.hidden&&token&&Date.now()-lastCheck>240000)verify();},60000);
async function boot(){
  renderChrome();
  const loading=main.querySelector('.gate-content');
  if(loading){loading.querySelector('h1').textContent=text('Getting your stay ready','Estamos preparando su estadía');loading.querySelector('p').textContent=text('Just a moment. Make yourself comfortable.','Un momento, por favor.');}
  const fragment=new URLSearchParams(location.hash.slice(1));const received=fragment.get('access');
  if(fragment.has('access')){token=/^[a-f0-9]{64}$/.test(received)?received:'';try{if(token)sessionStorage.setItem('white-swan-guest-access',token);else sessionStorage.removeItem('white-swan-guest-access');}catch{}history.replaceState(null,'',location.pathname+location.search);}
  else try{token=sessionStorage.getItem('white-swan-guest-access')||'';}catch{}
  try{const response=await fetch('/content/guest-companion.json',{cache:'no-cache'});if(!response.ok)throw Error('content');content=await response.json();}catch{showGate('temporary');return;}
  if(preview){
    const start=new Date();start.setUTCDate(start.getUTCDate()+7);const end=new Date(start);end.setUTCDate(end.getUTCDate()+3);
    data={stay:{firstName:'',arrival:start.toISOString().slice(0,10),departure:end.toISOString().slice(0,10),checkIn:'16:00',checkOut:'12:00',guestCount:6},now:new Date().toISOString(),property:{name:'White Swan',timeZone:'America/El_Salvador'}};render();offerWelcome();
  }else if(!token)showGate('missing');else await verify();
}
boot();
