const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createVillaFilm} = require('../assets/hero-motion.js');

class Element {
  constructor(dataset={}) { this.dataset=dataset;this.attributes={};this.events={};this.style={}; }
  setAttribute(key,value) { this.attributes[key]=value; }
  getAttribute(key) { return this.attributes[key]??null; }
  addEventListener(key,fn) { (this.events[key]??=[]).push(fn); }
  fire(key,event={}) { this.events[key]?.forEach(fn=>fn(event)); }
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({reduce=false,saveData=false,mobile=false,slow=false,posterReady=true,blocked=false,language='en'}={}) {
  const root=new Element({scene:'day'}), controls=new Element(), play=new Element(), label=new Element(), feedback=new Element();
  const ring=new Element(),number=new Element(),poster=new Element();
  poster.complete=posterReady;poster.naturalWidth=posterReady?1536:0;
  const photos=['day','night'].map(filmPhoto=>new Element({filmPhoto}));
  const frames=['day','night'].map(heroFrame=>new Element({heroFrame}));
  const titles=Array.from({length:5},(_,filmTitle)=>new Element({filmTitle}));
  const chapters=Array.from({length:5},(_,filmChapter)=>{const el=new Element({filmChapter});el.track=new Element();el.querySelector=()=>el.track;return el;});
  const video=new Element({desktop:'/desktop.mp4',mobile:'/mobile.mp4'});
  video.paused=true;video.currentTime=0;video.duration=21.8;video.readyState=0;video.playCalls=0;
  Object.defineProperty(video,'src',{get(){return this.attributes.src;},set(v){this.attributes.src=v;}});
  video.load=()=>{video.loads=(video.loads||0)+1;};
  video.play=()=>{video.playCalls++;if(blocked)return Promise.reject(Object.assign(new Error('Not allowed'),{name:'NotAllowedError'}));video.paused=false;video.ended=false;video.fire('play');return Promise.resolve();};
  video.pause=()=>{if(!video.paused){video.paused=true;video.fire('pause');}};
  root.querySelector=s=>({'video':video,'.film-console':controls,'[data-film-play]':play,'[data-film-play-label]':label,'[data-film-number]':number,'.film-scene-ring':ring,'.film-feedback':feedback,'[data-hero-frame="day"] img':poster})[s];
  root.querySelectorAll=s=>({'[data-film-chapter]':chapters,'[data-film-photo]':photos,'[data-film-title]':titles,'[data-hero-frame]':frames})[s];
  const doc=new Element();doc.documentElement={lang:language};doc.hidden=false;
  const reduced=new Element();reduced.matches=reduce;
  const connection=new Element();connection.saveData=saveData;connection.effectiveType=slow?'3g':'4g';
  const env=new Element();env.document=doc;env.navigator={connection};env.matchMedia=q=>q.includes('reduced')?reduced:{matches:mobile};
  let observer;const idle=[];
  env.IntersectionObserver=class {constructor(fn){observer=fn;}observe(){}};
  env.requestIdleCallback=fn=>{idle.push(fn);return idle.length;};
  createVillaFilm(root,env);
  return {root,controls,play,label,feedback,ring,number,poster,photos,frames,titles,chapters,video,doc,reduced,connection,env,
    visible(ratio=1){observer([{isIntersecting:ratio>0,intersectionRatio:ratio}]);},
    idle(){while(idle.length)idle.shift()();},
    loaded(){video.readyState=4;video.fire('loadedmetadata');video.fire('loadeddata');}};
}

test('autoplay waits for poster, visibility and idle time; picks one responsive source',async()=>{
  const f=fixture({posterReady:false,mobile:true});
  assert.equal(f.video.src,undefined);f.visible();f.idle();assert.equal(f.video.src,undefined);
  f.poster.fire('load');assert.equal(f.video.src,undefined);f.idle();await tick();
  assert.equal(f.video.src,'/mobile.mp4');assert.equal(f.video.loads,1);assert.equal(f.video.muted,true);
  f.loaded();assert.equal(f.root.dataset.mode,'film');assert.equal(f.root.dataset.loaded,'true');
  f.visible(0);f.visible();await tick();assert.equal(f.video.loads,1);
});

test('offscreen, hidden tabs and bfcache pause and resume without losing the place',async()=>{
  const f=fixture();f.visible();f.idle();await tick();f.loaded();f.video.currentTime=7;
  f.visible(.1);assert.equal(f.video.paused,true);f.visible();await tick();assert.equal(f.video.paused,false);
  f.doc.hidden=true;f.doc.fire('visibilitychange');assert.equal(f.video.paused,true);
  f.doc.hidden=false;f.doc.fire('visibilitychange');await tick();assert.equal(f.video.currentTime,7);
  f.env.fire('pagehide');assert.equal(f.video.paused,true);f.env.fire('pageshow');await tick();assert.equal(f.video.paused,false);
});

test('manual pause persists through visibility changes and end never loops',async()=>{
  const f=fixture();f.visible();f.idle();await tick();f.loaded();f.play.fire('click');
  f.visible(0);f.visible();await tick();assert.equal(f.video.paused,true);
  f.play.fire('click');await tick();assert.equal(f.video.paused,false);
  f.video.currentTime=21.8;f.video.paused=true;f.video.ended=true;f.video.fire('ended');
  f.visible(0);f.visible();await tick();assert.equal(f.label.textContent,'Replay film');assert.equal(f.video.paused,true);
  f.play.fire('click');await tick();assert.equal(f.video.currentTime,0);assert.equal(f.video.paused,false);
});

test('reduced motion, data saver and slow connections request no video without an explicit play',async()=>{
  for(const options of [{reduce:true},{saveData:true},{slow:true}]) {
    const f=fixture(options);f.visible();f.idle();assert.equal(f.video.src,undefined);
    f.photos[1].fire('click');assert.equal(f.root.dataset.scene,'night');assert.equal(f.video.src,undefined);
    f.play.fire('click');await tick();assert.equal(f.video.src,'/desktop.mp4');
  }
});

test('a changed motion preference stops playback and returns to the still',async()=>{
  const f=fixture();f.visible();f.idle();await tick();f.reduced.matches=true;f.reduced.fire('change');
  assert.equal(f.video.paused,true);assert.equal(f.root.dataset.mode,'photos');
  f.reduced.matches=false;f.reduced.fire('change');assert.equal(f.video.paused,true);
});

test('chapters seek after metadata, update the title and accessible selection',async()=>{
  const f=fixture({reduce:true,language:'es'});f.visible();f.chapters[3].fire('click');await tick();f.loaded();
  assert.equal(f.video.currentTime,13);assert.equal(f.root.dataset.chapter,'3');
  assert.equal(f.titles[3].dataset.active,'true');assert.equal(f.chapters[3].attributes['aria-pressed'],'true');
  assert.equal(f.label.textContent,'Pausar');f.photos[0].fire('click');assert.equal(f.root.dataset.mode,'photos');
  assert.equal(f.frames[0].attributes['aria-hidden'],'false');assert.equal(f.chapters[3].attributes['aria-pressed'],'false');
});

test('failed media restores the daylight photo and keeps the still controls',async()=>{
  const f=fixture();f.visible();f.idle();await tick();f.video.fire('error');
  assert.equal(f.root.dataset.mode,'photos');assert.equal(f.video.paused,true);assert.equal(f.play.disabled,true);
  assert.equal(f.feedback.hidden,false);f.photos[1].fire('click');assert.equal(f.root.dataset.scene,'night');
});

test('autoplay rejection exposes play without repeated background retries',async()=>{
  const f=fixture({blocked:true});f.visible();f.idle();await tick();assert.equal(f.label.textContent,'Play film');
  const calls=f.video.playCalls;f.visible(0);f.visible();await tick();assert.equal(f.video.playCalls,calls);
});

test('a manual still selection wins over a queued automatic start',async()=>{
  const f=fixture();f.visible();f.photos[1].fire('click');f.idle();await tick();
  assert.equal(f.video.src,undefined);assert.equal(f.root.dataset.scene,'night');
});

test('changing estimated network speed does not interrupt an explicitly started film',async()=>{
  const f=fixture({slow:true});f.visible();f.play.fire('click');await tick();f.loaded();
  f.connection.fire('change');assert.equal(f.root.dataset.mode,'film');assert.equal(f.video.paused,false);
  f.connection.saveData=true;f.connection.fire('change');assert.equal(f.root.dataset.mode,'photos');assert.equal(f.video.paused,true);
});
