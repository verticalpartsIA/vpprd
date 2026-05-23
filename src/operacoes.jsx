/* ============================================================
   operacoes.jsx — Engenharia + Jurídico + Instalação
   ============================================================ */

/* ---------- ENGENHARIA ---------- */
function EngenhariaPage({ setRoute }) {
  const D = window.__VP_DATA;
  const [engTab, setEngTab] = React.useState("laudo");
  // Stable photo IDs so they don't shuffle on re-render
  const photoIds = React.useMemo(() => ([3142, 5891, 7204, 2057, 4396, 6128]), []);
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="page-head__l">
          <div className="page-head__eyebrow"><span className="vp-rule"/>Operações · Engenharia</div>
          <h1 className="page-head__title">Projetos de Engenharia</h1>
          <p className="page-head__sub">Visita técnica, levantamento, BOM, laudo final. Gatilha aprovação para Importação.</p>
        </div>
        <div className="page-head__r">
          <Button variant="outline" icon="calendar">Calendário visitas</Button>
          <Button variant="primary" icon="plus">Novo projeto</Button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <KPI label="Projetos ativos" value="31" sub="abertos" delta="+5" deltaDir="up" icon="ruler"/>
        <KPI label="Aguard. laudo" value="8" sub="fila técnica" delta="-2" deltaDir="up" icon="fileSearch"/>
        <KPI label="Visitas semana" value="12" sub="agendadas" delta="+3" deltaDir="up" icon="calendar"/>
        <KPI label="SLA laudo" value="3.2" unit="d" sub="meta 4d" delta="-0.4d" deltaDir="up" icon="clock"/>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <Card title="Projetos abertos" sub={`${D.projetosEng.length} ativos`}>
          <div className="stack" style={{ gap: 12 }}>
            {D.projetosEng.map((p) => (
              <div key={p.id} style={{ background: "#fff", border: "1px solid var(--border)", padding: 14, cursor: "pointer", position: "relative" }}>
                <span style={{ position: "absolute", top: 0, left: 0, width: 24, height: 3, background: "var(--vp-yellow)" }}/>
                <div className="row sb">
                  <div>
                    <div className="cell-main" style={{ fontSize: 14 }}>{p.building}</div>
                    <div className="cell-sub">{p.id} · vinculado a {p.projeto}</div>
                  </div>
                  <StatusBadge status={p.status}/>
                </div>
                <div className="grid-3" style={{ marginTop: 12, gap: 12 }}>
                  <div>
                    <div className="up-eyebrow muted">Visita técnica</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{fmtDateLong(p.visita)}</div>
                  </div>
                  <div>
                    <div className="up-eyebrow muted">Responsável</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{p.responsavel}</div>
                  </div>
                  <div>
                    <div className="up-eyebrow muted">Arquivos</div>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{p.arquivos} docs</div>
                  </div>
                </div>
                <div className="row sb" style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  <span className="small muted">Pendência: <b style={{ color: "var(--fg1)" }}>{p.pendencia}</b></span>
                  <Badge variant={p.laudo === "Aprovado" ? "success" : p.laudo === "Reprovado" ? "danger" : p.laudo === "—" ? "neutral" : "warning"}>Laudo: {p.laudo}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Detalhe: ENG-148 · Cond. Park Tower" sub="modernização 4 elevadores Schindler 9300AE"
          action={<>
            <Button variant="outline" size="sm" icon="upload">Anexar</Button>
            <Button variant="primary" size="sm" icon="check">Aprovar Laudo</Button>
          </>}>
          <Tabs tabs={[
            { key: "laudo", label: "Laudo Técnico", icon: "fileText" },
            { key: "docs", label: "Documentos", icon: "package", count: 12 },
            { key: "bom", label: "BOM", icon: "list", count: 24 },
            { key: "visita", label: "Visita", icon: "calendar" },
            { key: "ncm", label: "NCM / Ficha Técnica", icon: "package" },
          ]} active={engTab} onChange={setEngTab}/>

          <div style={{ padding: "16px 0" }}>
            {engTab === "laudo" ? <EngLaudoContent photoIds={photoIds}/>
             : engTab === "docs" ? <EngDocsContent/>
             : engTab === "bom" ? <EngBomContent/>
             : engTab === "visita" ? <EngVisitaContent/>
             : engTab === "ncm" ? <NCMTab productId="PRD-2026-005" onOpenLogComex={() => window.toast("Modal LogComex disponível a partir do Kanban NCM ou Catálogo", "info")}/>
             : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- JURÍDICO — Contract page redactor =================== */
function JuridicoPage({ setRoute }) {
  const D = window.__VP_DATA;
  const [filter, setFilter] = React.useState("Todos");
  const filters = ["Todos", "Aguardando assinatura", "Em redação", "Em assinatura digital", "Assinado"];
  const rows = D.contratos.filter(c => filter === "Todos" || c.status === filter);
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="page-head__l">
          <div className="page-head__eyebrow"><span className="vp-rule"/>Operações · Jurídico</div>
          <h1 className="page-head__title">Contratos & Minutas</h1>
          <p className="page-head__sub">Geração de minuta, redação automática de páginas confidenciais, envio para assinatura digital.</p>
        </div>
        <div className="page-head__r">
          <Button variant="outline" icon="upload">Importar minuta</Button>
          <Button variant="primary" icon="plus">Novo contrato</Button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <KPI label="Em redação" value="6" sub="aguardando" delta="+1" deltaDir="up" icon="edit"/>
        <KPI label="Em assinatura" value="4" sub="docusign" delta="+2" deltaDir="up" icon="signature"/>
        <KPI label="SLA aprovação" value="9.4" unit="d" sub="cliente" delta="+0.8d" deltaDir="down" icon="clock"/>
        <KPI label="Atrasados" value="2" sub="ação necessária" delta="+1" deltaDir="down" icon="warning"/>
      </div>

      <div className="tbar">
        <div className="seg">
          {filters.map(s => (
            <button key={s} className={filter === s ? "is-active" : ""} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div className="spacer"/>
        <Button variant="outline" size="sm" icon="filter">Cliente</Button>
        <Button variant="outline" size="sm" icon="filter">Advogado</Button>
      </div>

      <div className="table-wrap" style={{ marginBottom: 24 }}>
        <table className="t">
          <thead><tr>
            <th>Contrato</th>
            <th>Cliente</th>
            <th>Páginas</th>
            <th>Redações</th>
            <th>Advogado</th>
            <th>Status</th>
            <th className="text-right">Valor</th>
            <th>Dias parado</th>
            <th></th>
          </tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="cell-main">{c.id}</div>
                  <div className="cell-sub">{fmtDate(c.issued)} · {c.projeto}</div>
                </td>
                <td>{c.client}</td>
                <td><span className="cell-num">{c.pages}</span></td>
                <td>
                  <span className="row gap-2" style={{ display: "inline-flex" }}>
                    <Icon.scissors size={12} color={c.redacted > 0 ? "var(--vp-danger)" : "var(--fg3)"}/>
                    <span className="cell-num">{c.redacted}</span>
                  </span>
                </td>
                <td>{c.lawyer}</td>
                <td><StatusBadge status={c.status}/></td>
                <td className="cell-money">{fmtBRL(c.value)}</td>
                <td>
                  <span className={"cell-num " + (c.days > 7 ? "" : "")} style={{ color: c.days > 7 ? "var(--vp-danger)" : c.days > 0 ? "var(--vp-warning-ink)" : "var(--fg3)" }}>
                    {c.days === 0 ? "—" : c.days + "d"}
                  </span>
                </td>
                <td><Button variant="ghost" size="sm" icon="chevRight"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card title="CT-2026-018 · Hospital São Luiz" sub="24 páginas · 3 redações pendentes · Marina Aragão"
        action={<>
          <Button variant="outline" size="sm" icon="download">Baixar PDF redigido</Button>
          <Button variant="outline" size="sm" icon="eye">Versão original</Button>
          <Button variant="primary" size="sm" icon="signature">Enviar p/ assinatura</Button>
        </>}>
        <ContractRedactor/>
      </Card>
    </div>
  );
}

/* ✂️ Page selector + redactor — the highlight feature */
function ContractRedactor() {
  const totalPages = 24;
  // pages initially redacted (sensitive: pricing, suppliers)
  const initial = new Set([9, 10, 14]);
  const [redacted, setRedacted] = React.useState(initial);
  const [active, setActive] = React.useState(9); // currently focused
  const [selection, setSelection] = React.useState(new Set([9, 10, 14]));

  const toggleRedact = (n) => {
    const next = new Set(redacted);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setRedacted(next);
  };
  const toggleSelect = (n) => {
    const next = new Set(selection);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setSelection(next);
  };
  const applyToSelection = () => {
    setRedacted(new Set(selection));
  };
  const clearAll = () => setRedacted(new Set());

  return (
    <div className="contract-grid">
      <div>
        <div className="row sb" style={{ marginBottom: 10 }}>
          <span className="up-eyebrow muted">Páginas do contrato</span>
          <span className="mono small" style={{ color: "var(--fg3)" }}>{totalPages} pgs · {redacted.size} ✂</span>
        </div>
        <div className="pg-thumbs">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const isRedact = redacted.has(n);
            const isSelected = selection.has(n);
            const isActive = active === n;
            const heading = (
              n === 1 ? "CAPA" :
              n === 2 ? "PARTES" :
              n === 3 ? "OBJETO" :
              n === 4 ? "ESCOPO" :
              n === 5 ? "ESCOPO" :
              n === 9 ? "VALORES" :
              n === 10 ? "PAGAMENTO" :
              n === 14 ? "FORNECEDOR" :
              n === 18 ? "GARANTIA" :
              n === 22 ? "ASSINATURA" :
              "CLÁUSULAS"
            );
            return (
              <div key={n}
                className={["pg-thumb", isActive ? "is-active" : "", isRedact ? "is-redact" : "", isSelected ? "is-selected" : ""].join(" ")}
                onClick={(e) => {
                  if (e.shiftKey) toggleSelect(n);
                  else setActive(n);
                }}>
                <div className="pg-thumb__num">{String(n).padStart(2, "0")}</div>
                {isSelected ? <div className="pg-thumb__check"><Icon.check size={10}/></div> : null}
                <div className="pg-thumb__body">
                  <div className="pg-h">{heading}</div>
                  <p className="l"/><p className="x"/><p className="l"/><p className="s"/>
                  <p className="l"/><p className="x"/><p className="l"/><p className="s"/>
                  <p className="l"/><p className="x"/>
                </div>
                {isRedact ? <>
                  <div className="pg-thumb__redact-overlay"/>
                </> : null}
              </div>
            );
          })}
        </div>
        <div className="row gap-2" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <Button variant="outline" size="sm" icon="scissors" onClick={applyToSelection}>Redigir seleção</Button>
          <Button variant="ghost" size="sm" icon="x" onClick={clearAll}>Limpar</Button>
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>Dica: <kbd style={{ background: "var(--vp-gray-100)", padding: "1px 5px", fontFamily: "var(--font-mono)", fontSize: 10 }}>Shift+Clique</kbd> para selecionar múltiplas páginas.</p>
      </div>

      <div className="contract-preview">
        <div className="contract-preview__head">
          <span>Página <b style={{ color: "var(--fg1)" }}>{String(active).padStart(2, "0")}</b> de {totalPages}</span>
          <div className="row gap-2">
            <Button variant="ghost" size="sm" icon="chevLeft" onClick={() => setActive(Math.max(1, active - 1))}/>
            <Button variant="ghost" size="sm" icon="chevRight" onClick={() => setActive(Math.min(totalPages, active + 1))}/>
          </div>
        </div>
        <div className="redact-toolbar">
          <Button variant={redacted.has(active) ? "secondary" : "outline"} size="sm" icon="scissors" onClick={() => toggleRedact(active)}>
            {redacted.has(active) ? "Restaurar página" : "Redigir esta página"}
          </Button>
        </div>
        <div className="contract-doc" style={{ position: "relative" }}>
          {active === 9 ? <ContractPage9 redacted={redacted.has(9)}/>
           : active === 10 ? <ContractPage10 redacted={redacted.has(10)}/>
           : active === 14 ? <ContractPage14 redacted={redacted.has(14)}/>
           : <ContractGenericPage num={active}/>
          }
          {redacted.has(active) ? (
            <div style={{
              position: "absolute",
              top: 16, right: 16,
              background: "var(--vp-danger)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".14em",
              padding: "4px 10px",
              transform: "rotate(2deg)",
              fontFamily: "var(--font-sans)"
            }}>✂ CONFIDENCIAL · REDIGIDA</div>
          ) : null}
        </div>
      </div>

      <div className="stack">
        <Card title="Versão Pública" sub="cópia para cliente após redação" sharp={true}>
          <div className="up-eyebrow muted" style={{ marginBottom: 6 }}>Configurações da redação</div>
          <div className="stack" style={{ gap: 10 }}>
            <label className="row" style={{ fontSize: 12 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--vp-yellow)" }}/>
              <span>Substituir por blocos pretos (estilo padrão)</span>
            </label>
            <label className="row" style={{ fontSize: 12 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--vp-yellow)" }}/>
              <span>Substituir nome do fornecedor por "FABRICANTE PARCEIRO"</span>
            </label>
            <label className="row" style={{ fontSize: 12 }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--vp-yellow)" }}/>
              <span>Ocultar valores de custo (manter preço final)</span>
            </label>
            <label className="row" style={{ fontSize: 12 }}>
              <input type="checkbox" style={{ accentColor: "var(--vp-yellow)" }}/>
              <span>Watermark "CÓPIA REDIGIDA — VERTICAL PARTS"</span>
            </label>
          </div>
        </Card>

        <Card title="Páginas Confidenciais Detectadas" sub="análise automática" sharp={true}>
          <div className="stack" style={{ gap: 8 }}>
            <DetectedRow page={9} category="Valores e tabela de preços" risk="alto"/>
            <DetectedRow page={10} category="Condições de pagamento detalhadas" risk="alto"/>
            <DetectedRow page={14} category="Identificação do fornecedor China" risk="alto"/>
            <DetectedRow page={16} category="Margem comercial mencionada" risk="médio"/>
            <DetectedRow page={19} category="Comissionamento interno" risk="médio"/>
          </div>
          <Button variant="outline" size="sm" icon="zap" style={{ marginTop: 14, width: "100%" }}>Sugerir redação automática</Button>
        </Card>

        <Card title="Auditoria" sub="trilha de revisões" sharp={true}>
          <div className="timeline">
            <div className="timeline__row current">
              <div className="timeline__node"/>
              <div>
                <div className="timeline__title">3 páginas marcadas para redação</div>
                <div className="timeline__sub">Marina A. · agora</div>
              </div>
              <div className="timeline__meta">v3</div>
              <div className="timeline__rail"/>
            </div>
            <div className="timeline__row done">
              <div className="timeline__node"/>
              <div>
                <div className="timeline__title">Minuta gerada da proposta</div>
                <div className="timeline__sub">Marina A. · 10/mai 14:22</div>
              </div>
              <div className="timeline__meta">v2</div>
              <div className="timeline__rail"/>
            </div>
            <div className="timeline__row done">
              <div className="timeline__node"/>
              <div>
                <div className="timeline__title">Importação template padrão</div>
                <div className="timeline__sub">Sistema · 06/mai</div>
              </div>
              <div className="timeline__meta">v1</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DetectedRow({ page, category, risk }) {
  const color = risk === "alto" ? "var(--vp-danger)" : "var(--vp-warning-ink)";
  return (
    <div className="row" style={{ padding: "8px 10px", background: "var(--vp-gray-50)", borderLeft: `3px solid ${color}` }}>
      <span className="mono" style={{ fontSize: 11, fontWeight: 700, color }}>P.{String(page).padStart(2, "0")}</span>
      <span style={{ fontSize: 12, flex: 1 }}>{category}</span>
      <Badge variant={risk === "alto" ? "danger" : "warning"}>{risk}</Badge>
    </div>
  );
}

function ContractGenericPage({ num }) {
  return (
    <>
      {num === 1 ? <h1>CONTRATO DE FORNECIMENTO E PRESTAÇÃO DE SERVIÇOS Nº CT-2026-018</h1> : <h2>CLÁUSULA {romanize(num)}ª — DAS OBRIGAÇÕES</h2>}
      <p><span className="clause-num">{num}.1.</span> Pelo presente instrumento particular, as partes nomeadas no preâmbulo deste contrato, doravante denominadas em conjunto "PARTES" ou individualmente "PARTE", têm entre si justo e contratado o que abaixo se segue.</p>
      <p><span className="clause-num">{num}.2.</span> A CONTRATADA obriga-se a fornecer os equipamentos e prestar os serviços conforme descrito no escopo técnico anexo, observando as normas técnicas brasileiras aplicáveis (ABNT NBR 16858, NM-207, NM-313).</p>
      <p><span className="clause-num">{num}.3.</span> A CONTRATANTE compromete-se a disponibilizar o local da instalação devidamente preparado, com infraestrutura elétrica, civil e estrutural adequada conforme especificação técnica fornecida pela CONTRATADA.</p>
      <p><span className="clause-num">{num}.4.</span> Os prazos estabelecidos neste contrato serão contados em dias corridos, salvo quando expressamente indicado o contrário, iniciando-se a partir da data de assinatura ou conforme marco específico definido em cada cláusula.</p>
      <p><span className="clause-num">{num}.5.</span> As partes elegem o foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja, para dirimir quaisquer questões oriundas do presente contrato.</p>
    </>
  );
}

function ContractPage9({ redacted }) {
  const R = (s) => redacted ? <span className="redact">{s}</span> : <b>{s}</b>;
  return (
    <>
      <h2>CLÁUSULA 9ª — DO VALOR DO CONTRATO</h2>
      <p><span className="clause-num">9.1.</span> O valor total deste contrato é de {R("R$ 1.840.000,00 (um milhão, oitocentos e quarenta mil reais)")}, conforme proposta comercial PR-2026-047 anexa, doravante denominado "VALOR CONTRATUAL".</p>
      <p><span className="clause-num">9.2.</span> O VALOR CONTRATUAL é composto da seguinte forma:</p>
      <p style={{ paddingLeft: 20 }}>a) Equipamentos importados FOB Shanghai: {R("USD 184.320,00")}</p>
      <p style={{ paddingLeft: 20 }}>b) Frete internacional e seguro CIF Santos: {R("R$ 56.700,00")}</p>
      <p style={{ paddingLeft: 20 }}>c) Impostos de importação (II, IPI, PIS, COFINS, ICMS): {R("R$ 478.220,00")}</p>
      <p style={{ paddingLeft: 20 }}>d) Despesas locais (despacho aduaneiro, frete nacional): {R("R$ 30.500,00")}</p>
      <p style={{ paddingLeft: 20 }}>e) Serviços de instalação e comissionamento: {R("R$ 248.000,00")}</p>
      <p style={{ paddingLeft: 20 }}>f) Margem comercial e garantia: {R("R$ 271.000,00")}</p>
      <p><span className="clause-num">9.3.</span> O VALOR CONTRATUAL inclui todos os tributos, encargos e despesas necessárias ao cumprimento integral do objeto deste contrato, salvo aqueles expressamente excluídos em escrito apartado.</p>
    </>
  );
}

function ContractPage10({ redacted }) {
  const R = (s) => redacted ? <span className="redact">{s}</span> : <b>{s}</b>;
  return (
    <>
      <h2>CLÁUSULA 10ª — DAS CONDIÇÕES DE PAGAMENTO</h2>
      <p><span className="clause-num">10.1.</span> O VALOR CONTRATUAL será pago pela CONTRATANTE à CONTRATADA conforme o seguinte cronograma:</p>
      <p style={{ paddingLeft: 20 }}>a) <b>30% (trinta por cento)</b> — {R("R$ 552.000,00")} — devidos em até 10 (dez) dias da assinatura deste contrato, a título de SINAL e início da produção dos equipamentos;</p>
      <p style={{ paddingLeft: 20 }}>b) <b>50% (cinquenta por cento)</b> — {R("R$ 920.000,00")} — devidos contra apresentação do Conhecimento de Embarque (Bill of Lading) da carga em porto de origem (Shanghai/China);</p>
      <p style={{ paddingLeft: 20 }}>c) <b>20% (vinte por cento)</b> — {R("R$ 368.000,00")} — devidos no recebimento do TERMO DE ACEITE FINAL após instalação e comissionamento concluídos.</p>
      <p><span className="clause-num">10.2.</span> Os pagamentos serão realizados via TED para a conta bancária da CONTRATADA, identificada na cláusula 22ª, mediante apresentação de Nota Fiscal de Serviços e Nota Fiscal de Produtos correspondentes.</p>
      <p><span className="clause-num">10.3.</span> O atraso no pagamento de qualquer parcela ensejará multa moratória de 2% (dois por cento) sobre o valor em atraso, acrescida de juros de mora de 1% (um por cento) ao mês, calculados pro rata die.</p>
    </>
  );
}

