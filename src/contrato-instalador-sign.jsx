/* ============================================================
   contrato-instalador-sign.jsx
   Página PÚBLICA de assinatura (assinar.html#token ou /assinar/:token).
   Carrega o contrato pelo token, marca como visualizado,
   coleta a assinatura (desenhada ou digitada), captura IP/UA/device,
   grava a assinatura com hash SHA-256 no Supabase.
   ============================================================ */
const { useState: _ciSUS, useEffect: _ciSUE, useRef: _ciSUR, useMemo: _ciSUM, useCallback: _ciSUC } = React;

function CIIconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <rect x="4" y="10" width="16" height="11" rx="2"/>
      <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
    </svg>
  );
}

/* ---------- Signature pad (canvas) ---------- */
function CISignaturePad({ onChange }) {
  const canvasRef = _ciSUR(null);
  const drawing = _ciSUR(false);
  const last = _ciSUR(null);
  const [empty, setEmpty] = _ciSUS(true);

  const setup = _ciSUC(() => {
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#15233f';
  }, []);

  _ciSUE(() => {
    setup();
    const onResize = () => setup();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setup]);

  const pos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  };
  const start = (e) => { e.preventDefault(); drawing.current = true; last.current = pos(e); };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (empty) setEmpty(false);
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (!empty) onChange(canvasRef.current.toDataURL('image/png'));
  };
  const clear = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange(null);
  };

  return (
    <div className="ci-sig-pad-wrap">
      <canvas ref={canvasRef} className="ci-sig-pad"
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <div className="ci-sig-pad-base"></div>
      <span className="ci-sig-pad-x">✕</span>
      {empty && <div className="ci-sig-pad-ph">Assine aqui com o dedo ou mouse</div>}
      {!empty && <button className="ci-sig-clear" onClick={clear}>Limpar</button>}
    </div>
  );
}

function CISumRow({ k, v }) { return <div className="ci-sum-row"><span className="k">{k}</span><span className="v">{v}</span></div>; }

