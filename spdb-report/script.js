(function () {
  'use strict';
  function drawPriceChart() {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 320 * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = 320;
    const data = [
      { date: '04-16', close: 117.04, change: -1.08 },
      { date: '04-17', close: 95.81, change: -0.22 },
      { date: '04-18', close: 13.51, change: +0.29 }
    ];
    const prices = data.map(d => d.close);
    const minP = Math.min(...prices) * 0.95;
    const maxP = Math.max(...prices) * 1.05;
    const pad = { top: 40, right: 30, bottom: 50, left: 70 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    function x(i) { return pad.left + (i / (data.length - 1)) * cW; }
    function y(v) { return pad.top + (1 - (v - minP) / (maxP - minP)) * cH; }
    ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const yy = pad.top + (i / 4) * cH;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
      const val = maxP - (i / 4) * (maxP - minP);
      ctx.fillStyle = '#999'; ctx.font = '12px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(2), pad.left - 8, yy + 4);
    }
    ctx.textAlign = 'center';
    data.forEach((d, i) => { ctx.fillStyle = '#666'; ctx.fillText(d.date, x(i), H - pad.bottom + 24); });
    ctx.beginPath();
    ctx.moveTo(x(0), y(data[0].close));
    data.forEach((d, i) => { if (i > 0) ctx.lineTo(x(i), y(d.close)); });
    ctx.lineTo(x(data.length - 1), pad.top + cH); ctx.lineTo(x(0), pad.top + cH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + cH);
    grad.addColorStop(0, 'rgba(26,115,232,0.15)');
    grad.addColorStop(1, 'rgba(26,115,232,0.01)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x(0), y(data[0].close));
    data.forEach((d, i) => { if (i > 0) ctx.lineTo(x(i), y(d.close)); });
    ctx.strokeStyle = '#1a73e8'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
    data.forEach((d, i) => {
      ctx.beginPath(); ctx.arc(x(i), y(d.close), 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#1a73e8'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = d.change >= 0 ? '#d93025' : '#188038';
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(d.close.toFixed(2), x(i), y(d.close) - 14);
    });
    data.forEach((d, i) => {
      if (i === 0) return;
      ctx.fillStyle = d.change >= 0 ? '#d93025' : '#188038';
      ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      const sign = d.change >= 0 ? '+' : '';
      ctx.fillText(sign + d.change.toFixed(2) + '%', x(i), y(d.close) - 30);
    });
  }
  function drawVolumeChart() {
    const canvas = document.getElementById('volumeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = 200;
    const data = [
      { date: '04-16', vol: 5371550 },
      { date: '04-17', vol: 20061153 },
      { date: '04-18', vol: 52202459 }
    ];
    const maxV = Math.max(...data.map(d => d.vol)) * 1.15;
    const pad = { top: 30, right: 30, bottom: 40, left: 70 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    const barW = Math.min(cW / data.length * 0.5, 60);
    ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const yy = pad.top + (i / 3) * cH;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
      const val = maxV - (i / 3) * maxV;
      ctx.fillStyle = '#999'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((val / 10000).toFixed(0) + '万', pad.left - 8, yy + 4);
    }
    const colors = ['#90caf9', '#42a5f5', '#1a73e8'];
    data.forEach((d, i) => {
      const bx = pad.left + (i + 0.5) * (cW / data.length) - barW / 2;
      const bh = (d.vol / maxV) * cH;
      const by = pad.top + cH - bh;
      const r = 4;
      const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
      grad.addColorStop(0, colors[i]);
      grad.addColorStop(1, colors[i] + '88');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(bx + r, by); ctx.lineTo(bx + barW - r, by);
      ctx.quadraticCurveTo(bx + barW, by, bx + barW, by + r);
      ctx.lineTo(bx + barW, by + bh); ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx, by + r); ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.fill();
      ctx.fillStyle = '#333'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText((d.vol / 10000).toFixed(0) + '万', bx + barW / 2, by - 8);
      ctx.fillStyle = '#666'; ctx.font = '11px sans-serif';
      ctx.fillText(d.date, bx + barW / 2, H - pad.bottom + 20);
    });
  }
  function drawFlowGauge() {
    const canvas = document.getElementById('flowGauge');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 160 * dpr; canvas.height = 100 * dpr;
    ctx.scale(dpr, dpr);
    const W = 160, H = 100, cx = W / 2, cy = H - 10, r = 60;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.stroke();
    const ratio = 0.78;
    const endAngle = Math.PI + ratio * Math.PI;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, endAngle, false);
    const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    grad.addColorStop(0, '#43a047'); grad.addColorStop(1, '#d93025');
    ctx.strokeStyle = grad; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.stroke();
    ctx.fillStyle = '#d93025'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('+', cx - 18, cy - 12); ctx.fillStyle = '#333';
    ctx.fillText('78%', cx + 10, cy - 12); ctx.fillStyle = '#999';
    ctx.font = '12px sans-serif'; ctx.fillText('资金净流入比', cx, cy + 8);
  }
  function animateValue(el, target, prefix, suffix, duration) {
    const start = 0; const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      if (typeof target === 'number' && target % 1 !== 0) {
        el.textContent = prefix + current.toFixed(2) + suffix;
      } else {
        el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initAnimations() {
    document.querySelectorAll('[data-animate]').forEach(el => {
      const target = parseFloat(el.dataset.animate);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      animateValue(el, target, prefix, suffix, 1200);
    });
  }
  window.addEventListener('DOMContentLoaded', function () {
    drawPriceChart(); drawVolumeChart(); drawFlowGauge(); initAnimations();
  });
  window.addEventListener('resize', function () {
    drawPriceChart(); drawVolumeChart();
  });
})();