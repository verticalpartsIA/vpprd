/* ============================================================
   utils.js — utilitários globais sem dados de demonstração
   ============================================================ */

window.csvDownload = function(rows, filename) {
  if (!rows || !rows.length) return window.toast('Nenhum dado para exportar.', 'warning');
  const keys = Object.keys(rows[0]);
  const esc  = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv  = [keys.map(esc).join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  window.toast('CSV exportado: ' + filename, 'success');
};