function CISignApp() {
  /* Token vem do path /assinar/:token (path-style) ou hash #token (compat). */
  function extractToken() {
    // Path-style: /assinar/<token>  (rewrite do Express)
    const m = location.pathname.match(/\/assinar\/([^/]+)/);
    if (m) return decodeURIComponent(m[1]);
    const h = (location.hash || '').replace(/^#/, '');
    if (h) return decodeURIComponent(h);
    return new URLSearchParams(location.search).get('t');
  }
  const token = extractToken();
  const [rec, setRec] = _ciSUS(null);
  const [loading, setLoading] = _ciSUS(true);
  const [notFound, setNotFound] = _ciSUS(false);
  const [phase, setPhase] = _ciSUS('sign'); // sign | processing | done | refused
  const [scrolledEnd, setScrolledEnd] = _ciSUS(false);
  const [consent, setConsent] = _ciSUS(false);
  const [sigMode, setSigMode] = _ciSUS('draw');
  const [drawData, setDrawData] = _ciSUS(null);
  const [typedName, setTypedName] = _ciSUS('');
  const viewerRef = _ciSUR(null);

  /* Carrega contrato + marca como visualizado */
  _ciSUE(() => {
    (async () => {
      if (!token) { setLoading(false); setNotFound(true); return; }
      let r = await window.CIStore.getByToken(token);
      if (!r) { setLoading(false); setNotFound(true); return; }

      if (r.status === 'assinado') { setRec(r); setPhase('done'); setLoading(false); return; }
      if (r.status === 'recusado' || r.status === 'expirado') { setRec(r); setLoading(false); return; }

      const updated = await window.CIStore.markViewed(token);
      setRec(updated || r);
      setLoading(false);
    })();
  }, [token]);

  const doc = _ciSUM(() => rec ? window.CI.buildContract(rec.form_state, rec.numero_documento) : null, [rec]);

  const onScroll = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolledEnd(true);
  };

  const sigValid = sigMode === 'draw' ? !!drawData : typedName.trim().length >= 3;
  const canSign = scrolledEnd && consent && sigValid;

  const handleSign = async () => {
    setPhase('processing');
    const sig = sigMode === 'draw'
      ? { type: 'draw', data: drawData, signerName: rec.responsavel_nome || rec.contratada_nome }
      : { type: 'type', data: typedName.trim(), signerName: typedName.trim() };
    await new Promise(r => setTimeout(r, 1200));
    const updated = await window.CIStore.markSigned(token, sig);
    setRec(updated);
    setPhase('done');
  };

  const handleRefuse = async () => {
    if (!window.confirm('Recusar a assinatura deste contrato? A Vertical Parts será notificada.')) return;
    const updated = await window.CIStore.refuse(token);
    setRec(updated);
    setPhase('refused');
  };

  if (loading) {
    return (
      <div className="ci-sign-status">
        <div className="ci-spinner"></div>
        <h1>Carregando contrato…</h1>
        <p>Validando o link de assinatura.</p>
      </div>
    );
  }

  if (notFound || !rec) {
    return (
      <div className="ci-sign-shell">
        <div className="ci-err-state">
          <h1>Link inválido</h1>
          <p>Este link de assinatura não foi encontrado ou expirou. Solicite um novo link à Vertical Parts.</p>
        </div>
      </div>
    );
  }
  if (rec.status === 'expirado') {
    return (
      <div className="ci-sign-shell">
        <div className="ci-err-state">
          <h1>Link expirado</h1>
          <p>Este link expirou (validade de 7 dias). Solicite o reenvio à Vertical Parts.</p>
        </div>
      </div>
    );
  }
  if (phase === 'processing') {
    return (
      <div className="ci-sign-status">
        <div className="ci-spinner"></div>
        <h1>Processando…</h1>
        <p>Registrando sua assinatura e gerando o documento final com a trilha de auditoria.</p>
      </div>
    );
  }
  if (phase === 'done' || rec.status === 'assinado') {
    const a = rec.audit || {};
    return (
      <div className="ci-sign-status">
        <div className="ci-success-check">✓</div>
        <h1>Contrato assinado!</h1>
        <p>O contrato <b>{rec.numero_documento}</b> foi assinado com sucesso.</p>
        <div className="ci-protocolo">
          Protocolo: {rec.token}<br/>
          Assinado em {window.CIStore.fmtDateTime(a.signedAt)}<br/>
          Hash: {(a.hash || '').slice(0, 32)}…
        </div>
        <button className="ci-sign-btn" onClick={() => window.print()}>Baixar cópia assinada (PDF)</button>
      </div>
    );
  }
  if (phase === 'refused' || rec.status === 'recusado') {
    return (
      <div className="ci-sign-shell">
        <div className="ci-err-state">
          <h1>Assinatura recusada</h1>
          <p>Obrigado pelo retorno. A Vertical Parts foi notificada e entrará em contato em breve.</p>
        </div>
      </div>
    );
  }

  const valorFmt = rec.valor_total ? 'R$ ' + window.CI.fmtMoeda(rec.valor_total) : '—';

  return (
    <div className="ci-sign-shell">
      <div className="ci-sign-top">
        <img src="/assets/logo-mark-yellow.png" alt="VerticalParts"/>
        <span className="ci-secure"><CIIconLock/> Seguro</span>
      </div>

      <div className="ci-sign-intro">
        <h1>Assine seu contrato</h1>
        <p>A Vertical Parts enviou este contrato para sua assinatura digital. Leia o documento, confirme e assine — sem precisar de cadastro.</p>
      </div>

      <div className="ci-sum-card">
        <div className="ci-sum-head">
          <div className="num">{rec.numero_documento}</div>
          <div className="title">{rec.titulo}</div>
        </div>
        <div className="ci-sum-rows">
          <CISumRow k="Contratante" v="Vertical Parts Ltda."/>
          <CISumRow k="Contratada" v={rec.contratada_nome}/>
          <CISumRow k="Objeto" v={rec.objeto_resumo}/>
          <CISumRow k="Valor total" v={valorFmt}/>
        </div>
      </div>

      <div className="ci-sign-label"><span className="n">1</span> Leia o contrato</div>
      <div className="ci-doc-viewer">
        <div className="ci-doc-viewer-scroll" ref={viewerRef} onScroll={onScroll}>
          <window.CIContractPreview doc={doc} highlightConditional={false}/>
        </div>
        <div className={'ci-scroll-hint' + (scrolledEnd ? ' hidden' : '')}>↓ Role até o fim para habilitar a assinatura</div>
      </div>
      <div className={'ci-read-flag' + (scrolledEnd ? '' : ' pending')}>
        {scrolledEnd ? '✓ Documento lido por completo' : 'Role o documento até o final'}
      </div>

      <div className="ci-sign-label"><span className="n">2</span> Concordância</div>
      <div className={'ci-consent' + (consent ? ' on' : '') + (scrolledEnd ? '' : ' disabled')} onClick={() => scrolledEnd && setConsent(!consent)}>
        <div className="box">{consent && <span>✓</span>}</div>
        <div className="txt">Declaro que li, compreendi e concordo com todos os termos deste contrato.</div>
      </div>

      <div className="ci-sign-label"><span className="n">3</span> Sua assinatura</div>
      <div className="ci-sig-tabs">
        <button className={'ci-sig-tab' + (sigMode === 'draw' ? ' on' : '')} onClick={() => setSigMode('draw')}>Desenhar</button>
        <button className={'ci-sig-tab' + (sigMode === 'type' ? ' on' : '')} onClick={() => setSigMode('type')}>Digitar nome</button>
      </div>
      {sigMode === 'draw'
        ? <CISignaturePad onChange={setDrawData}/>
        : (
          <div className="ci-sig-typed">
            <input value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Digite seu nome completo"/>
            <div className="preview">{typedName.trim() ? <span>{typedName}</span> : <span className="ph">Sua assinatura aparece aqui</span>}</div>
          </div>
        )}
      <p className="ci-sig-meta">Ao assinar, registramos data/hora, seu IP e dispositivo para fins de auditoria, conforme a MP 2.200-2/2001 e a Lei 14.063/2020.</p>

      <div className="ci-sign-actionbar">
        <button className="ci-sign-btn" disabled={!canSign} onClick={handleSign}>Confirmar e assinar</button>
        {!canSign && <p className="ci-req-hint">{!scrolledEnd ? 'Leia o documento até o fim' : !consent ? 'Marque a concordância' : 'Adicione sua assinatura'}</p>}
        <button className="ci-sign-sub-action" onClick={handleRefuse}>Recusar assinatura</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('ci-sign-root')).render(<CISignApp/>);
