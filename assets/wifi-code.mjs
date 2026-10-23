import qrcode from './vendor/qrcode-generator-1.4.4.mjs';

qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

/** Build the standard Wi-Fi QR payload locally. Never place it in a URL. */
export function wifiPayload(wifi) {
  if (!wifi || typeof wifi !== 'object' || typeof wifi.network !== 'string' || !wifi.network.trim() || new TextEncoder().encode(wifi.network).byteLength > 32 || typeof wifi.password !== 'string' || wifi.password.length > 128 || !['WPA', 'WEP', 'nopass'].includes(wifi.security) || (wifi.security !== 'nopass' && !wifi.password.trim()) || /[\u0000-\u001f\u007f]/.test(wifi.network + wifi.password)) {
    throw new TypeError('Wi-Fi details are unavailable');
  }
  const escape = (value) => value.replace(/[\\;,:\"]/g, (character) => '\\' + character);
  const password = wifi.security === 'nopass' ? '' : `P:${escape(wifi.password)};`;
  return `WIFI:T:${wifi.security};S:${escape(wifi.network)};${password};`;
}

/** Return only local SVG geometry, with the standard four-module quiet zone. */
export function wifiSvg(wifi) {
  const qr = qrcode(0, 'M');
  qr.addData(wifiPayload(wifi), 'Byte');
  qr.make();
  return qr.createSvgTag({ cellSize: 5, margin: 20, scalable: true });
}
