/* ============================================================
   desenho-tecnico.jsx — Desenho Técnico ER|ES (Configurador)
   Porte fiel do artefato Claude Designer (engine + elevação cotada +
   controles + ficha técnica), embarcado como página do VP Gestão.
   Tudo dentro de <div className="vpdt theme-…"> (CSS escopado).
   ============================================================ */

/* ---------- ENGINE (geometria + cálculos) — window.VPEngine ---------- */
(function () {
  const DEG = Math.PI / 180;
  const DRIVES = {
    ER: [
      { id: "DD220",  label: "VP Direct-Drive 22.0",  code: "DD220", kw: 22.0, eff: 0.93, note: "Acionamento direto sem caixa" },
      { id: "SOG150", label: "VP SOG-15.0",           code: "SOG15", kw: 15.0, eff: 0.90, note: "Sem-fim/coroa, alto torque" },
      { id: "MOD110", label: "VP Modular-11.0",        code: "MOD11", kw: 11.0, eff: 0.91, note: "Modular, manutenção rápida" },
    ],
    MW: [
      { id: "FLT075", label: "VP Flat-Drive 7.5",     code: "FLT75", kw: 7.5,  eff: 0.92, note: "Esteiras horizontais" },
      { id: "SOG110", label: "VP SOG-11.0",           code: "SOG11", kw: 11.0, eff: 0.90, note: "Inclinadas até 12°" },
      { id: "DD150",  label: "VP Direct-Drive 15.0",  code: "DD150", kw: 15.0, eff: 0.93, note: "Vãos longos, alto fluxo" },
    ],
  };
  const ESM = [
    { id: "STB", label: "Standby (parada total)", code: "STB", factor: 0.55, desc: "Para quando não há fluxo. Maior economia." },
    { id: "RED", label: "Velocidade reduzida",    code: "RED", factor: 0.78, desc: "Reduz a 0,2 m/s em ocioso." },
    { id: "OFF", label: "Sempre ativo (sem ESM)", code: "OFF", factor: 1.00, desc: "Operação contínua à velocidade nominal." },
  ];
  const FINISH = {
    ER: [
      { id: "GLS", label: "Balaustrada de vidro temperado", code: "GLS", glass: true,  desc: "Vidro 10mm, perfil inox" },
      { id: "INX", label: "Balaustrada inox escovado",       code: "INX", glass: false, desc: "Painéis AISI 304 escovado" },
      { id: "MIX", label: "Inox + faixa de vidro",           code: "MIX", glass: true,  desc: "Estrutura inox, painel central vidro" },
    ],
    MW: [
      { id: "GLS", label: "Balaustrada de vidro temperado", code: "GLS", glass: true,  desc: "Vidro 10mm, perfil inox" },
      { id: "INX", label: "Balaustrada inox escovado",       code: "INX", glass: false, desc: "Painéis AISI 304 escovado" },
      { id: "LOW", label: "Guarda baixa (terminal)",         code: "LOW", glass: true,  desc: "Aplicações de aeroporto" },
    ],
  };
  const WIDTHS = { ER: [600, 800, 1000], MW: [800, 1000, 1200, 1400] };
  const SPEEDS = [0.5, 0.65, 0.75];
  const BOUNDS = {
    ER: { angle: [27.3, 35], rise: [1000, 12000], primary: "rise" },
    MW: { angle: [0, 12], span: [4000, 120000], primary: "span" },
  };
  const round = (n, p = 0) => { const f = Math.pow(10, p); return Math.round(n * f) / f; };
  function fmt(n, dec = 0) { return n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function pad(n, len) { return String(Math.round(n)).padStart(len, "0"); }
  function landings(speed) { if (speed <= 0.5) return 2400; if (speed <= 0.65) return 2800; return 3200; }

  function compute(cfg) {
    const isER = cfg.product === "ER";
    const a = cfg.angle * DEG;
    const land = landings(cfg.speed);
    let rise, run;
    if (isER) { rise = cfg.rise; run = cfg.angle <= 0.001 ? 0 : rise / Math.tan(a); }
    else { run = cfg.span; rise = run * Math.tan(a); }
    const incline = cfg.angle <= 0.001 ? run : (isER ? rise / Math.sin(a) : run / Math.cos(a));
    const totalLen = run + land * 2;
    const trussDepth = 1100 + (isER ? 0 : 300);
    const pit = isER ? 1300 : 900;
    const wFactorMap = { 600: 4500, 800: 6750, 1000: 9000, 1200: 11000, 1400: 13000 };
    const wf = wFactorMap[cfg.width] || (cfg.width * 9);
    const capacity = Math.round(wf * (cfg.speed / 0.5) / 100) * 100;
    const stepDepth = isER ? 400 : 600;
    const units = Math.max(0, Math.round(incline / stepDepth));
    const drive = (DRIVES[cfg.product].find(d => d.id === cfg.drive)) || DRIVES[cfg.product][0];
    const esm = ESM.find(e => e.id === cfg.esm) || ESM[0];
    const baseLoadKw = ((rise / 1000) * (cfg.width / 1000) * 1.9 + (run / 1000) * (cfg.width / 1000) * 0.42) * (cfg.speed / 0.5);
    const ratedKw = Math.min(drive.kw, Math.max(3.0, baseLoadKw / drive.eff));
    const avgKw = ratedKw * esm.factor;
    const annualKwh = Math.round(avgKw * 14 * 312);
    const weight = Math.round((incline / 1000) * 860 + land * 2 / 1000 * 540 + trussDepth / 1000 * 380);
    const widthCode = pad(cfg.width, 4);
    const primaryCode = isER ? pad(rise, 5) : pad(run, 5);
    const angleCode = String(round(cfg.angle, 0)).padStart(2, "0");
    const sku = [
      "VP", cfg.product, angleCode, widthCode, primaryCode,
      drive.code, esm.code, (FINISH[cfg.product].find(f => f.id === cfg.finish) || FINISH[cfg.product][0]).code,
      "S" + String(Math.round(cfg.speed * 100))
    ].join("-");
    return {
      isER, rise, run, incline, totalLen, trussDepth, pit, capacity, units, stepDepth,
      ratedKw, avgKw, annualKwh, weight, drive, esm, sku,
      finish: FINISH[cfg.product].find(f => f.id === cfg.finish) || FINISH[cfg.product][0],
    };
  }
  function oem(cfg) {
    const er = [
      { brand: "Atlas Schindler", model: "9300 / 9700", match: cfg.width >= 800 },
      { brand: "Otis", model: "NCE / 606", match: cfg.angle <= 30.5 },
      { brand: "KONE", model: "TransitMaster 120", match: cfg.width >= 800 },
      { brand: "Thyssen", model: "Velino / Tugela", match: true },
    ];
    const mw = [
      { brand: "Atlas Schindler", model: "Walkway 9500", match: cfg.angle <= 6 },
      { brand: "Otis", model: "Tube / NCT", match: true },
      { brand: "KONE", model: "TravelMaster 110", match: cfg.width >= 1000 },
      { brand: "Thyssen", model: "Orinoco-class", match: cfg.angle >= 10 },
    ];
    return (cfg.product === "ER" ? er : mw);
  }
  window.VPEngine = { DEG, DRIVES, ESM, FINISH, WIDTHS, SPEEDS, BOUNDS, compute, oem, fmt, round, landings };
})();

/* ---------- PREVIEW (elevação lateral cotada — SVG) ---------- */
const VPPreview = ({ cfg, calc, theme }) => {
  const VB_W = 1180, VB_H = 660, PAD = 96;
  const land = window.VPEngine.landings(cfg.speed);
  const { rise, run, trussDepth, pit } = calc;
  const x0 = 0, xL1 = land, xL2 = land + run, xL3 = land + run + land;
  const balH = 1000;
  const surf = [[x0, 0], [xL1, 0], [xL2, rise], [xL3, rise]];
  const balTop = surf.map(([x, y]) => [x, y + balH]);
  const trussBot = [[x0, -pit], [xL1, -pit], [xL1, 0 - trussDepth], [xL2, rise - trussDepth], [xL2, rise - pit], [xL3, rise - pit]];
  const allPts = [...surf, ...balTop, ...trussBot, [x0, -pit - 700], [xL3, rise + balH + 200], [xL3 + 1700, rise]];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  allPts.forEach(([x, y]) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
  const bw = maxX - minX, bh = maxY - minY;
  const scale = Math.min((VB_W - PAD * 2) / bw, (VB_H - PAD * 2) / bh);
  const offX = (VB_W - bw * scale) / 2 - minX * scale;
  const offY = (VB_H - bh * scale) / 2 + maxY * scale;
  const P = (x, y) => [offX + x * scale, offY - y * scale];
  const path = (pts, close) => pts.map((p, i) => (i ? "L" : "M") + P(p[0], p[1]).join(" ")).join(" ") + (close ? " Z" : "");
  const isDark = theme !== "paper";
  const col = {
    structure: isDark ? "#E8E8E8" : "#0E0E0E",
    secondary: "#8A8A8A",
    accent: "#FFD400",
    glass: isDark ? "rgba(255,212,0,0.10)" : "rgba(14,14,14,0.05)",
    dim: isDark ? "#FFD400" : "#0E0E0E",
    dimText: isDark ? "#FFD400" : "#0E0E0E",
    grid: isDark ? "#1E1E1E" : "#ECECE6",
  };
  const stepEls = [];
  const n = Math.max(1, Math.min(60, Math.round(Math.hypot(xL2 - xL1, rise) / calc.stepDepth)));
  if (cfg.angle > 0.2 || cfg.product === "MW") {
    const dirx = (xL2 - xL1) / n, diry = (rise - 0) / n;
    for (let i = 0; i < n; i++) {
      const [sx, sy] = P(xL1 + dirx * i, 0 + diry * i), [ex, ey] = P(xL1 + dirx * (i + 1), 0 + diry * (i + 1));
      stepEls.push(<line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke={col.structure} strokeWidth={cfg.product === "ER" ? 1 : 0.6} opacity={cfg.product === "ER" ? 0.5 : 0.3} />);
      if (cfg.product === "ER") stepEls.push(<line key={"r" + i} x1={ex} y1={ey} x2={ex} y2={ey + 6} stroke={col.structure} strokeWidth={1} opacity={0.4} />);
    }
  }
  function vDim(xWorld, y1World, y2World, label, side = 1) {
    const [x, ya] = P(xWorld, y1World); const [, yb] = P(xWorld, y2World); const tx = x + 18 * side;
    return (<g>
      <line x1={x} y1={ya} x2={tx} y2={ya} stroke={col.dim} strokeWidth={1} />
      <line x1={x} y1={yb} x2={tx} y2={yb} stroke={col.dim} strokeWidth={1} />
      <line x1={tx} y1={ya} x2={tx} y2={yb} stroke={col.dim} strokeWidth={1.25} markerStart="url(#arr)" markerEnd="url(#arr)" />
      <g transform={`translate(${tx + 8 * side}, ${(ya + yb) / 2}) rotate(-90)`}>
        <text textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)" fontSize="15" fontWeight="700" fill={col.dimText}>{label}</text>
      </g>
    </g>);
  }
  function hDim(x1World, x2World, yWorld, label, drop = 34) {
    const [xa, y] = P(x1World, yWorld); const [xb] = P(x2World, yWorld); const ty = y + drop;
    return (<g>
      <line x1={xa} y1={y} x2={xa} y2={ty} stroke={col.dim} strokeWidth={1} />
      <line x1={xb} y1={y} x2={xb} y2={ty} stroke={col.dim} strokeWidth={1} />
      <line x1={xa} y1={ty} x2={xb} y2={ty} stroke={col.dim} strokeWidth={1.25} markerStart="url(#arr)" markerEnd="url(#arr)" />
      <rect x={(xa + xb) / 2 - 46} y={ty - 11} width="92" height="22" fill={isDark ? "#0E0E0E" : "#FAFAF7"} />
      <text x={(xa + xb) / 2} y={ty + 1} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)" fontSize="15" fontWeight="700" fill={col.dimText}>{label}</text>
    </g>);
  }
  const [cx, cy] = P(xL1, 0); const arcR = 60; const aRad = cfg.angle * Math.PI / 180;
  const arcEnd = [cx + arcR * Math.cos(-aRad), cy + arcR * Math.sin(-aRad)];
  const angleArc = `M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`;
  const fmt = window.VPEngine.fmt;
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ display: "block" }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arr" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto"><path d="M1 1 L8 4.5 L1 8" fill="none" stroke={col.dim} strokeWidth="1.25" /></marker>
        <pattern id="bgrid" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0 L0 0 0 34" fill="none" stroke={col.grid} strokeWidth="1" /></pattern>
      </defs>
      {isDark && <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bgrid)" />}
      <line x1={P(x0 - 600, 0)[0]} y1={P(0, 0)[1]} x2={P(xL1, 0)[0]} y2={P(0, 0)[1]} stroke={col.secondary} strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
      <line x1={P(xL2, rise)[0]} y1={P(0, rise)[1]} x2={P(xL3 + 600, rise)[0]} y2={P(0, rise)[1]} stroke={col.secondary} strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
      <path d={`${path(surf)} L ${P(trussBot[trussBot.length - 1][0], trussBot[trussBot.length - 1][1]).join(" ")} ${[...trussBot].reverse().map(p => "L " + P(p[0], p[1]).join(" ")).join(" ")} Z`} fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(14,14,14,0.03)"} stroke="none" />
      <path d={path(trussBot)} fill="none" stroke={col.secondary} strokeWidth="1.5" />
      {stepEls}
      <path d={path(surf)} fill="none" stroke={col.structure} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`${path(balTop)} L ${P(surf[3][0], surf[3][1]).join(" ")} ${[...surf].reverse().map(p => "L " + P(p[0], p[1]).join(" ")).join(" ")} Z`} fill={col.glass} stroke="none" />
      <path d={path(balTop)} fill="none" stroke={col.accent} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      {[0, 3].map(i => { const [bx, by] = P(surf[i][0], surf[i][1]); const [tx, ty] = P(balTop[i][0], balTop[i][1]); return <line key={i} x1={bx} y1={by} x2={tx} y2={ty} stroke={col.structure} strokeWidth="2.5" />; })}
      {rise > 1 && vDim(xL3 + 900, 0, rise, fmt(rise) + " mm", 1)}
      {run > 1 && hDim(xL1, xL2, Math.min(0, rise) - pit - 120, fmt(run) + " mm", 30)}
      {hDim(x0, xL3, Math.min(0, rise) - pit - 320, fmt(calc.totalLen) + " mm", 30)}
      {cfg.angle > 0.4 && (<g>
        <path d={angleArc} fill="none" stroke={col.dim} strokeWidth="1.25" />
        <text x={cx + arcR + 12} y={cy - 14} fontFamily="var(--font-mono)" fontSize="15" fontWeight="700" fill={col.dimText}>{window.VPEngine.round(cfg.angle, 1).toString().replace(".", ",")}°</text>
      </g>)}
      <text x={P(x0, 0)[0]} y={P(0, 0)[1] + 22} fontFamily="var(--font-mono)" fontSize="12" fill={col.secondary}>EMBARQUE</text>
      <text x={P(xL3, rise)[0]} y={P(0, rise)[1] - balH * scale - 14} textAnchor="end" fontFamily="var(--font-mono)" fontSize="12" fill={col.secondary}>DESEMBARQUE</text>
    </svg>
  );
};

