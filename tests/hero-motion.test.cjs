const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {runInNewContext} = require('node:vm');
const source = readFileSync(require.resolve('../assets/hero-motion.js'), 'utf8');

// Exercise the actual script with a deterministic clock and DOM events.
class Element {
  constructor(dataset = {}) { this.dataset = dataset; this.attributes = {}; this.events = {}; this.hidden = false; }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, callback) { this.events[key] = callback; }
  fire(key, data = {}) { this.events[key]?.(data); }
  contains() { return false; }
}
async function fixture({reduce = false, saveData = false, decodeFails = false, language = 'en'} = {}) {
  const cover = new Element({scene: 'day'}), controls = new Element(), toggle = new Element();
  controls.hidden = true;
  const buttons = ['day','night'].map(heroScene => new Element({heroScene}));
  const frames = ['day','night'].map(heroFrame => new Element({heroFrame}));
  const traveller = new Element();
  const animations = [];
  traveller.animate = () => {
    const animation = {state: 'running', currentTime: 0,
      play() { this.state = 'running'; }, pause() { this.state = 'paused'; }, cancel() { this.state = 'cancelled'; }};
    animations.push(animation);
    return animation;
  };
  const night = {decode: () => decodeFails ? Promise.reject(Error('Missing image')) : Promise.resolve(), closest: () => frames[1]};
  cover.querySelector = selector => ({'.hero-scene-controls': controls, '[data-hero-motion]': toggle,
    '.hero-night img': night, '.horizon-traveller': traveller})[selector];
  cover.querySelectorAll = selector => ({'[data-hero-scene]': buttons, '[data-hero-frame]': frames,
    img: [{decode: () => Promise.resolve()}, night]})[selector];
  const document = new Element(); document.documentElement = {lang: language}; document.hidden = false;
  document.querySelector = () => cover;
  const reduced = new Element(); reduced.matches = reduce;
  const connection = new Element(); connection.saveData = saveData;
  const window = new Element();
  let observer, now = 0, nextId = 0;
  const timers = new Map();
  window.IntersectionObserver = class {
    constructor(callback) { observer = callback; }
    observe() {}
  };
  runInNewContext(source, {document, window, navigator: {connection}, matchMedia: () => reduced,
    performance: {now: () => now}, IntersectionObserver: window.IntersectionObserver,
    setTimeout: (callback, duration) => { const id = ++nextId; timers.set(id, {at: now + duration, callback}); return id; },
    clearTimeout: id => timers.delete(id)});
  await new Promise(resolve => setImmediate(resolve));
  function visibility(ratio) { observer([{isIntersecting: ratio > 0, intersectionRatio: ratio}]); }
  function advance(milliseconds) {
    const target = now + milliseconds;
    while (true) {
      const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > target) break;
      now = next[1].at; timers.delete(next[0]); next[1].callback();
    }
    now = target;
  }
  visibility(1);
  return {cover, controls, toggle, buttons, frames, reduced, connection, document, window, animations, visibility, advance, timers};
}

test('the photo clock changes both photograph and accessible selection after a full hold', async () => {
  const f = await fixture();
  assert.equal(f.controls.hidden, false);
  f.advance(15999); assert.equal(f.cover.dataset.scene, 'day');
  f.advance(1); assert.equal(f.cover.dataset.scene, 'night');
  assert.equal(f.buttons[1].attributes['aria-pressed'], 'true');
  assert.equal(f.frames[0].attributes['aria-hidden'], 'true');
  assert.equal(f.frames[1].attributes['aria-hidden'], 'false');
  assert.equal(f.timers.size, 1);
  f.advance(16000); assert.equal(f.cover.dataset.scene, 'day');
});

test('scrolling away, hiding the tab and bfcache preserve the remaining hold', async () => {
  const f = await fixture();
  f.advance(6000);
  f.visibility(.1); assert.equal(f.cover.dataset.running, 'false');
  assert.equal(f.animations.at(-1).state, 'paused');
  f.advance(60000); assert.equal(f.cover.dataset.scene, 'day');
  f.visibility(1); f.advance(3000);
  f.document.hidden = true; f.document.fire('visibilitychange');
  f.advance(60000); f.document.hidden = false; f.document.fire('visibilitychange');
  f.advance(3000); f.window.fire('pagehide');
  f.advance(60000); assert.equal(f.timers.size, 0);
  f.window.fire('pageshow'); f.advance(3999); assert.equal(f.cover.dataset.scene, 'day');
  f.advance(1); assert.equal(f.cover.dataset.scene, 'night');
});

test('manual scene selection stops autoplay and the pause button resumes without resetting', async () => {
  const f = await fixture({language: 'es'});
  f.advance(5000); f.toggle.fire('click');
  assert.equal(f.toggle.attributes['aria-label'], 'Reproducir animación de fotos');
  f.advance(60000); f.toggle.fire('click');
  f.advance(10999); assert.equal(f.cover.dataset.scene, 'day');
  f.advance(1); assert.equal(f.cover.dataset.scene, 'night');
  f.buttons[0].fire('click'); f.advance(60000);
  assert.equal(f.cover.dataset.scene, 'day');
  assert.equal(f.cover.dataset.playing, 'false');
  f.toggle.fire('click');
  f.controls.fire('focusin', {target: {matches: () => true}});
  assert.equal(f.cover.dataset.playing, 'false');
});

test('reduced motion and data saver keep manual controls without automatic movement', async () => {
  for (const options of [{reduce: true}, {saveData: true}]) {
    const f = await fixture(options);
    assert.equal(f.toggle.hidden, true);
    assert.equal(f.animations.length, 0);
    f.advance(60000); assert.equal(f.cover.dataset.scene, 'day');
    f.buttons[1].fire('click'); assert.equal(f.cover.dataset.scene, 'night');
    assert.equal(f.timers.size, 0);
  }
  const f = await fixture();
  f.reduced.matches = true; f.reduced.fire('change');
  assert.equal(f.animations.at(-1).state, 'cancelled');
  assert.equal(f.timers.size, 0);
  f.reduced.matches = false; f.reduced.fire('change');
  assert.equal(f.cover.dataset.playing, 'false');
});

test('a missing evening photo leaves daylight visible and hides unavailable controls', async () => {
  const f = await fixture({decodeFails: true});
  assert.equal(f.cover.dataset.scene, 'day');
  assert.equal(f.controls.hidden, true);
  assert.equal(f.frames[1].hidden, true);
  assert.equal(f.frames[0].hidden, false);
  assert.equal(f.timers.size, 0);
});
