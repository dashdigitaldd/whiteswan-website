const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

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
        return new Response(result.body, { status: result.status, headers: { ...privateHeaders, 'Content-Type': 'application/json' } });
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