/* ---------- CONTROLS (painel esquerdo) ---------- */
const VPSlider = ({ label, sub, value, min, max, step, unit, fmtVal, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="ctl">
      <div className="ctl__head">
        <label className="ctl__label">{label}</label>
        <output className="ctl__val">{fmtVal ? fmtVal(value) : window.VPEngine.fmt(value)}<span className="ctl__unit">{unit}</span></output>
      </div>
      {sub && <div className="ctl__sub">{sub}</div>}
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="vp-range"
        style={{ background: `linear-gradient(90deg, var(--vp-yellow) 0%, var(--vp-yellow) ${pct}%, var(--vp-steel-200) ${pct}%, var(--vp-steel-200) 100%)` }} />
      <div className="ctl__scale"><span>{window.VPEngine.fmt(min)}{unit}</span><span>{window.VPEngine.fmt(max)}{unit}</span></div>
    </div>
  );
};
const VPSeg = ({ label, value, options, onChange, fmtOpt }) => (
  <div className="ctl">
    <div className="ctl__head"><label className="ctl__label">{label}</label></div>
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={o === value} className={"seg__b" + (o === value ? " is-on" : "")} onClick={() => onChange(o)}>{fmtOpt ? fmtOpt(o) : o}</button>
      ))}
    </div>
  </div>
);
const VPSelect = ({ label, value, options, onChange }) => (
  <div className="ctl">
    <div className="ctl__head"><label className="ctl__label">{label}</label></div>
    <div className="optlist">
      {options.map((o) => (
        <button key={o.id} className={"opt" + (o.id === value ? " is-on" : "")} onClick={() => onChange(o.id)}>
          <span className="opt__radio" aria-hidden="true"></span>
          <span className="opt__main"><span className="opt__label">{o.label}</span><span className="opt__desc">{o.desc || o.note}</span></span>
          {o.code && <span className="opt__code">{o.code}</span>}
        </button>
      ))}
    </div>
  </div>
);
const VPControls = ({ cfg, set }) => {
  const E = window.VPEngine; const isER = cfg.product === "ER"; const B = E.BOUNDS[cfg.product];
  return (
    <div className="panel panel--controls">
      <div className="panel__scroll">
        <div className="grp">
          <div className="grp__title">01 — Geometria</div>
          {isER
            ? <VPSlider label="Desnível (rise)" sub="Altura total entre pavimentos" value={cfg.rise} min={B.rise[0]} max={B.rise[1]} step={50} unit=" mm" onChange={(v) => set({ rise: v })} />
            : <VPSlider label="Comprimento do vão" sub="Distância horizontal entre apoios" value={cfg.span} min={B.span[0]} max={B.span[1]} step={100} unit=" mm" onChange={(v) => set({ span: v })} />}
          <VPSlider label="Ângulo de inclinação" value={cfg.angle} min={B.angle[0]} max={B.angle[1]} step={isER ? 0.1 : 0.5} unit="°" fmtVal={(v) => E.round(v, 1).toString().replace(".", ",")} onChange={(v) => set({ angle: v })} />
          <VPSeg label={isER ? "Largura do degrau" : "Largura do palete"} value={cfg.width} options={E.WIDTHS[cfg.product]} fmtOpt={(o) => o + " mm"} onChange={(v) => set({ width: v })} />
          <VPSeg label="Velocidade nominal" value={cfg.speed} options={E.SPEEDS} fmtOpt={(o) => o.toString().replace(".", ",") + " m/s"} onChange={(v) => set({ speed: v })} />
        </div>
        <div className="grp">
          <div className="grp__title">02 — Acionamento</div>
          <VPSelect label="Tipo de drive" value={cfg.drive} options={E.DRIVES[cfg.product]} onChange={(v) => set({ drive: v })} />
          <VPSelect label="Modo de economia de energia" value={cfg.esm} options={E.ESM} onChange={(v) => set({ esm: v })} />
        </div>
        <div className="grp">
          <div className="grp__title">03 — Acabamento</div>
          <VPSelect label="Balaustrada" value={cfg.finish} options={E.FINISH[cfg.product]} onChange={(v) => set({ finish: v })} />
        </div>
      </div>
    </div>
  );
};

