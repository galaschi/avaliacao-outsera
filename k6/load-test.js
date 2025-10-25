import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: __ENV.VUS ? parseInt(__ENV.VUS, 10) : 25,         
  duration: __ENV.DURATION || '30s',                     
  thresholds: {
    http_req_failed: ['rate<0.01'],                       
    http_req_duration: ['p(95)<800', 'p(99)<1200'],       
    checks: ['rate>0.99'],                                
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://test-api.k6.io';

export default function () {
  const params = { headers: { Accept: 'application/json' } };
  const res = http.get(`${BASE_URL}/public/crocodiles/`, params);

  const STRICT = /^1|true$/i.test(__ENV.STRICT || '');
  if (STRICT) {
    const contentType = (res.headers['Content-Type'] || res.headers['content-type'] || '').toLowerCase();
    let parsed; let isArray = false;
    try { parsed = res.json(); isArray = Array.isArray(parsed); } catch (_) { isArray = false; }
    check(res, {
      'status 200': () => res.status === 200,
      'content-type json': () => contentType.includes('application/json'),
      'JSON válido (array)': () => isArray,
      'tem itens': () => isArray && parsed.length > 0,
    });
  } else {
    check(res, { 'status 200': () => res.status === 200 });
  }

  sleep(0.3);
}

export function handleSummary(data) {
  const m = data.metrics || {};
  const get = (name, key) => (m[name] && m[name].values && (m[name].values[key] ?? m[name].values["p(95)"])) ?? 'n/a';
  const checksOk = m.checks && m.checks.thresholds && m.checks.thresholds['rate>0.99'] ? m.checks.thresholds['rate>0.99'].ok : undefined;
  const httpOk = m.http_req_failed && m.http_req_failed.thresholds && m.http_req_failed.thresholds['rate<0.01'] ? m.http_req_failed.thresholds['rate<0.01'].ok : undefined;
  const dur95Ok = m.http_req_duration && m.http_req_duration.thresholds && m.http_req_duration.thresholds['p(95)<800'] ? m.http_req_duration.thresholds['p(95)<800'].ok : undefined;
  const dur99Ok = m.http_req_duration && m.http_req_duration.thresholds && m.http_req_duration.thresholds['p(99)<1200'] ? m.http_req_duration.thresholds['p(99)<1200'].ok : undefined;

  const html = `<!doctype html>
  <html lang="pt-BR"><head><meta charset="utf-8"><title>k6 summary</title>
  <style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;background:#f6f7fb;padding:24px} .card{background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.08);padding:20px;margin:0 auto;max-width:900px}
  h1{margin:0 0 12px} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
  .kpi{background:#fafbfe;border:1px solid #edf0f7;border-radius:10px;padding:14px}
  .ok{color:#0a7f2e} .bad{color:#b00020}
  code{background:#f1f3f8;padding:2px 6px;border-radius:6px}
  </style></head><body>
  <div class="card">
    <h1>Resumo do teste de carga (k6)</h1>
    <div>Data: ${new Date().toLocaleString('pt-BR')}</div>
    <div class="grid">
      <div class="kpi"><strong>Iterações</strong><div>${get('iterations','count')}</div></div>
      <div class="kpi"><strong>Requests</strong><div>${get('http_reqs','count')}</div></div>
      <div class="kpi"><strong>Falhas (rate)</strong><div>${(m.http_req_failed?.values?.rate ?? 0).toFixed ? (m.http_req_failed.values.rate*100).toFixed(3)+'%' : m.http_req_failed?.values?.rate}</div><div class="${httpOk===false?'bad':'ok'}">threshold: http_req_failed &lt; 1% ${httpOk===false?'(NOK)':'(OK)'}</div></div>
      <div class="kpi"><strong>Latência p95</strong><div>${get('http_req_duration','p(95)')} ms</div><div class="${dur95Ok===false?'bad':'ok'}">threshold: p95 &lt; 800ms ${dur95Ok===false?'(NOK)':'(OK)'}</div></div>
      <div class="kpi"><strong>Latência p99</strong><div>${get('http_req_duration','p(99)')} ms</div><div class="${dur99Ok===false?'bad':'ok'}">threshold: p99 &lt; 1200ms ${dur99Ok===false?'(NOK)':'(OK)'}</div></div>
      <div class="kpi"><strong>Checks</strong><div>${m.checks?.values?.passes ?? 0} passed / ${m.checks?.values?.fails ?? 0} failed</div><div class="${checksOk===false?'bad':'ok'}">threshold: checks &gt; 99% ${checksOk===false?'(NOK)':'(OK)'}</div></div>
    </div>
    <p style="margin-top:16px">Arquivo JSON completo disponível em <code>test-results/k6-summary.json</code>.</p>
  </div></body></html>`;

  return {
    'test-results/k6-summary.html': html,
    'test-results/k6-summary.json': JSON.stringify(data, null, 2),
  };
}
