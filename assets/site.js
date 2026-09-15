(() => {
'use strict';
const language=document.documentElement.lang==='es'?'es':'en',es=language==='es';
const t=(en,sp)=>es?sp:en,config=window.WHITE_SWAN_CONFIG||{},origin=config.intakeOrigin;
const dialog=document.querySelector('#enquiry-dialog'),form=document.querySelector('#enquiry-form'),status=form?.querySelector('.form-status');
let contactSession=null,analyticsSession=null,submitting=false;
let consent='unknown';try{consent=localStorage.getItem('ws.analytics-choice')||'unknown';}catch{}
const params=new URLSearchParams(location.search),attrib={path:location.pathname};
for(const name of ['source','medium','campaign','content']){const value=(params.get('utm_'+name)||'').toLowerCase();if(/^[a-z0-9][a-z0-9_-]{0,47}$/.test(value)&&!/[0-9]{6}/.test(value))attrib[name]=value;}
const currentAttribution=()=>consent==='granted'?attrib:{path:location.pathname};
async function api(path,data){
 if(!origin||!/^https:\/\//.test(origin))throw new Error('unavailable');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
 try{const r=await fetch(origin+path,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined,credentials:'omit',signal:controller.signal});const result=await r.json();if(!r.ok)throw new Error(String(r.status));return result;}finally{clearTimeout(timer);}
}
async function getSession(kind){
 const current=kind==='contact'?contactSession:analyticsSession;if(current)return current;
 const promise=api('/v1/session').then(async r=>{await new Promise(resolve=>setTimeout(resolve,1550));return r.challenge;}).catch(e=>{if(kind==='contact')contactSession=null;else analyticsSession=null;throw e;});
 if(kind==='contact')contactSession=promise;else analyticsSession=promise;return promise;
}
async function track(event,service='other',placement='other'){
 if(consent!=='granted'||!config.analyticsEnabled)return;
 try{const token=await getSession('analytics');if(consent!=='granted')return;const data={challenge:token,event,service,placement,language,analyticsConsent:true,attribution:attrib};await api('/v1/events',data);
 // No GA tag is loaded. A future approved adapter may consume this PII-free event once.
 window.dispatchEvent(new CustomEvent('white_swan:analytics',{detail:{event,service,placement,language,attribution:attrib}}));
 }catch{/* Optional analytics must never interrupt a guest action. */}
}
function preferences(){document.querySelector('.cookie-panel')?.removeAttribute('hidden');}
document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',preferences));
document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>{consent=b.dataset.consent;try{localStorage.setItem('ws.analytics-choice',consent);}catch{}document.querySelector('.cookie-panel')?.setAttribute('hidden','');if(consent==='granted')void track('page_view');}));
if(config.analyticsEnabled){if(consent==='unknown')preferences();else if(consent==='granted')void track('page_view');}else document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.hidden=true);
if(!origin&&form){form.hidden=true;const offline=document.createElement('section');offline.className='enquiry-offline';const copy=document.createElement('p');copy.textContent=t('Our online enquiry form is not available yet. Contact White Swan on WhatsApp to discuss your dates or services.','Nuestro formulario todavía no está disponible. Escríbenos por WhatsApp para consultar fechas o servicios.');const link=document.createElement('a');link.className='button';link.href='https://wa.me/50370528003';link.textContent=t('Continue on WhatsApp ↗','Continuar por WhatsApp ↗');offline.append(copy,link);form.after(offline);}
document.querySelectorAll('[data-enquire]').forEach(b=>b.addEventListener('click',()=>{if(!dialog||!form)return;if(!origin){form.elements.service.value=b.dataset.enquire||'stay';const service=form.elements.service.selectedOptions[0]?.textContent||'';const message=t('Hi White Swan! I would like to ask about: ','¡Hola White Swan! Quisiera consultar sobre: ')+service;dialog.querySelector('.enquiry-offline a').href='https://wa.me/50370528003?text='+encodeURIComponent(message);if(!dialog.open)dialog.showModal();return;}if(form.hidden){form.reset();form.hidden=false;dialog.querySelector('.enquiry-success').hidden=true;contactSession=null;status.textContent='';}form.elements.service.value=b.dataset.enquire||'stay';if(!dialog.open)dialog.showModal();void getSession('contact').catch(()=>{});void track('enquiry_open',b.dataset.enquire,b.dataset.placement);}));
dialog?.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
form?.addEventListener('submit',async e=>{
 e.preventDefault();if(submitting||!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form));if(!data.email&&!data.phone){status.textContent=t('Add an email or phone number so we can reply.','Agrega un correo o teléfono para poder responderte.');return;}
 if(data.phone&&!/^\+[1-9][0-9 ()-]{6,24}$/.test(data.phone)){status.textContent=t('Start your phone number with + and the country code.','Comienza tu teléfono con + y el código del país.');return;}
 if(data.arrival&&data.departure&&data.departure<=data.arrival){status.textContent=t('Departure must be after arrival.','La salida debe ser posterior a la llegada.');return;}
 submitting=true;const button=form.querySelector('[type=submit]');button.disabled=true;status.textContent=t('Sending your enquiry…','Enviando tu consulta…');
 try{const challenge=await getSession('contact');const result=await api('/v1/enquiries',{...data,challenge,contactConsent:form.elements.contactConsent.checked,language,attribution:currentAttribution()});if(result.received!==true||!/^WS-[A-F0-9-]{36}$/.test(result.reference))throw new Error('receipt');
 form.hidden=true;const success=dialog.querySelector('.enquiry-success');success.hidden=false;success.querySelector('.receipt').textContent=t('Your reference: ','Tu referencia: ')+result.reference;
 const message=t('Hi White Swan! I submitted a website enquiry. Reference: ','¡Hola White Swan! Envié una consulta en la web. Referencia: ')+result.reference;
 const link=success.querySelector('.whatsapp-continuation');link.href='https://wa.me/50370528003?text='+encodeURIComponent(message);link.dataset.placement='enquiry';link.dataset.service=data.service;
 success.querySelector('h3').setAttribute('tabindex','-1');success.querySelector('h3').focus();
 }catch(error){status.textContent=error.message==='409'?t('An enquiry was already received with this reference. Please continue on WhatsApp to update it.','Ya recibimos una consulta con esta referencia. Continúa por WhatsApp para actualizarla.'):t('We could not confirm receipt. Your details are still here. Try again, or contact us directly on WhatsApp.','No pudimos confirmar la recepción. Tus datos siguen aquí. Intenta de nuevo o contáctanos directamente por WhatsApp.');}finally{submitting=false;button.disabled=false;}
});
document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(!a)return;let u;try{u=new URL(a.href);}catch{return;}if(u.hostname==='wa.me')void track('whatsapp_click',a.dataset.service||'other',a.dataset.placement||'guide');if(['airbnb.com','www.airbnb.com'].includes(u.hostname)&&u.pathname.startsWith('/rooms/'))void track('airbnb_click','stay',a.dataset.placement||'guide');});
// Preserve old guest-guide deep links without forcing search visitors into a language redirect.
if(location.pathname==='/'&&['#arrive','#house','#rules','#checkout'].includes(location.hash))location.replace('/guide/'+location.hash);
})();
