
const NS = 'http://www.w3.org/2000/svg';

const LIGHT_MAP = {
  '#60a5fa': '#1d4ed8', '#3b82f6': '#1d4ed8', '#fb923c': '#c2410c', '#f472b6': '#be185d',
  '#ec4899': '#be185d', '#34d399': '#047857', '#a78bfa': '#9333ea', '#d8b4fe': '#9333ea',
  '#f87171': '#b91c1c', '#fbbf24': '#b45309', '#22d3ee': '#0e7490', '#818cf8': '#4338ca',
  '#ff5a1f': '#d9420b', '#94a3b8': '#64748b', '#9aa5b8': '#4b5563', '#888': '#64748b',
};

export function themed(value) {
  if (typeof document === 'undefined' || document.documentElement.dataset.theme !== 'light') return value;
  return String(value)
    .replace(/#[0-9a-fA-F]{3,6}\b/g, (hex) => LIGHT_MAP[hex.toLowerCase()] || hex)
    .replace(/rgba\(255,\s*255,\s*255,/g, 'rgba(15,20,30,')
    .replace(/rgba\(10,\s*12,\s*17,/g, 'rgba(255,255,255,')
    .replace(/#fff\b/g, '#0d1014');
}

function svgEl(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  Object.keys(attrs || {}).forEach((k) => {
    if (attrs[k] === null || attrs[k] === undefined) return;
    node.setAttribute(k, (k === 'fill' || k === 'stroke') ? themed(attrs[k]) : String(attrs[k]));
  });
  return node;
}

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function toDate(s) {
  const p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function shortDate(s) {
  const d = toDate(s);
  return d.getDate() + '. ' + MONTHS[d.getMonth()];
}

function niceStep(span, targetLines) {
  if (!(span > 0)) return 1;
  const raw = span / Math.max(1, targetLines);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return step * mag;
}

const PAD_TOP = 14;
const PAD_BOTTOM = 20;
const PAD_RIGHT = 10;

function axisWidth(labels) {
  let longest = 0;
  labels.forEach((t) => { longest = Math.max(longest, String(t).length); });
  return Math.min(56, Math.max(26, longest * 7.4 + 8));
}

function makeReadout(wrap) {
  const readout = document.createElement('div');
  readout.className = 'chart-readout';
  const value = document.createElement('strong');
  const when = document.createElement('span');
  readout.appendChild(value);
  readout.appendChild(when);
  wrap.appendChild(readout);
  return { node: readout, value: value, when: when };
}

function observeWidth(holder, draw) {
  if (typeof ResizeObserver === 'function') {
    let lastW = -1;
    const ro = new ResizeObserver(() => {
      const w = Math.round(holder.clientWidth);
      if (w === lastW) return;
      lastW = w;
      draw();
    });
    ro.observe(holder);
    return;
  }
  requestAnimationFrame(draw);
  window.addEventListener('resize', draw);
}

function installScrub(svg, positions, onPick, onRelease) {
  let active = -1;
  function pick(clientX) {
    const box = svg.getBoundingClientRect();
    const x = clientX - box.left;
    let best = 0;
    let bestD = Infinity;
    positions.forEach((px, i) => {
      const d = Math.abs(px - x);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best === active) return;
    active = best;
    onPick(best);
    if (navigator.vibrate) navigator.vibrate(3);
  }
  function release() {
    if (active < 0) return;
    active = -1;
    onRelease();
  }
  svg.addEventListener('pointerdown', (e) => {
    if (svg.setPointerCapture && e.pointerId !== undefined) {
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
    }
    pick(e.clientX);
  });
  svg.addEventListener('pointermove', (e) => {
    if (e.buttons || e.pointerType === 'touch') pick(e.clientX);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => {
    svg.addEventListener(ev, release);
  });
}

export function lineChart(opt) {
  const points = (opt.points || [])
    .filter((p) => p && p.value !== null && p.value !== undefined && isFinite(p.value))
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const fmt = opt.format || ((v) => String(Math.round(v * 10) / 10));
  const height = opt.height || 168;
  const color = opt.color || '#ff5a1f';
  const cmp = opt.compare && (opt.compare.points || []).length >= 2 ? {
    points: opt.compare.points.slice().sort((a, b) => (a.date < b.date ? -1 : 1)),
    color: opt.compare.color || 'rgba(255,255,255,0.55)',
    name: opt.compare.name || 'Vergleich',
  } : null;

  const wrap = document.createElement('div');
  wrap.className = 'chart';
  if (points.length < 2) {
    wrap.classList.add('chart-empty');
    wrap.textContent = points.length
      ? 'Erst ein Messwert – ein Verlauf braucht zwei.'
      : 'Noch keine Messwerte.';
    return wrap;
  }

  const readout = makeReadout(wrap);
  const holder = document.createElement('div');
  holder.className = 'chart-plot';
  wrap.appendChild(holder);

  let cmpValue = null;
  if (cmp) {
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    [[color, opt.label || 'gemessen', false], [cmp.color, cmp.name, true]].forEach((r) => {
      const item = document.createElement('span');
      const dot = document.createElement('i');
      dot.style.background = themed(r[0]);
      item.appendChild(dot);
      item.appendChild(document.createTextNode(r[1]));
      if (r[2]) {
        cmpValue = document.createElement('b');
        item.appendChild(cmpValue);
      }
      legend.appendChild(item);
    });
    wrap.appendChild(legend);
  }

  const last = points[points.length - 1];
  function setReadout(p) {
    readout.value.textContent = fmt(p.value) + (opt.unit ? ' ' + opt.unit : '');
    readout.when.textContent = shortDate(p.date);
    if (cmpValue) {
      const other = cmp.points.filter((q) => q.date === p.date);
      cmpValue.textContent = other.length ? ' ' + fmt(other[0].value) : '';
    }
  }
  setReadout(last);

  function draw() {
    const width = Math.round(holder.clientWidth || wrap.clientWidth || 0);
    if (width < 40) return;
    holder.textContent = '';

    const values = points.map((p) => p.value)
      .concat(cmp ? cmp.points.map((p) => p.value) : []);
    let lo = Math.min.apply(null, values);
    let hi = Math.max.apply(null, values);
    if (opt.zeroBased) lo = Math.min(0, lo);
    if (hi === lo) {
      const pad = Math.max(1, Math.abs(lo) * 0.08);
      hi = lo + pad;
      lo -= pad;
    }
    const step = niceStep(hi - lo, 3);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
    if (hi === lo) hi = lo + step;

    const ticks = [];
    for (let v = lo; v <= hi + step * 0.001; v += step) ticks.push(v);
    const padLeft = axisWidth(ticks.map(fmt));
    const plotW = width - padLeft - PAD_RIGHT;
    const plotH = height - PAD_TOP - PAD_BOTTOM;
    if (plotW < 20) return;

    const t0 = toDate(points[0].date).getTime();
    const t1 = toDate(last.date).getTime();
    const spanT = Math.max(1, t1 - t0);
    const xs = points.map((p) => padLeft + ((toDate(p.date).getTime() - t0) / spanT) * plotW);
    const yOf = (v) => {
      const frac = (v - lo) / (hi - lo);
      return PAD_TOP + (opt.invert ? frac : 1 - frac) * plotH;
    };
    const ys = points.map((p) => yOf(p.value));

    const svg = svgEl('svg', {
      width: width,
      height: height,
      viewBox: '0 0 ' + width + ' ' + height,
      role: 'img',
      'aria-label': (opt.label || 'Verlauf') + ', ' + points.length + ' Messwerte, zuletzt '
        + fmt(last.value) + ' am ' + shortDate(last.date),
    });

    const uid = 'g' + Math.random().toString(36).slice(2, 9);
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', { id: uid, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0', 'stop-color': color, 'stop-opacity': '0.30' }));
    grad.appendChild(svgEl('stop', { offset: '1', 'stop-color': color, 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    const linePath = xs
      .map((x, i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + ys[i].toFixed(1))
      .join(' ');

    const base = opt.invert ? PAD_TOP : PAD_TOP + plotH;
    svg.appendChild(svgEl('path', {
      d: linePath + ' L' + xs[xs.length - 1].toFixed(1) + ' ' + base
        + ' L' + xs[0].toFixed(1) + ' ' + base + ' Z',
      fill: 'url(#' + uid + ')',
      stroke: 'none',
    }));

    ticks.forEach((v) => {
      const y = yOf(v);
      svg.appendChild(svgEl('line', {
        x1: padLeft, y1: y.toFixed(1), x2: padLeft + plotW, y2: y.toFixed(1),
        stroke: 'rgba(255,255,255,0.09)', 'stroke-width': 1,
      }));
      const t = svgEl('text', {
        x: padLeft - 6, y: (y + 3.5).toFixed(1), 'text-anchor': 'end', class: 'chart-axis',
      });
      t.textContent = fmt(v);
      svg.appendChild(t);
    });

    svg.appendChild(svgEl('path', {
      d: linePath, fill: 'none', stroke: color, 'stroke-width': 2.2,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));

    if (cmp) {
      const cxs = cmp.points.map((p) => padLeft
        + ((toDate(p.date).getTime() - t0) / spanT) * plotW);
      svg.appendChild(svgEl('path', {
        d: cxs.map((x, i) => (i ? 'L' : 'M') + x.toFixed(1) + ' '
          + yOf(cmp.points[i].value).toFixed(1)).join(' '),
        fill: 'none', stroke: cmp.color, 'stroke-width': 1.6,
        'stroke-dasharray': '4 3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }));
    }

    if (points.length <= 26) {
      xs.forEach((x, i) => svg.appendChild(svgEl('circle', {
        cx: x.toFixed(1), cy: ys[i].toFixed(1), r: 2.6, fill: color,
      })));
    }
    svg.appendChild(svgEl('circle', {
      cx: xs[xs.length - 1].toFixed(1), cy: ys[ys.length - 1].toFixed(1),
      r: 4.4, fill: color, stroke: 'rgba(10,12,17,0.85)', 'stroke-width': 2,
    }));

    const l0 = svgEl('text', { x: padLeft, y: height - 5, 'text-anchor': 'start', class: 'chart-axis' });
    l0.textContent = shortDate(points[0].date);
    svg.appendChild(l0);
    const l1 = svgEl('text', {
      x: padLeft + plotW, y: height - 5, 'text-anchor': 'end', class: 'chart-axis',
    });
    l1.textContent = shortDate(last.date);
    svg.appendChild(l1);

    const cursor = svgEl('g', { opacity: '0' });
    const cLine = svgEl('line', {
      y1: PAD_TOP, y2: PAD_TOP + plotH, stroke: 'rgba(255,255,255,0.4)',
      'stroke-width': 1, 'stroke-dasharray': '3 3',
    });
    const cDot = svgEl('circle', { r: 5.5, fill: color, stroke: '#fff', 'stroke-width': 2 });
    cursor.appendChild(cLine);
    cursor.appendChild(cDot);
    svg.appendChild(cursor);

    holder.appendChild(svg);

    installScrub(svg, xs, (i) => {
      cLine.setAttribute('x1', xs[i].toFixed(1));
      cLine.setAttribute('x2', xs[i].toFixed(1));
      cDot.setAttribute('cx', xs[i].toFixed(1));
      cDot.setAttribute('cy', ys[i].toFixed(1));
      cursor.setAttribute('opacity', '1');
      readout.node.classList.add('is-scrub');
      setReadout(points[i]);
    }, () => {
      cursor.setAttribute('opacity', '0');
      readout.node.classList.remove('is-scrub');
      setReadout(last);
    });
  }

  observeWidth(holder, draw);
  return wrap;
}

export function barChart(opt) {
  const bars = (opt.bars || []).filter((b) => b && isFinite(b.value));
  const fmt = opt.format || ((v) => String(Math.round(v * 10) / 10));
  const color = opt.color || '#ff5a1f';
  const height = opt.height || 150;

  const wrap = document.createElement('div');
  wrap.className = 'chart';
  if (!bars.length) {
    wrap.classList.add('chart-empty');
    wrap.textContent = 'Noch nichts erfasst.';
    return wrap;
  }

  const readout = makeReadout(wrap);
  const holder = document.createElement('div');
  holder.className = 'chart-plot';
  wrap.appendChild(holder);

  const lastBar = bars[bars.length - 1];
  function setReadout(b) {
    readout.value.textContent = fmt(b.value) + (opt.unit ? ' ' + opt.unit : '');
    readout.when.textContent = b.sub || b.label;
  }
  setReadout(lastBar);

  function draw() {
    const width = Math.round(holder.clientWidth || 0);
    if (width < 40) return;
    holder.textContent = '';

    const hiRaw = Math.max.apply(null, bars.map((b) => b.value));
    const step = niceStep(hiRaw || 1, 2);
    const hi = Math.max(step, Math.ceil((hiRaw || 1) / step) * step);
    const ticks = [];
    for (let v = 0; v <= hi + step * 0.001; v += step) ticks.push(v);

    const padLeft = axisWidth(ticks.map(fmt));
    const plotW = width - padLeft - PAD_RIGHT;
    const plotH = height - PAD_TOP - PAD_BOTTOM;
    if (plotW < 20) return;

    const svg = svgEl('svg', {
      width: width, height: height, viewBox: '0 0 ' + width + ' ' + height,
      role: 'img', 'aria-label': opt.label || 'Balkendiagramm',
    });

    ticks.forEach((v) => {
      const y = PAD_TOP + (1 - v / hi) * plotH;
      svg.appendChild(svgEl('line', {
        x1: padLeft, y1: y.toFixed(1), x2: padLeft + plotW, y2: y.toFixed(1),
        stroke: 'rgba(255,255,255,0.09)', 'stroke-width': 1,
      }));
      const t = svgEl('text', {
        x: padLeft - 6, y: (y + 3.5).toFixed(1), 'text-anchor': 'end', class: 'chart-axis',
      });
      t.textContent = fmt(v);
      svg.appendChild(t);
    });

    const slot = plotW / bars.length;
    const bw = Math.max(4, Math.min(26, slot * 0.62));
    const cx = [];
    const rects = [];
    bars.forEach((b, i) => {
      const h = Math.max(b.value > 0 ? 2 : 0, (b.value / hi) * plotH);
      const x = padLeft + slot * i + (slot - bw) / 2;
      const y = PAD_TOP + plotH - h;
      const r = svgEl('rect', {
        x: x.toFixed(1), y: y.toFixed(1), width: bw.toFixed(1), height: h.toFixed(1),
        rx: Math.min(4, bw / 2), fill: b.color || color, opacity: b.accent ? '1' : '0.55',
      });
      svg.appendChild(r);
      rects.push(r);
      cx.push(x + bw / 2);
      if (bars.length <= 8 || i % 2 === (bars.length - 1) % 2) {
        const t = svgEl('text', {
          x: (x + bw / 2).toFixed(1), y: height - 5, 'text-anchor': 'middle', class: 'chart-axis',
        });
        t.textContent = b.label;
        svg.appendChild(t);
      }
    });

    holder.appendChild(svg);

    const dim = (i) => rects[i].setAttribute('opacity', bars[i].accent ? '1' : '0.55');
    let shown = -1;
    installScrub(svg, cx, (i) => {
      if (shown >= 0) dim(shown);
      shown = i;
      rects[i].setAttribute('opacity', '1');
      readout.node.classList.add('is-scrub');
      setReadout(bars[i]);
    }, () => {
      if (shown >= 0) dim(shown);
      shown = -1;
      readout.node.classList.remove('is-scrub');
      setReadout(lastBar);
    });
  }

  observeWidth(holder, draw);
  return wrap;
}

export function multiBarChart(opt) {
  const labels = opt.labels || [];
  const series = (opt.series || []).filter((s) => s && s.values);
  const fmt = opt.format || ((v) => String(Math.round(v * 10) / 10));
  const height = opt.height || 176;
  const stacked = !!opt.stacked;

  const wrap = document.createElement('div');
  wrap.className = 'chart';
  const total = series.reduce((a, s) => a + s.values.reduce((x, v) => x + (v || 0), 0), 0);
  if (!labels.length || !series.length || !total) {
    wrap.classList.add('chart-empty');
    wrap.textContent = opt.empty || 'Noch nichts erfasst.';
    return wrap;
  }

  const readout = makeReadout(wrap);
  const holder = document.createElement('div');
  holder.className = 'chart-plot';
  wrap.appendChild(holder);

  const legend = document.createElement('div');
  legend.className = 'chart-legend';
  const legendValues = series.map((s) => {
    const item = document.createElement('span');
    const dot = document.createElement('i');
    dot.style.background = themed(s.color);
    const val = document.createElement('b');
    item.appendChild(dot);
    item.appendChild(document.createTextNode(s.name));
    item.appendChild(val);
    legend.appendChild(item);
    return val;
  });
  wrap.appendChild(legend);

  function setReadout(i) {
    const parts = series
      .filter((s) => (s.values[i] || 0) > 0)
      .map((s) => s.name + ' ' + fmt(s.values[i] || 0));
    if (stacked || parts.length > 2) {
      const sum = series.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0);
      readout.value.textContent = sum
        ? fmt(sum) + (opt.unit ? ' ' + opt.unit : '') : '–';
    } else {
      readout.value.textContent = parts.length
        ? parts.join(' · ') + (opt.unit ? ' ' + opt.unit : '') : '–';
    }
    readout.when.textContent = (opt.subs && opt.subs[i]) || labels[i];
    legendValues.forEach((node, si) => {
      const v = series[si].values[i];
      node.textContent = (v === null || v === undefined) ? '' : ' ' + fmt(v);
    });
  }
  setReadout(labels.length - 1);

  function draw() {
    const width = Math.round(holder.clientWidth || 0);
    if (width < 40) return;
    holder.textContent = '';

    let hiRaw = 0;
    labels.forEach((_, i) => {
      const sum = series.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0);
      const max = series.reduce((a, s) => Math.max(a, s.values[i] || 0), 0);
      hiRaw = Math.max(hiRaw, stacked ? sum : max);
    });
    const step = niceStep(hiRaw || 1, 2);
    const hi = Math.max(step, Math.ceil((hiRaw || 1) / step) * step);
    const ticks = [];
    for (let v = 0; v <= hi + step * 0.001; v += step) ticks.push(v);

    const padLeft = axisWidth(ticks.map(fmt));
    const plotW = width - padLeft - PAD_RIGHT;
    const plotH = height - PAD_TOP - PAD_BOTTOM;
    if (plotW < 20) return;

    const svg = svgEl('svg', {
      width: width, height: height, viewBox: '0 0 ' + width + ' ' + height,
      role: 'img', 'aria-label': opt.label || 'Balkendiagramm',
    });

    ticks.forEach((v) => {
      const y = PAD_TOP + (1 - v / hi) * plotH;
      svg.appendChild(svgEl('line', {
        x1: padLeft, y1: y.toFixed(1), x2: padLeft + plotW, y2: y.toFixed(1),
        stroke: 'rgba(255,255,255,0.09)', 'stroke-width': 1,
      }));
      const t = svgEl('text', {
        x: padLeft - 6, y: (y + 3.5).toFixed(1), 'text-anchor': 'end', class: 'chart-axis',
      });
      t.textContent = fmt(v);
      svg.appendChild(t);
    });

    const slot = plotW / labels.length;
    const groupW = Math.max(6, Math.min(30, slot * 0.66));
    const barW = stacked ? groupW : Math.max(3, groupW / series.length - 1.5);
    const cx = [];
    const groups = [];

    labels.forEach((lab, i) => {
      const gx = padLeft + slot * i + (slot - groupW) / 2;
      cx.push(gx + groupW / 2);
      const rects = [];
      if (stacked) {
        let base = PAD_TOP + plotH;
        series.forEach((s) => {
          const v = Math.max(0, s.values[i] || 0);
          if (!v) return;
          const h = (v / hi) * plotH;
          base -= h;
          const r = svgEl('rect', {
            x: gx.toFixed(1), y: base.toFixed(1), width: barW.toFixed(1),
            height: Math.max(1, h).toFixed(1), fill: s.color, opacity: '0.9',
          });
          svg.appendChild(r);
          rects.push(r);
        });
      } else {
        series.forEach((s, si) => {
          const v = Math.max(0, s.values[i] || 0);
          const h = v ? Math.max(2, (v / hi) * plotH) : 0;
          const x = gx + si * (barW + 1.5);
          const r = svgEl('rect', {
            x: x.toFixed(1), y: (PAD_TOP + plotH - h).toFixed(1),
            width: barW.toFixed(1), height: h.toFixed(1),
            rx: Math.min(3, barW / 2), fill: s.color, opacity: '0.9',
          });
          svg.appendChild(r);
          rects.push(r);
        });
      }
      groups.push(rects);
      if (labels.length <= 8 || i % 2 === (labels.length - 1) % 2) {
        const t = svgEl('text', {
          x: (gx + groupW / 2).toFixed(1), y: height - 5,
          'text-anchor': 'middle', class: 'chart-axis',
        });
        t.textContent = lab;
        svg.appendChild(t);
      }
    });

    holder.appendChild(svg);

    const dim = (i) => groups[i].forEach((r) => r.setAttribute('opacity', '0.9'));
    let shown = -1;
    installScrub(svg, cx, (i) => {
      if (shown >= 0) dim(shown);
      shown = i;
      groups[i].forEach((r) => r.setAttribute('opacity', '1'));
      readout.node.classList.add('is-scrub');
      setReadout(i);
    }, () => {
      if (shown >= 0) dim(shown);
      shown = -1;
      readout.node.classList.remove('is-scrub');
      setReadout(labels.length - 1);
    });
  }

  observeWidth(holder, draw);
  return wrap;
}