/* ---------- SPEC SHEET (painel direito) ---------- */
const SpecRow = ({ label, value, unit, accent }) => (
  <div className={"sr" + (accent ? " sr--accent" : "")}>
    <span className="sr__l">{label}</span>
    <span className="sr__v">{value}<span className="sr__u">{unit}</span></span>
  </div>
);
const VPSpec = ({ cfg, calc, onQuote, onExport }) => {
  const E = window.VPEngine; const fmt = E.fmt; const oem = E.oem(cfg);
  const [copied, setCopied] = React.useState(false);
  const copySku = () => { try { navigator.clipboard.writeText(calc.sku); } catch (e) {} window.toast("SKU copiado: " + calc.sku, "success"); setCopied(true); setTimeout(() => setCopied(false), 1400); };
  return (
    <div className="panel panel--spec">
      <div className="panel__scroll">
        <div className="sku">
          <div className="sku__eyebrow">Código da configuração</div>
          <div className="sku__code" onClick={copySku} title="Copiar">{calc.sku}</div>
          <button className="sku__copy" onClick={copySku}>{copied ? "Copiado ✓" : "Copiar código"}</button>
        </div>
        <div className="grp">
          <div className="grp__title">Ficha técnica calculada</div>
          <div className="specbox">
            <SpecRow label="Desnível (H)" value={fmt(calc.rise)} unit=" mm" accent />
            <SpecRow label="Vão horizontal" value={fmt(calc.run)} unit=" mm" />
            <SpecRow label="Comprimento inclinado" value={fmt(calc.incline)} unit=" mm" />
            <SpecRow label="Comprimento total" value={fmt(calc.totalLen)} unit=" mm" accent />
            <SpecRow label="Profundidade de poço" value={fmt(calc.pit)} unit=" mm" />
            <SpecRow label={cfg.product === "ER" ? "Nº de degraus" : "Nº de paletes"} value={fmt(calc.units)} unit="" />
          </div>
        </div>
        <div className="grp">
          <div className="grp__title">Desempenho</div>
          <div className="specbox">
            <SpecRow label="Capacidade de transporte" value={fmt(calc.capacity)} unit=" p/h" accent />
            <SpecRow label="Potência nominal do motor" value={fmt(calc.ratedKw, 1).replace(".", ",")} unit=" kW" />
            <SpecRow label="Potência média c/ ESM" value={fmt(calc.avgKw, 1).replace(".", ",")} unit=" kW" />
            <SpecRow label="Consumo estimado" value={fmt(calc.annualKwh)} unit=" kWh/ano" />
            <SpecRow label="Peso aproximado" value={fmt(calc.weight)} unit=" kg" />
          </div>
        </div>
        <div className="grp">
          <div className="grp__title">Compatibilidade OEM</div>
          <div className="oem">
            {oem.map((o, i) => (
              <div key={i} className={"oem__row" + (o.match ? "" : " is-off")}>
                <span className={"oem__dot" + (o.match ? " ok" : "")}></span>
                <span className="oem__brand">{o.brand}</span>
                <span className="oem__model">{o.model}</span>
                <span className="oem__state">{o.match ? "Compatível" : "Sob consulta"}</span>
              </div>
            ))}
          </div>
          <p className="oem__note">Referência de equivalência para substituição de peças e retrofit. Confirme a homologação com a engenharia VerticalParts.</p>
        </div>
        <div className="spec__actions">
          <button className="spec__cta" onClick={onQuote}>Solicitar orçamento →</button>
          <button className="spec__pdf" onClick={onExport}>Exportar ficha (PDF)</button>
        </div>
        <p className="spec__sla">Orçamento em até 4h úteis · Pronta-entrega em 14 estados</p>
      </div>
    </div>
  );
};

