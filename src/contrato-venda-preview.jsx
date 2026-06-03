/* ============================================================
   contrato-venda-preview.jsx
   Renderiza o documento do Contrato de Venda de Equipamentos.
   Compartilhado entre app (vpprd) e assinar.html (público).
   ============================================================ */

function CV_DocItem({ item }) {
  /* tabela de parcelas */
  if (item.table) {
    const tab = item.table || [];
    const total = tab.reduce((s, t) => s + (t.valor || 0), 0);
    return (
      <table className="cv-doc-table">
        <thead>
          <tr><th>#</th><th>Quando</th><th>%</th><th style={{textAlign:'right'}}>Valor</th></tr>
        </thead>
        <tbody>
          {tab.map((t, i) => (
            <tr key={i}>
              <td>{t.label}</td>
              <td>{t.quando}</td>
              <td className="cv-mono">{(t.pct || 0).toFixed(2).replace('.',',')}%</td>
              <td className="cv-mono" style={{textAlign:'right'}}>{window.CV.brl(t.valor || 0)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td colSpan="3"><b>Total</b></td><td className="cv-mono" style={{textAlign:'right'}}><b>{window.CV.brl(total)}</b></td></tr>
        </tfoot>
      </table>
    );
  }
  const cls = ['cv-doc-p'];
  if (item.li) cls.push('cv-doc-li');
  if (item.callout) cls.push('cv-doc-callout');
  if (item.center) cls.push('cv-doc-center');
  if (item.sign) cls.push('cv-doc-sign-line');
  if (item.injected) cls.push('cv-doc-injected');
  if (item.html) {
    return (
      <p className={cls.join(' ')}>
        {item.tag && <span className="cv-doc-tag">{item.tag}</span>}
        <span dangerouslySetInnerHTML={{ __html: item.text }}/>
      </p>
    );
  }
  return <p className={cls.join(' ')}>{item.text}</p>;
}

function CVContractPreview({ doc, highlightInjected }) {
  if (!doc) return null;
  return (
    <div className="cv-doc-sheet" id="cv-contract-doc">
      <div className="cv-doc-head">
        <img className="cv-doc-logo" src="assets/logo-black-yellow.png" alt="VerticalParts"/>
        <div className="cv-doc-meta">
          <span className="cv-doc-meta-label">Nº do Contrato</span>
          <span className="cv-doc-meta-num">{doc.numero}</span>
        </div>
      </div>
      <h1 className="cv-doc-title">{doc.titulo || 'CONTRATO DE COMPRA E VENDA DE EQUIPAMENTO'}</h1>

      {doc.sections.map((sec) => (
        <section key={sec.id} className={'cv-doc-section' + (sec.kind === 'preamble' ? ' cv-doc-preamble' : '')}>
          {sec.num && (
            <h2 className="cv-doc-section-title">
              <span className="cv-doc-section-num">{sec.num}.</span> {sec.title}
            </h2>
          )}
          {sec.body.map((it, j) => <CV_DocItem key={j} item={it}/>)}
        </section>
      ))}
    </div>
  );
}

window.CVContractPreview = CVContractPreview;
