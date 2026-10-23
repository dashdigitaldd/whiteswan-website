import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import worker from '../worker.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const token='a'.repeat(64);
const request=(body={token},headers={},method='POST')=>new Request('https://villa.example/api/guest-companion',{method,headers:{Origin:'https://villa.example','Content-Type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(body)}:{})});
test('private guest access is a bounded same-origin service call, never an admin proxy',async()=>{
  let calls=0;
  const result=await worker.fetch(request(),{GUEST_COMPANION:{async fetch(url,init){calls++;assert.equal(url,'https://guest-companion.internal/access');assert.deepEqual(JSON.parse(init.body),{token});assert.equal(init.headers.Authorization,undefined);return Response.json({stay:{firstName:'Example'}});}}});
  assert.equal(result.status,200);assert.equal(calls,1);assert.equal(result.headers.get('cache-control'),'private, no-store');assert.equal(result.headers.get('referrer-policy'),'no-referrer');assert.match(result.headers.get('x-robots-tag'),/noindex/);
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
  const serialized=JSON.stringify(content);assert.ok(!serialized.includes('\u2014'));assert.ok(!serialized.includes('2569999123'));assert.ok(!/sk-ant-|eyJ0eXAi|\+503|password\s*:/i.test(serialized));
  for(const file of ['assets/companion.js','assets/companion.css','guest/index.html'])assert.ok(!readFileSync(root+file,'utf8').includes('\u2014'),file);
});