/* ---------- PÁGINA ---------- */
const DT_DEFAULT_CFG = {
  ER: { product: "ER", angle: 30, rise: 4500, span: 12000, width: 1000, speed: 0.5, drive: "DD220", esm: "STB", finish: "GLS" },
  MW: { product: "MW", angle: 6, rise: 0, span: 24000, width: 1200, speed: 0.65, drive: "SOG110", esm: "RED", finish: "GLS" },
};
const ER_ICON = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 19 L9 19 L21 7 M3 19 L3 16 L7 16 M21 7 L21 4 L17 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 16 L14 8" opacity="0.5"/></svg>;
const MW_ICON = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 16 L15 16 L21 9 M3 16 L3 13" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5" cy="18.5" r="1.4"/><circle cx="13" cy="18.5" r="1.4"/></svg>;

function DesenhoTecnicoPage({ setRoute }) {
  const [product, setProduct] = React.useState("ER");
  const [cfgs, setCfgs] = React.useState(DT_DEFAULT_CFG);
  const [tema, setTema] = React.useState("paper");
  const cfg = cfgs[product];
  const set = (patch) => setCfgs(prev => ({ ...prev, [product]: { ...prev[product], ...patch } }));
  const switchProduct = (p) => {
    setCfgs(prev => {
      const c = { ...prev[p] }; const E = window.VPEngine;
      if (!E.DRIVES[p].some(d => d.id === c.drive)) c.drive = E.DRIVES[p][0].id;
      if (!E.FINISH[p].some(f => f.id === c.finish)) c.finish = E.FINISH[p][0].id;
      if (!E.WIDTHS[p].includes(c.width)) c.width = E.WIDTHS[p][Math.min(2, E.WIDTHS[p].length - 1)];
      return { ...prev, [p]: c };
    });
    setProduct(p);
  };
  const calc = window.VPEngine.compute(cfg);
  const fmt = window.VPEngine.fmt;
  const onExport = () => window.print();
  const onQuote = () => window.toast("Configuração " + calc.sku + " — abra Comercial → Cotações para orçar.", "info");

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="page-head__l">
          <div className="page-head__eyebrow"><span className="vp-rule"/>Engenharia · Desenho Técnico</div>
          <h1 className="page-head__title">Desenho Técnico ER | ES</h1>
          <p className="page-head__sub">Elevação lateral cotada de escada e esteira rolante — dimensões, ficha técnica e compatibilidade OEM, atualizadas ao vivo conforme a configuração.</p>
        </div>
        <div className="page-head__r">
          <Button variant="outline" icon="download" onClick={onExport}>Exportar (PDF)</Button>
        </div>
      </div>

      <div className={"vpdt theme-" + tema}>
        <div className="row sb" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="prodtabs" role="tablist">
            <button className={"prodtab" + (product === "ER" ? " is-on" : "")} onClick={() => switchProduct("ER")}>{ER_ICON} Escada rolante</button>
            <button className={"prodtab" + (product === "MW" ? " is-on" : "")} onClick={() => switchProduct("MW")}>{MW_ICON} Esteira rolante</button>
          </div>
          <div className="themebar">
            {["paper", "blueprint", "carbon"].map(t => (
              <button key={t} className={tema === t ? "is-on" : ""} onClick={() => setTema(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="bench">
          <VPControls cfg={cfg} set={set} />
          <section className="stage">
            <div className="stage__head">
              <div>
                <div className="stage__eyebrow">{product === "ER" ? "Escada rolante" : "Esteira rolante"} · vista lateral</div>
                <div className="stage__title">{calc.finish.label}</div>
              </div>
              <div className="stage__legend">
                <span><i className="lg lg--rail"></i>Corrimão</span>
                <span><i className="lg lg--deck"></i>Estrutura</span>
                <span><i className="lg lg--dim"></i>Cota (mm)</span>
              </div>
            </div>
            <div className="stage__canvas">
              <VPPreview cfg={cfg} calc={calc} theme={tema} />
            </div>
            <div className="stage__foot">
              <div className="chip-stat"><span>Capacidade</span><strong>{fmt(calc.capacity)} p/h</strong></div>
              <div className="chip-stat"><span>Potência</span><strong>{fmt(calc.ratedKw, 1).replace(".", ",")} kW</strong></div>
              <div className="chip-stat"><span>Comprimento total</span><strong>{fmt(calc.totalLen)} mm</strong></div>
              <div className="chip-stat"><span>Peso</span><strong>{fmt(calc.weight)} kg</strong></div>
            </div>
          </section>
          <VPSpec cfg={cfg} calc={calc} onQuote={onQuote} onExport={onExport} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DesenhoTecnicoPage });
