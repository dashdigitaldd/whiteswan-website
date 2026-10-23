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
const local = value => value?.[lang] ?? value?.en ?? '';
const main=document.querySelector('#main'),nav=document.querySelector('#guest-nav'),sheet=document.querySelector('#topic-sheet');
const params=new URLSearchParams(location.search);
const preview=params.get('preview')==='1';
let lang='en'; try {lang=localStorage.getItem('white-swan-guest-language') || (navigator.language.startsWith('es')?'es':'en');}catch{}
if(!['en','es'].includes(lang))lang='en';
let view='stay',data=null,content=null,token='',lastCheck=0,checking=false,searchTerm='',activeTopic=null,returnFocus=null;
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
  document.documentElement.lang=lang; document.title=text('Your stay · White Swan','Su estadía · White Swan');
  document.querySelector('.header-wordmark').textContent=text('Your place by the Pacific.','Su lugar junto al Pacífico.');
  document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===lang)));
  nav.setAttribute('aria-label',text('Your guest guide','Guía de su estadía'));
  nav.innerHTML=[['stay','home','Your stay','Su estadía'],['house','book','The house','La casa'],['experiences','spark','Experiences','Experiencias'],['explore','compass','Explore','Explorar'],['help','chat','Help','Ayuda']].map(([id,g,en,es])=>`<button type="button" data-view="${id}" ${view===id?'aria-current="page"':''}>${icon(g)}<span>${text(en,es)}</span></button>`).join('');
  const notice=document.querySelector('#preview-notice'); notice.hidden=!preview;
  if(preview) notice.textContent=text('Preview · Sample stay. No guest data or active booking.','Vista previa · Estadía de ejemplo. Sin datos de huéspedes ni reserva activa.');
}
function stayView(){
  const s=data.stay;
  const welcome=phase()==='departure'?text('Until next time','Hasta la próxima'):text('Welcome','Bienvenido');
  return `<div class="stay-layout"><section class="welcome-photo">${photo(basePhoto,text('White Swan villa and infinity pool','Villa White Swan y piscina infinita'),'',true)}<span class="private-badge">${icon('shield')}${text('Your private guest guide','Su guía privada')}</span><div class="welcome-copy"><h1>${welcome}${s.firstName?`, ${esc(s.firstName)}`:''}.</h1><p>${text('A slower rhythm. A place to feel at home.','Otro ritmo. Un lugar para sentirse en casa.')}</p></div></section>
  <section class="stay-itinerary" aria-labelledby="stay-title"><h2 id="stay-title">${text('All yours, for a little while.','Su casa, por unos días.')}</h2><p class="muted">White Swan · Xanadu, El Salvador</p><div class="stay-dates"><div><span>${text('Check-in','Entrada')}</span><strong>${esc(civil(s.arrival))}</strong><small>${time(s.checkIn)}</small></div><span class="date-line" aria-hidden="true">${icon('arrow')}</span><div><span>${text('Check-out','Salida')}</span><strong>${esc(civil(s.departure))}</strong><small>${time(s.checkOut)}</small></div></div><div class="stay-detail">${icon('users')}<span>${s.guestCount===null?text('Your group','Su grupo'):`${s.guestCount} ${text(s.guestCount===1?'guest':'guests',s.guestCount===1?'huésped':'huéspedes')}`}</span><span>${text('El Salvador time','Hora de El Salvador')}</span></div>${external(content.arrival.directionsUrl,text('Get directions','Cómo llegar'),'button primary')}
  <button type="button" class="text-button" data-sheet="arrival">${text('Arrival essentials','Lo esencial para llegar')}${icon('arrow')}</button></section></div>
  <div class="quick-actions" aria-label="${text('Useful shortcuts','Accesos útiles')}"><button type="button" data-sheet="access">${icon('key')}<span>${text('Access instructions','Instrucciones de acceso')}</span>${icon('arrow')}</button><button type="button" data-view="house">${icon('book')}<span>${text('Find something in the house','Encuentre lo que necesita')}</span>${icon('arrow')}</button><button type="button" data-view="help">${icon('chat')}<span>${text('Talk to your host','Hable con su anfitrión')}</span>${icon('arrow')}</button></div>
  <section class="at-home"><div>${photo(terracePhoto,text('Dining terrace opening to the pool and Pacific Ocean','Terraza de comedor con vista a la piscina y al Pacífico'))}</div><div class="at-home-copy"><h2>${text('Less planning. More being here.','Menos planes. Más disfrutar.')}</h2><p>${text('A meal prepared for you, a quiet afternoon, a little adventure. Make these days your own.','Una comida preparada para usted, una tarde tranquila, una pequeña aventura. Disfrute estos días a su manera.')}</p><button class="button primary" type="button" data-view="experiences">${text('Explore experiences','Ver experiencias')}${icon('arrow')}</button><button class="text-button" type="button" data-sheet="checkout">${text('When it is time to leave','Cuando llegue la hora de salir')}${icon('arrow')}</button></div></section>`;
}
function houseRows(){
  const q=normalise(searchTerm);
  const rows=content.houseTopics.filter(item=>!q||normalise([local(item.title),local(item.summary),...(item.body[lang]||[])].join(' ')).includes(q));
  return rows.length?rows.map(item=>`<button type="button" class="house-row" data-topic="${esc(item.id)}">${icon(item.icon)}<span><strong>${esc(local(item.title))}</strong><small>${esc(local(item.summary))}</small></span>${icon('arrow')}</button>`).join(''):`<div class="empty-search"><h2>${text('Let us help you find it.','Le ayudamos a encontrarlo.')}</h2><p>${text('Try another word, or ask your host.','Pruebe otra palabra o consulte con su anfitrión.')}</p>${hostAnchor(text('Ask your host','Consultar al anfitrión'),text('Hi! I have a question about the house: ','¡Hola! Tengo una consulta sobre la casa: ')+searchTerm,'button secondary')}</div>`;
}
function houseView(){return `${sectionTitle(text('Feel right at home.','Siéntase como en casa.'),text('The little details that make everything easier.','Los pequeños detalles que facilitan su estadía.'))}<label class="guide-search">${icon('search')}<input type="search" id="house-search" value="${esc(searchTerm)}" placeholder="${text('Pool, drinking water, air conditioning…','Piscina, agua para tomar, aire acondicionado…')}" aria-label="${text('Search the house guide','Buscar en la guía de la casa')}" autocomplete="off"></label><div class="house-directory" id="house-results">${houseRows()}</div><div class="house-help">${icon('chat')}<div><h2>${text('Something not quite right?','¿Algo no está bien?')}</h2><p>${text('Tell your host what is happening. We are here to help.','Cuéntele a su anfitrión qué está pasando. Estamos para ayudarle.')}</p></div>${hostAnchor(text('Get help','Pedir ayuda'),text('Hi! Something needs attention at the house. ','¡Hola! Hay algo que necesita atención en la casa. '),'button secondary')}</div>`;}
function experiencesView(){return `${sectionTitle(text('Make a little more of your stay.','Disfrute un poco más su estadía.'),text('Good food. Time to unwind. Something worth celebrating.','Buena comida. Tiempo para descansar. Algo que celebrar.'))}<div class="experience-intro">${photo('/assets/enhanced/listing-1852228438-960.webp',text('Kitchen and dining at White Swan','Cocina y comedor de White Swan'))}<div><h2>${text('Tell us what you have in mind.','Cuéntenos qué tiene en mente.')}</h2><p>${text('We will connect you with the right person. Prefer us to coordinate? Just ask.','Le ayudamos a contactar a la persona indicada. Si prefiere que coordinemos, solo díganos.')}</p><small>${text('Each service is confirmed separately with its provider.','Cada servicio se confirma por separado con su proveedor.')}</small></div></div><div class="experience-list">${content.experiences.map((item,i)=>`<article class="experience-row">${icon(['utensils','heart','car','compass','car','spark'][i])}<div><h2>${esc(local(item.title))}</h2><p>${esc(local(item.description))}</p></div>${hostAnchor(text('Ask about this','Consultar'),text(`Hi! I would like to know more about ${local(item.title).toLowerCase()} during my stay at White Swan. `,`¡Hola! Me gustaría saber más sobre ${local(item.title).toLowerCase()} durante mi estadía en White Swan. `),'button secondary')}</article>`).join('')}</div><p class="fine-print">${text('Opening WhatsApp prepares your message. Nothing is sent until you send it. Prices, timing and availability are confirmed by the provider.','WhatsApp abrirá su mensaje. No se envía nada hasta que usted lo envíe. El proveedor confirma precio, horario y disponibilidad.')}</p>`;}
function exploreView(){return `${sectionTitle(text('A little beyond the villa.','Un poco más allá de la villa.'),text('Coastal days, local flavours and places worth taking your time.','Días de playa, sabores locales y lugares para disfrutar sin prisa.'))}<div class="places">${content.places.map(item=>`<article class="place">${photo(item.image,local(item.title))}<div><h2>${esc(local(item.title))}</h2><p>${esc(local(item.description))}</p>${external(item.mapUrl,text('View on map','Ver en el mapa'),'text-link')}</div></article>`).join('')}</div>${content.moreIdeas?.length?`<section class="more-ideas"><h2>${text('A day a little further away','Un paseo un poco más lejos')}</h2><p>${content.moreIdeas.map(x=>esc(local(x.title)||local(x))).join(' · ')}</p>${hostAnchor(text('Plan a day out','Planear un paseo'),text('Hi! Could you help me plan a day out from White Swan?','¡Hola! ¿Me puede ayudar a planear un paseo desde White Swan?'),'button secondary')}</section>`:''}<section class="nearby-essentials"><h2>${text('The everyday essentials','Lo que necesita a mano')}</h2>${content.essentialsNearby.map(item=>`<div><h3>${esc(local(item.title))}</h3><p>${esc(local(item.description))}</p>${external(item.mapUrl,text('Open map','Abrir mapa'),'text-link')}</div>`).join('')}</section><p class="fine-print">${text('Ask about current opening hours, road conditions and travel times before setting out.','Consulte horarios, estado de las calles y tiempos de viaje antes de salir.')}</p>`;}
function helpView(){return `${sectionTitle(text('We are here for you.','Estamos para ayudarle.'),text('A question, a request or something that needs attention.','Una consulta, una solicitud o algo que necesita atención.'))}<section class="contact-host"><div class="host-symbol">${icon('chat')}</div><div><h2>${text('Your White Swan hosts','Sus anfitriones de White Swan')}</h2><p>${text('For anything about your stay, message us directly.','Para cualquier consulta sobre su estadía, escríbanos directamente.')}</p></div><div>${hostAnchor(text('Message on WhatsApp','Escribir por WhatsApp'),text('Hi! I am staying at White Swan and would like some help. ','¡Hola! Estoy hospedado en White Swan y quisiera hacer una consulta. '),'button primary')}${external('https://www.airbnb.com/inbox',text('Open Airbnb conversation','Abrir conversación en Airbnb'),'text-link')}</div></section><div class="help-layout"><section><h2>${text('Good to know','Es bueno saber')}</h2><div class="faq-list">${content.faqs.map(item=>`<details><summary>${esc(local(item.question))}${icon('arrow')}</summary><p>${esc(local(item.answer))}</p></details>`).join('')}</div></section><aside class="help-aside"><h2>${text('Before you head home','Antes de volver a casa')}</h2><p>${text('A simple checklist for an easy departure.','Una lista sencilla para salir sin complicaciones.')}</p><button type="button" data-sheet="checkout" class="button secondary">${text('Open departure checklist','Ver lista de salida')}${icon('arrow')}</button><hr><h2>${text('Keep your guide close','Tenga su guía a mano')}</h2><p>${text('Save the private link your host sent you. It is personal to this stay, so share it only with your travel group.','Guarde el enlace privado que le envió su anfitrión. Es para esta estadía; compártalo solo con su grupo.')}</p><p class="fine-print">${text('In an emergency, contact local emergency services first. This guide is not an emergency response service.','En una emergencia, comuníquese primero con los servicios de emergencia locales. Esta guía no es un servicio de atención de emergencias.')}</p></aside></div>`;}
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
  if(id==='arrival'){
    title=local(content.arrival.title);body=`<div class="arrival-address">${icon('pin')}<span>${esc(local(content.arrival.address))}</span></div><p class="sheet-intro">${esc(local(content.arrival.intro))}</p><ol class="arrival-steps">${content.arrival.steps.map(item=>`<li><h3>${esc(local(item.title))}</h3><p>${esc(local(item.body))}</p></li>`).join('')}</ol>${external(content.arrival.directionsUrl,text('Open directions','Abrir indicaciones'),'button primary')}<p class="fine-print">${text('For a different arrival time, please ask your host first.','Para llegar a otra hora, consulte primero con su anfitrión.')}</p>`;
  }else if(id==='access'){
    title=text('Your access instructions','Sus instrucciones de acceso');body=`<div class="sheet-emblem">${icon('key')}</div><p class="sheet-intro">${text('Your host shares access instructions through Airbnb three days before arrival.','Su anfitrión comparte las instrucciones de acceso por Airbnb tres días antes de su llegada.')}</p><p>${text('For your privacy, door, Wi-Fi and safe codes are not stored in this guide. If you cannot find your arrival message, contact your host.','Por su privacidad, esta guía no guarda códigos de puerta, Wi-Fi ni caja fuerte. Si no encuentra el mensaje de llegada, comuníquese con su anfitrión.')}</p>${external('https://www.airbnb.com/inbox',text('Open Airbnb messages','Abrir mensajes de Airbnb'),'button primary')}${hostAnchor(text('Ask your host','Consultar al anfitrión'),text('Hi! Could you help me find the access instructions for my stay?','¡Hola! ¿Me puede ayudar a encontrar las instrucciones de acceso para mi estadía?'),'button secondary')}`;
  }else if(id==='checkout'){
    title=text('An easy goodbye.','Una salida sin complicaciones.');body=`<p class="sheet-intro">${data.stay.checkOut?`${text('Check-out is at','La salida es a las')} ${time(data.stay.checkOut)}.`:text('Please confirm your checkout time with your host.','Confirme su hora de salida con su anfitrión.')} ${text('Thank you for taking care of our home.','Gracias por cuidar nuestra casa.')}</p><div class="departure-list">${content.checkout.map(item=>`<label><input type="checkbox" data-check="${esc(item.id)}"><span>${esc(local(item))}</span></label>`).join('')}</div><p class="fine-print">${text('This checklist is only on your screen. It does not notify the host that you have left.','Esta lista es solo para usted. No le avisa al anfitrión que ya salió.')}</p>${hostAnchor(text('Let your host know you have left','Avisar al anfitrión que ya salió'),text('Hi! We have checked out of White Swan. Thank you for our stay!','¡Hola! Ya salimos de White Swan. ¡Gracias por la estadía!'),'button primary')}`;
  }else{
    const item=content.houseTopics.find(item=>item.id===id);if(!item)return;
    title=local(item.title);body=`<div class="sheet-emblem">${icon(item.icon)}</div><p class="sheet-intro">${esc(local(item.summary))}</p>${(item.body[lang]||item.body.en).map(p=>`<p>${esc(p)}</p>`).join('')}${item.action==='airbnb'?external('https://www.airbnb.com/inbox',text('Open Airbnb messages','Abrir mensajes de Airbnb'),'button primary'):item.action==='map'?external(content.arrival.directionsUrl,text('Open map','Abrir mapa'),'button primary'):hostAnchor(text('Ask your host','Consultar al anfitrión'),text(`Hi! I have a question about ${local(item.title).toLowerCase()}. `,`¡Hola! Tengo una consulta sobre ${local(item.title).toLowerCase()}. `),'button secondary')}`;
  }
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
    const changed=!data||JSON.stringify(data.stay)!==JSON.stringify(result.stay);data=result;lastCheck=Date.now();if(changed){render();if(sheet.open&&activeTopic)openSheet(activeTopic);}
  }catch{data=null;sheet.close();showGate('temporary');}finally{checking=false;}
}
document.addEventListener('click',event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.matches('.brand')){event.preventDefault();if(data){view='stay';render({focus:true});}return;}
  if(target.dataset.language){lang=target.dataset.language;try{localStorage.setItem('white-swan-guest-language',lang);}catch{}renderChrome();if(data){render();if(sheet.open)openSheet(activeTopic);}else showGate(token?'temporary':'missing');return;}
  if(target.dataset.view&&data){view=target.dataset.view;searchTerm='';render({focus:true});}
  if(target.dataset.sheet)openSheet(target.dataset.sheet);
  if(target.dataset.topic)openSheet(target.dataset.topic);
  if(target.hasAttribute('data-close'))sheet.close();
  if(target.hasAttribute('data-retry')){if(content)verify();else boot();}
});
sheet.addEventListener('close',()=>{activeTopic=null;(returnFocus?.isConnected?returnFocus:main).focus({preventScroll:true});});
document.addEventListener('input',event=>{if(event.target.id==='house-search'){searchTerm=event.target.value;document.querySelector('#house-results').innerHTML=houseRows();document.querySelector('#status').textContent=text('House guide results updated.','Se actualizaron los resultados de la guía.');}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&Date.now()-lastCheck>60000)verify();});
setInterval(()=>{if(!document.hidden&&token&&Date.now()-lastCheck>240000)verify();},60000);
async function boot(){
  renderChrome();
  const fragment=new URLSearchParams(location.hash.slice(1));const received=fragment.get('access');
  if(fragment.has('access')){token=/^[a-f0-9]{64}$/.test(received)?received:'';try{if(token)sessionStorage.setItem('white-swan-guest-access',token);else sessionStorage.removeItem('white-swan-guest-access');}catch{}history.replaceState(null,'',location.pathname+location.search);}
  else try{token=sessionStorage.getItem('white-swan-guest-access')||'';}catch{}
  try{const response=await fetch('/content/guest-companion.json',{cache:'no-cache'});if(!response.ok)throw Error('content');content=await response.json();}catch{showGate('temporary');return;}
  if(preview){
    const start=new Date();start.setUTCDate(start.getUTCDate()+7);const end=new Date(start);end.setUTCDate(end.getUTCDate()+3);
    data={stay:{firstName:'',arrival:start.toISOString().slice(0,10),departure:end.toISOString().slice(0,10),checkIn:'16:00',checkOut:'12:00',guestCount:6},now:new Date().toISOString(),property:{name:'White Swan',timeZone:'America/El_Salvador'}};render();
  }else if(!token)showGate('missing');else await verify();
}
boot();
