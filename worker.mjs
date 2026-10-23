const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max, allowEmpty = false) => typeof value === 'string' && value.length <= max && (allowEmpty || value.trim().length > 0) && !/[\u0000-\u001f\u007f]/.test(value);
const civilDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const timestamp = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const clock = (value) => value === null || (typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value));

async function readBoundedJSON(stream, maxBytes) {
  const reader = stream?.getReader();
  if (!reader) throw new Error('invalid_response');
  const chunks = []; let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) { await reader.cancel(); throw new Error('invalid_response'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let at = 0;
  for (const part of chunks) { bytes.set(part, at); at += part.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Do not forward new private service fields by accident. This is the complete
// guest-facing stay contract, not a pass-through of an internal response.
function guestProjection(value) {
  if (!record(value) || 'error' in value || !record(value.stay) || !record(value.access) || !record(value.property)) return null;
  const { stay, access, property, now } = value;
  if (!text(stay.firstName, 80, true) || !civilDate(stay.arrival) || !civilDate(stay.departure) || stay.departure <= stay.arrival || !clock(stay.checkIn) || !clock(stay.checkOut)) return null;
  if (stay.guestCount !== null && (!Number.isSafeInteger(stay.guestCount) || stay.guestCount < 0 || stay.guestCount > 100)) return null;
  if (!timestamp(access.expiresAt) || !timestamp(now) || access.expiresAt <= now || property.name !== 'White Swan' || property.timeZone !== 'America/El_Salvador') return null;
  return {
    stay: { firstName: stay.firstName, arrival: stay.arrival, departure: stay.departure, checkIn: stay.checkIn, checkOut: stay.checkOut, guestCount: stay.guestCount },
    access: { expiresAt: access.expiresAt },
    property: { name: 'White Swan', timeZone: 'America/El_Salvador' },
    now,
  };
}

// The owner permits these details inside a verified private stay only. The
// actual values are a Worker secret, never static assets or preview content.
function privateGuideProjection(raw) {
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).byteLength > 8192) return null;
  try {
    const value = JSON.parse(raw);
    if (!record(value)) return null;
    const guide = {};
    const wifi = value.wifi;
    if (record(wifi) && text(wifi.network, 128) && new TextEncoder().encode(wifi.network).byteLength <= 32 && ['WPA', 'WEP', 'nopass'].includes(wifi.security) && text(wifi.password, 128, wifi.security === 'nopass')) {
      guide.wifi = { network: wifi.network, password: wifi.security === 'nopass' ? '' : wifi.password, security: wifi.security };
    }
    if (Array.isArray(value.hosts) && value.hosts.length <= 8) {
      const ids = new Set();
      const hosts = value.hosts.filter((host) => {
        if (!record(host) || typeof host.id !== 'string' || !/^[a-z][a-z0-9-]{0,39}$/.test(host.id) || ids.has(host.id) || !text(host.name, 80) || typeof host.phone !== 'string' || !/^\+[1-9]\d{6,14}$/.test(host.phone) || typeof host.whatsapp !== 'string' || !/^[1-9]\d{6,14}$/.test(host.whatsapp) || host.phone.slice(1) !== host.whatsapp) return false;
        ids.add(host.id);
        return true;
      }).map(({ id, name, phone, whatsapp }) => ({ id, name, phone, whatsapp }));
      if (hosts.length) guide.hosts = hosts;
    }
    return Object.keys(guide).length ? guide : null;
  } catch { return null; }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/guest-companion') {
      const fail = (error, status) => Response.json({ error }, { status, headers: privateHeaders });
      if (request.method !== 'POST') return fail('method_not_allowed', 405);
      if (request.headers.get('Origin') !== url.origin) return fail('not_allowed', 403);
      if (!request.headers.get('Content-Type')?.startsWith('application/json')) return fail('invalid_request', 400);
      if (Number(request.headers.get('Content-Length') || 0) > 512) return fail('invalid_request', 413);
      const reader = request.body?.getReader();
      if (!reader) return fail('invalid_request', 400);
      const chunks = []; let length = 0;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 512) { await reader.cancel(); return fail('invalid_request', 413); }
          chunks.push(value);
        }
        const bytes = new Uint8Array(length); let at = 0;
        for (const part of chunks) { bytes.set(part, at); at += part.length; }
        const body = JSON.parse(new TextDecoder().decode(bytes));
        if (!body || typeof body.token !== 'string' || !/^[a-f0-9]{64}$/.test(body.token) || Object.keys(body).length !== 1)
          return fail('link_unavailable', 404);
        if (!env.GUEST_COMPANION) return fail('stay_unavailable', 503);
        const result = await env.GUEST_COMPANION.fetch('https://guest-companion.internal/access', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: body.token }), signal: AbortSignal.timeout(10000),
        });
        if (![200, 404, 503].includes(result.status)) return fail('stay_unavailable', 503);
        if (!result.headers.get('Content-Type')?.includes('application/json')) return fail('stay_unavailable', 503);
        // Error payloads never gain private guide data or expose service debug fields.
        if (result.status !== 200) {
          await result.body?.cancel();
          return fail(result.status === 404 ? 'link_unavailable' : 'stay_unavailable', result.status);
        }
        const guest = guestProjection(await readBoundedJSON(result.body, 16384));
        if (!guest) return fail('stay_unavailable', 503);
        const privateGuide = privateGuideProjection(env.GUEST_GUIDE_PRIVATE_JSON);
        if (privateGuide) guest.privateGuide = privateGuide;
        return Response.json(guest, { headers: privateHeaders });
      } catch { return fail('stay_unavailable', 503); }
    }
    const result = await env.ASSETS.fetch(request);
    if (url.pathname.startsWith('/guest/') || url.pathname === '/guest') {
      const headers = new Headers(result.headers);
      for (const [name, value] of Object.entries(privateHeaders)) headers.set(name, value);
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
      headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      return new Response(result.body, { status: result.status, headers });
    }
    return result;
  },
};
