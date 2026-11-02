// Tiny SVG helpers shared by the blog posts (no external libraries).
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function txt(parent, x, y, s, attrs = {}) {
  const t = el('text', Object.assign({ x, y, 'font-size': 12, fill: '#52514e' }, attrs), parent);
  t.textContent = s; return t;
}
function scale(d0, d1, r0, r1) { const f = v => r0 + (v - d0) / (d1 - d0) * (r1 - r0); f.inv = p => d0 + (p - r0) / (r1 - r0) * (d1 - d0); return f; }
function niceTicks(lo, hi, n = 5) {
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n) || mag * 10;
  const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}
function svgRoot(container, w, h) {
  container.innerHTML = '';
  return el('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img' }, container);
}
// Shared tooltip
const tip = (() => { const d = document.createElement('div'); d.className = 'tip'; document.addEventListener('DOMContentLoaded', () => document.body.appendChild(d)); return d; })();
function showTip(evt, html) {
  tip.innerHTML = html; tip.style.opacity = 1;
  const pad = 14, r = tip.getBoundingClientRect();
  let x = evt.clientX + pad, y = evt.clientY + pad;
  if (x + r.width > innerWidth - 8) x = evt.clientX - r.width - pad;
  if (y + r.height > innerHeight - 8) y = evt.clientY - r.height - pad;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
function hideTip() { tip.style.opacity = 0; }
function hover(node, htmlFn) {
  node.style.cursor = 'default';
  node.addEventListener('mousemove', e => showTip(e, htmlFn()));
  node.addEventListener('mouseleave', hideTip);
  node.addEventListener('touchstart', e => showTip(e.touches[0], htmlFn()), { passive: true });
}
function seg(container, options, initial, onChange) {
  container.innerHTML = '';
  options.forEach(([val, label]) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
    if (val === initial) b.classList.add('on');
    b.onclick = () => { [...container.children].forEach(c => c.classList.remove('on')); b.classList.add('on'); onChange(val); };
    container.appendChild(b);
  });
}
// Rounded-top bar path anchored to baseline
function barPath(x, y0, w, y1, r = 4) {
  const top = Math.min(y0, y1), bot = Math.max(y0, y1), h = bot - top; r = Math.min(r, w / 2, h);
  if (y1 <= y0) return `M${x},${bot}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bot}Z`;
  return `M${x},${top}V${bot - r}Q${x},${bot} ${x + r},${bot}H${x + w - r}Q${x + w},${bot} ${x + w},${bot - r}V${top}Z`;
}