function ContractPage14({ redacted }) {
  const R = (s) => redacted ? <span className="redact">{s}</span> : <b>{s}</b>;
  return (
    <>
      <h2>CLÁUSULA 14ª — DA ORIGEM DOS EQUIPAMENTOS</h2>
      <p><span className="clause-num">14.1.</span> Os equipamentos objeto deste contrato são produzidos pelo {R("FABRICANTE PARCEIRO HANGZHOU LIFT CO., LTD.")}, localizado em {R("Hangzhou Industrial Park, Zhejiang Province, China")}, sob padrões técnicos rigorosamente alinhados às normas IEC 60834 e EN 81-20.</p>
      <p><span className="clause-num">14.2.</span> A CONTRATADA é {R("distribuidora oficial autorizada")} para o território brasileiro desde {R("2019")}, conforme contrato de distribuição internacional registrado em cartório.</p>
      <p><span className="clause-num">14.3.</span> Todos os equipamentos passam por inspeção pré-embarque na fábrica de origem, com emissão de certificado de qualidade {R("(Certificado FQC nº emitido pelo fabricante)")}, e nova inspeção em território nacional antes da entrega à CONTRATANTE.</p>
      <p><span className="clause-num">14.4.</span> A CONTRATANTE reconhece e aceita expressamente a origem internacional dos equipamentos, ciente de que os prazos de entrega refletem o transit time marítimo internacional descrito na cláusula 11ª.</p>
    </>
  );
}

