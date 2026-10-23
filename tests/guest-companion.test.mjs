import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import worker from '../worker.mjs';
import { wifiPayload, wifiSvg } from '../assets/wifi-code.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const token='a'.repeat(64);
const guest=()=>({stay:{firstName:'Example',arrival:'2026-10-24',departure:'2026-10-27',checkIn:'16:00',checkOut:'12:00',guestCount:4},access:{expiresAt:'2026-10-28T18:00:00.000Z'},property:{name:'White Swan',timeZone:'America/El_Salvador'},now:'2026-10-23T18:00:00.000Z'});
// Synthetic values only. Real guide credentials belong exclusively in a Worker secret.
const privateGuide={wifi:{network:'Example guest network',password:'Synthetic-example-only',security:'WPA'},hosts:[{id:'example-host',name:'Example host',phone:'+15555550100',whatsapp:'15555550100'}]};
const envWith=(response,secret=privateGuide)=>({GUEST_COMPANION:{fetch:async()=>response},GUEST_GUIDE_PRIVATE_JSON:typeof secret==='string'?secret:JSON.stringify(secret)});
const request=(body={token},headers={},method='POST')=>new Request('https://villa.example/api/guest-companion',{method,headers:{Origin:'https://villa.example','Content-Type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(body)}:{})});
test('private guest access is a bounded same-origin service call, never an admin proxy',async()=>{
  let calls=0;
  const result=await worker.fetch(request(),{GUEST_COMPANION:{async fetch(url,init){calls++;assert.equal(url,'https://guest-companion.internal/access');assert.deepEqual(JSON.parse(init.body),{token});assert.equal(init.headers.Authorization,undefined);return Response.json(guest());}}});
  assert.equal(result.status,200);assert.equal(calls,1);assert.equal(result.headers.get('cache-control'),'private, no-store');assert.equal(result.headers.get('referrer-policy'),'no-referrer');assert.match(result.headers.get('x-robots-tag'),/noindex/);
  assert.deepEqual(await result.json(),guest());
});
test('rejects other origins, methods, malformed and oversized tokens before service access',async()=>{
  let calls=0; const env={GUEST_COMPANION:{fetch(){calls++;throw Error();}}};
  for(const [req,status] of [[request({}, {},'GET'),405],[request({token},{Origin:'https://other.example'}),403],[request({token},{Origin:''}),403],[request({token},{'Content-Type':'text/plain'}),400],[request({token:'x'.repeat(43)}),404],[request({token,reservationId:'another'}),404],[request({token:'x'.repeat(600)}),413]]){
    assert.equal((await worker.fetch(req,env)).status,status);
  }
  assert.equal(calls,0);
});
test('upstream unavailable, malformed and missing bindings do not disclose private output',async()=>{
  assert.equal((await worker.fetch(request(),{})).status,503);
  for(const response of [new Response('private debug output',{status:500}),new Response('not JSON',{status:200})]){
    const result=await worker.fetch(request(),{GUEST_COMPANION:{fetch:async()=>response}});
    assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:'stay_unavailable'});
  }
  const expired=await worker.fetch(request(),{GUEST_COMPANION:{fetch:async()=>Response.json({error:'link_unavailable'},{status:404})}});
  assert.equal(expired.status,404);
});
test('only a verified minimal stay receives allowlisted private guide details',async()=>{
  const serviceValue=guest();serviceValue.internalNote='do not forward';serviceValue.stay.email='private@example.test';serviceValue.privateGuide={doorCode:'never forward'};
  const secret=structuredClone(privateGuide);secret.doorCode='never forward';secret.wifi.internalNote='never forward';secret.hosts[0].personalEmail='private@example.test';
  const result=await worker.fetch(request(),envWith(Response.json(serviceValue),secret));
  assert.equal(result.status,200);
  assert.deepEqual(await result.json(),{...guest(),privateGuide});
  assert.equal(result.headers.get('cache-control'),'private, no-store');
  assert.equal(result.headers.get('referrer-policy'),'no-referrer');
});
test('unavailable and malformed service responses never disclose private guide values',async()=>{
  for(const status of [404,503,500]){
    const result=await worker.fetch(request(),envWith(Response.json({...guest(),debug:privateGuide},{status})));
    assert.equal(result.status,status===404?404:503);
    assert.deepEqual(await result.json(),{error:status===404?'link_unavailable':'stay_unavailable'});
    assert.equal(result.headers.get('cache-control'),'private, no-store');
  }
  const badValues=[null,{},[],{stay:{firstName:'Example'}},{...guest(),error:'link_unavailable'}];
  for(const mutate of [v=>v.stay.arrival='2026-02-30',v=>v.stay.departure=v.stay.arrival,v=>v.stay.checkIn='26:00',v=>v.stay.guestCount=-1,v=>v.stay.firstName='x'.repeat(81),v=>v.property.timeZone='UTC',v=>v.access.expiresAt=v.now]){const value=guest();mutate(value);badValues.push(value);}
  for(const value of badValues){
    const result=await worker.fetch(request(),envWith(Response.json(value)));
    assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:'stay_unavailable'});
  }
  for(const body of ['{not-json',JSON.stringify({...guest(),overflow:'x'.repeat(17000)})]){
    const result=await worker.fetch(request(),envWith(new Response(body,{headers:{'Content-Type':'application/json'}})));
    assert.equal(result.status,503);assert.deepEqual(await result.json(),{error:'stay_unavailable'});
  }
});
test('bad private guide configuration cannot break a valid stay or leak unknown fields',async()=>{
  const invalid=[undefined,'{invalid','[]','null','x'.repeat(8193),{doorCode:'no'},
    {wifi:{...privateGuide.wifi,network:'x'.repeat(33)}},
    {wifi:{...privateGuide.wifi,password:'x'.repeat(129)}},
    {wifi:{...privateGuide.wifi,security:'invalid'}},
    {hosts:[{...privateGuide.hosts[0],id:'bad id'}]},
    {hosts:[{...privateGuide.hosts[0],name:'Host\nInjected'}]},
    {hosts:[{...privateGuide.hosts[0],whatsapp:'javascript:bad'}]},
    {hosts:[{...privateGuide.hosts[0],whatsapp:'15555550101'}]},
    {hosts:Array(9).fill(privateGuide.hosts[0])},
  ];
  for(const value of invalid){
    const env=envWith(Response.json(guest()),value);if(value===undefined)delete env.GUEST_GUIDE_PRIVATE_JSON;
    const result=await worker.fetch(request(),env);
    assert.equal(result.status,200);assert.deepEqual(await result.json(),guest());
  }
  const result=await worker.fetch(request(),envWith(Response.json(guest()),{wifi:{...privateGuide.wifi,password:null},hosts:[...privateGuide.hosts,...privateGuide.hosts]}));
  assert.deepEqual((await result.json()).privateGuide,{hosts:privateGuide.hosts});
});
test('private guide data never appears in guest shell or public preview responses',async()=>{
  const env={...envWith(Response.json(guest())),ASSETS:{fetch:async()=>new Response('public-safe guest shell',{headers:{'Content-Type':'text/html'}})}};
  for(const path of ['/guest/','/guest/?preview=1','/guest/?preview=1&token='+token]){
    const result=await worker.fetch(new Request('https://villa.example'+path),env);
    assert.equal(await result.text(),'public-safe guest shell');assert.equal(result.headers.get('cache-control'),'private, no-store');
  }
});
test('verified Wi-Fi details produce a local scanner payload with escaped delimiters and Unicode',async()=>{
  const wifi={network:'Casa; Azul, café',password:'quote"colon:slash\\semi;comma,',security:'WPA'};
  const result=await worker.fetch(request(),envWith(Response.json(guest()),{wifi}));
  const verified=(await result.json()).privateGuide.wifi;
  assert.equal(wifiPayload(verified),'WIFI:T:WPA;S:Casa\\; Azul\\, café;P:quote\\"colon\\:slash\\\\semi\\;comma\\,;;');
  assert.equal(wifiPayload({...wifi,security:'WEP'}).startsWith('WIFI:T:WEP;'),true);
  assert.equal(wifiPayload({network:'Guest network',password:'',security:'nopass'}),'WIFI:T:nopass;S:Guest network;;');
  const svg=wifiSvg(verified);
  assert.match(svg,/^<svg[^>]+viewBox="0 0 \d+ \d+"/);
  assert.match(svg,/<path d="M/);
  assert.ok(!svg.includes(wifi.network));assert.ok(!svg.includes(wifi.password));
  assert.ok(!/<script|<image|<foreignObject|<text|<title|<description|\bhref=|\bon\w+=/i.test(svg));
  // The output is inline geometry only; credentials never enter a QR service URL.
  assert.ok(!svg.includes('WIFI:'));assert.ok(!svg.includes('https://'));
  assert.equal(wifiSvg(verified),svg);
});
test('Wi-Fi encoding rejects malformed input without printing connection values',()=>{
  for(const value of [null,{}, {...privateGuide.wifi,network:'x'.repeat(33)}, {...privateGuide.wifi,network:'é'.repeat(17)}, {...privateGuide.wifi,security:'WPA;S:wrong'}, {...privateGuide.wifi,password:'x'.repeat(129)}, {...privateGuide.wifi,password:''}, {...privateGuide.wifi,network:'Line\nbreak'}]){
    assert.throws(()=>wifiPayload(value),{name:'TypeError',message:'Wi-Fi details are unavailable'});
  }
});
test('guest shell is no-store, noindex and locked to self-hosted assets; existing website remains intact',async()=>{
  const env={ASSETS:{fetch:async()=>new Response('static website',{headers:{'Content-Type':'text/html'}})}};
  const guest=await worker.fetch(new Request('https://villa.example/guest/'),env);
  assert.equal(guest.headers.get('cache-control'),'private, no-store');assert.match(guest.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  const home=await worker.fetch(new Request('https://villa.example/'),env);assert.equal(await home.text(),'static website');assert.equal(home.headers.get('cache-control'),null);
});
test('guest content is bilingual with bounded sections and existing curated photography',()=>{
  const content=JSON.parse(readFileSync(root+'content/guest-companion.json','utf8'));
  const visit=(value)=>{if(!value||typeof value!=='object')return;if('en'in value||'es'in value){assert.ok(value.en);assert.ok(value.es);}Object.values(value).forEach(visit);};visit(content);
  assert.equal(content.timeZone,'America/El_Salvador');assert.equal(content.arrival.timing.checkIn,'16:00');assert.equal(content.arrival.timing.checkOut,'12:00');
  for(const section of ['houseTopics','faqs','checkout','experiences','places']){assert.ok(content[section].length>0);assert.equal(new Set(content[section].map(x=>x.id)).size,content[section].length);}
  for(const item of [...content.experiences,...content.places])if(item.image)assert.ok(existsSync(root+item.image.replace(/^\//,'')),item.image);
  const serialized=JSON.stringify(content);assert.ok(!serialized.includes('\u2014'));assert.ok(!serialized.includes('2569999123'));assert.ok(!/sk-ant-|eyJ0eXAi|"(?:password|wifiPassword|wifiNetwork|ssid)"\s*:/i.test(serialized));
  for(const file of ['assets/companion.js','assets/companion.css','guest/index.html'])assert.ok(!readFileSync(root+file,'utf8').includes('\u2014'),file);
});