function romanize(num) {
  const lookup = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 };
  let roman = "";
  for (const i in lookup) { while (num >= lookup[i]) { roman += i; num -= lookup[i]; } }
  return roman;
}

function EngLaudoContent({ photoIds }) {
  const labels = ["Quadro Comando", "Botoeira Cabine", "Casa de Máquinas", "Poço Elevador", "Display Pavimento", "Cabos Tração"];
  return (
    <>
      <div className="alert success" style={{ marginBottom: 14 }}>
        <Icon.check/>
        <div style={{ flex: 1 }}>
          <div className="alert__title">Laudo aprovado pela engenharia interna</div>
          <div className="alert__sub">Daniel Otsuka · 12/mai 16:30 · revisado por Renan Bertoli</div>
        </div>
      </div>
      <div className="up-eyebrow muted" style={{ marginBottom: 8 }}>Resumo do Laudo</div>
      <p className="vp-small" style={{ marginBottom: 12 }}>
        Vistoria realizada em 08/mai/2026. Os 4 elevadores Schindler 9300AE apresentam quadros de comando obsoletos
        (geração 1998), botoeiras corroídas, displays sem retroiluminação, e cabos de tração com sinais de fadiga
        em 2 unidades. Recomenda-se modernização completa conforme BOM anexa.
      </p>
      <div className="grid-2" style={{ gap: 14 }}>
        <KvBlock label="Marca / Modelo" value="Schindler 9300AE"/>
        <KvBlock label="Quantidade" value="4 elevadores"/>
        <KvBlock label="Ano fabricação" value="1998"/>
        <KvBlock label="Capacidade" value="630 kg / 8 pessoas"/>
        <KvBlock label="Altura percurso" value="38m (12 andares)"/>
        <KvBlock label="Velocidade" value="1.5 m/s"/>
      </div>
      <div className="hr"/>
      <div className="up-eyebrow muted" style={{ marginBottom: 8 }}>Fotos da vistoria</div>
      <div className="grid-3" style={{ gap: 8 }}>
        {labels.map((lbl, i) => (
          <div key={lbl} style={{
            aspectRatio: "4/3",
            background: "repeating-linear-gradient(135deg, var(--vp-gray-100) 0 8px, var(--vp-gray-200) 8px 16px)",
            display: "flex", alignItems: "flex-end", justifyContent: "flex-start",
            position: "relative",
            cursor: "pointer",
          }}>
            <span style={{ background: "#000", color: "var(--vp-yellow)", padding: "3px 6px", fontFamily: "var(--font-mono)", fontSize: 9, margin: 6 }}>IMG_{photoIds[i]}</span>
            <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,.75)", color: "#fff", fontSize: 10, padding: "2px 6px", fontWeight: 700 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function EngDocsContent() {
  const docs = [
    { n: "ART_CREA_2026-148.pdf", size: "184 kb", kind: "ART" },
    { n: "Memorial_Descritivo_v3.pdf", size: "412 kb", kind: "MD" },
    { n: "Planta_Casa_Maquinas.dwg", size: "1.2 MB", kind: "CAD" },
    { n: "Esquema_Eletrico_QC.pdf", size: "320 kb", kind: "ELE" },
    { n: "BOM_Schindler_9300AE.xlsx", size: "48 kb", kind: "BOM" },
    { n: "Fotos_Vistoria.zip", size: "18.4 MB", kind: "ZIP" },
    { n: "NBR_16858_checklist.pdf", size: "96 kb", kind: "DOC" },
    { n: "Laudo_Tecnico_Final.pdf", size: "278 kb", kind: "LDO" },
    { n: "Termo_Vistoria_assinado.pdf", size: "112 kb", kind: "ASS" },
    { n: "Cronograma_modernizacao.xlsx", size: "32 kb", kind: "XLS" },
    { n: "Orçamento_pecas.pdf", size: "84 kb", kind: "ORC" },
    { n: "Aprovacao_eng.pdf", size: "44 kb", kind: "APR" },
  ];
  return (
    <div className="grid-3" style={{ gap: 8 }}>
      {docs.map(d => (
        <div key={d.n} style={{ padding: 12, background: "var(--vp-gray-50)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => window.toast("Visualizando " + d.n, "info")}>
          <span style={{ background: "#000", color: "var(--vp-yellow)", padding: "3px 6px", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700 }}>{d.kind}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.n}</div>
            <div className="cell-sub">{d.size}</div>
          </div>
          <Icon.download size={14} color="var(--fg3)"/>
        </div>
      ))}
    </div>
  );
}

function EngBomContent() {
  const bom = [
    { sku: "VP-QC-450", desc: "Quadro Comando MAX-3000 Trifásico", qty: 4, unit: 18400 },
    { sku: "VP-BT-880", desc: "Botoeira Inox c/ Braille", qty: 48, unit: 280 },
    { sku: "VP-CR-3100", desc: "Corrimão Borracha 30m", qty: 4, unit: 1200 },
    { sku: "VP-DG-2400", desc: "Display TFT 4.3'' Pavimento", qty: 48, unit: 340 },
    { sku: "VP-GU-1200", desc: "Guia T127 Otis Gen2 — 2.5m", qty: 16, unit: 2800 },
    { sku: "VP-BI-220", desc: "Barreira Infravermelha 220V", qty: 4, unit: 880 },
  ];
  const total = bom.reduce((a, b) => a + b.qty * b.unit, 0);
  return (
    <div className="table-wrap" style={{ border: 0 }}>
      <table className="t">
        <thead><tr><th>SKU</th><th>Descrição</th><th>Qtd</th><th className="text-right">Unit.</th><th className="text-right">Total</th></tr></thead>
        <tbody>
          {bom.map(b => (
            <tr key={b.sku}>
              <td><span className="sku">{b.sku}</span></td>
              <td>{b.desc}</td>
              <td className="cell-num">{b.qty}</td>
              <td className="cell-money">{fmtBRL(b.unit)}</td>
              <td className="cell-money">{fmtBRL(b.qty * b.unit)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: "var(--vp-gray-50)" }}>
            <td colSpan={4} className="text-right" style={{ fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em" }}>Total BOM</td>
            <td className="cell-money" style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 14 }}>{fmtBRL(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function EngVisitaContent() {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="grid-2" style={{ gap: 14 }}>
        <KvBlock label="Data da visita" value="08/mai/2026"/>
        <KvBlock label="Horário" value="09:30 — 14:00"/>
        <KvBlock label="Responsável VP" value="Daniel Otsuka"/>
        <KvBlock label="Apoio técnico" value="Renan Bertoli"/>
        <KvBlock label="Recebido por" value="André Pessoa (Síndico)"/>
        <KvBlock label="Manutenção atual" value="Ricci Manutenções (3 anos)"/>
      </div>
      <div className="hr"/>
      <div className="up-eyebrow muted" style={{ marginBottom: 8 }}>Observações da Visita</div>
      <p className="vp-small">Acesso ao prédio liberado às 09:30. Vistoria iniciada pela casa de máquinas, seguida por inspeção dos 4 elevadores em uso. Cliente solicitou interrupção de 1 elevador por vez para inspeção do poço. Foram coletadas 47 fotos e medições com paquímetro e trena laser. Síndico se comprometeu a apresentar proposta em reunião do condomínio em 22/mai.</p>
    </div>
  );
}
function InstalacaoPage() {
  const equipes = [
    { id: "EQ-01", nome: "Equipe Alpha — Capital", lider: "Sandro Pellicano", membros: 4, ativo: "Ed. Itacolomi", status: "Em campo" },
    { id: "EQ-02", nome: "Equipe Beta — Capital", lider: "João Vitor", membros: 3, ativo: "Cond. Maxhaus", status: "Em campo" },
    { id: "EQ-03", nome: "Equipe Gamma — Litoral", lider: "Wagner Tibyriçá", membros: 4, ativo: "—", status: "Disponível" },
    { id: "EQ-04", nome: "Equipe Delta — Interior", lider: "Renato Bevilacqua", membros: 3, ativo: "Hosp. Sorocaba", status: "Em campo" },
  ];
  const [tasks, setTasks] = React.useState([
    { t: "Desmontagem cabine elevador 1", done: true, time: "08:00 · concluído", responsavel: "Sandro P." },
    { t: "Remoção quadro de comando antigo", done: true, time: "10:30 · concluído", responsavel: "Sandro P." },
    { t: "Instalação novo quadro MAX-3000", done: true, time: "13:00 · concluído", responsavel: "João V." },
    { t: "Ligação elétrica e parametrização", done: false, time: "agora · em andamento", responsavel: "Sandro P." },
    { t: "Teste de carga e velocidade", done: false, time: "previsto 16h", responsavel: "Sandro P." },
    { t: "Instalação botoeira nova cabine", done: false, time: "previsto 17h", responsavel: "João V." },
    { t: "Teste final + checklist segurança", done: false, time: "amanhã 09h", responsavel: "Equipe" },
    { t: "Assinatura Termo de Aceite cliente", done: false, time: "amanhã 11h", responsavel: "Sandro P. + Síndico" },
  ]);
  const toggleTask = (idx) => {
    setTasks((arr) => arr.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="page-head__l">
          <div className="page-head__eyebrow"><span className="vp-rule"/>Operações · Instalação</div>
          <h1 className="page-head__title">Instalação em Campo</h1>
          <p className="page-head__sub">Equipes ativas, checklist de obra, laudo final e termo de aceite</p>
        </div>
        <div className="page-head__r">
          <Button variant="outline" icon="calendar">Calendário</Button>
          <Button variant="primary" icon="plus">Agendar instalação</Button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <KPI label="Equipes em campo" value="3" unit="/4" sub="capacidade 75%" delta="+1" deltaDir="up" icon="hardhat"/>
        <KPI label="Obras ativas" value="7" sub="em andamento" delta="+2" deltaDir="up" icon="briefcase"/>
        <KPI label="Tempo médio obra" value="14.2" unit="d" sub="meta 16d" delta="-1.8d" deltaDir="up" icon="clock"/>
        <KPI label="Termos de aceite" value="11" sub="este mês" delta="+3" deltaDir="up" icon="check"/>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <Card title="Equipes" sub={`${equipes.length} equipes`} sharp>
          <div className="stack" style={{ gap: 10 }}>
            {equipes.map((e) => (
              <div key={e.id} style={{ padding: 14, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: e.status === "Em campo" ? "var(--vp-yellow)" : "var(--vp-gray-100)", color: e.status === "Em campo" ? "#000" : "var(--fg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon.hardhat size={22}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{e.nome}</div>
                  <div className="cell-sub">{e.lider} · {e.membros} membros · {e.ativo}</div>
                </div>
                <StatusBadge status={e.status === "Em campo" ? "Em rota" : "Aprovado"}/>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Checklist · Ed. Itacolomi — Elev. 1" sub="Equipe Alpha · Sandro P. · dia 3 de 4"
          action={<><Button variant="outline" size="sm" icon="upload">Foto</Button><Button variant="primary" size="sm" icon="signature">Laudo final</Button></>}>
          <div className="progress tall" style={{ marginBottom: 14 }}>
            <span style={{ width: (tasks.filter(t => t.done).length / tasks.length * 100) + "%" }}/>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--border)" }}>
            {tasks.map((t, i) => (
              <div key={i} className={"chk " + (t.done ? "done" : "")} onClick={() => toggleTask(i)}
                role="checkbox" aria-checked={t.done} tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleTask(i); } }}>
                <div className="chk__box"/>
                <div className="chk__title">{t.t}<div className="cell-sub" style={{ marginTop: 2 }}>{t.responsavel}</div></div>
                <div className="chk__meta">{t.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { EngenhariaPage, JuridicoPage, InstalacaoPage });
