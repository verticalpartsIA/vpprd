/* ============================================================
   dashboard.jsx — Dashboard Principal
   - KPIs filtered by role
   - Central de Alertas
   - Gantt: projetos em andamento por fase
   ============================================================ */

function GanttChart({ projetos, onClick }) {
  // Each row 32px tall; phases coloured by status
  // x axis 0..200 (days). Width: 100% with internal time labels at 0/25/50/75/100/125/150/175/200d
  const today = 60; // pretend "today" is day 60 from start of view
  const ticks = [0, 25, 50, 75, 100, 125, 150, 175, 200];
  return (
    <div className="gantt">
      <div className="gantt__head">
        <div className="gantt__lblcol">Projeto / Cliente</div>
        <div className="gantt__chart">
          {ticks.map(t => <div key={t} className="gantt__tick" style={{ left: (t / 200 * 100) + "%" }}>+{t}d</div>)}
        </div>
      </div>
      <div className="gantt__rows">
        {projetos.map((p) => (
          <div key={p.id} className="gantt__row" onClick={() => onClick?.(p)}>
            <div className="gantt__lblcol">
              <div className="gantt__name">{p.name}</div>
              <div className="gantt__sub">{p.client} · <span className="mono">{p.id}</span></div>
            </div>
            <div className="gantt__chart">
              <div className="gantt__rail"/>
              {/* today marker */}
              <div className="gantt__today" style={{ left: (today / 200 * 100) + "%" }}>
                <span>HOJE</span>
              </div>
              {p.phases.map((ph, i) => (
                <div key={i}
                  className={"gantt__bar gantt__bar--" + ph.status}
                  style={{ left: (ph.start / 200 * 100) + "%", width: ((ph.end - ph.start) / 200 * 100) + "%" }}>
                  <span>{ph.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="gantt__legend">
        <span><i className="gantt-sw done"/>Concluído</span>
        <span><i className="gantt-sw current"/>Em andamento</span>
        <span><i className="gantt-sw future"/>Planejado</span>
        <span><i className="gantt-sw today"/>Hoje</span>
      </div>
    </div>
  );
}

function Dashboard({ role, setRoute }) {
  const D = window.__VP_DATA;
  const kpis = D.kpis[role] || D.kpis.admin;
  const u = ROLE_MAP[role];
  const firstName = u.name.split(" ")[0];

  // pinned tasks per role (mock)
  const tasks = {
    comercial: [
      { t: "Ligar Cond. Park Tower — André Pessoa", time: "Hoje 14h", prio: "Alta", module: "Leads" },
      { t: "Enviar proposta Hospital São Luiz", time: "Hoje 17h", prio: "Alta", module: "Propostas" },
      { t: "Follow-up Shopping Vila Olímpia", time: "Amanhã 10h", prio: "Média", module: "Leads" },
      { t: "Revisar versão 3 da precificação ENG-148", time: "Amanhã", prio: "Média", module: "Precificação" },
    ],
    engenharia: [
      { t: "Visita técnica Aeroporto SBSP", time: "17/mai 9h", prio: "Alta", module: "Engenharia" },
      { t: "Concluir laudo Hospital São Luiz", time: "Hoje", prio: "Alta", module: "Engenharia" },
      { t: "Aprovar BOM Park Tower modernização", time: "Amanhã", prio: "Média", module: "Engenharia" },
      { t: "Reunião kickoff Cyrela Itacolomi", time: "16/mai 16h", prio: "Média", module: "Instalação" },
    ],
    financeiro: [
      { t: "Confirmar pagamento entrada Ed. Itacolomi (R$ 280k)", time: "Hoje", prio: "Alta", module: "Financeiro" },
      { t: "Liberar comissões Q1/26", time: "Hoje", prio: "Alta", module: "Comissões" },
      { t: "Conciliar invoice CT-2026-116 (USD)", time: "Amanhã", prio: "Média", module: "Importação" },
      { t: "Validar gatilho 50% Hospital São Luiz", time: "22/mai", prio: "Média", module: "Financeiro" },
    ],
    admin: [
      { t: "Reunião gerencial semanal", time: "Hoje 16h", prio: "Alta", module: "Geral" },
      { t: "Revisar pipeline comercial Q2/26", time: "Hoje", prio: "Alta", module: "Comercial" },
      { t: "Auditoria de permissões — perfil Financeiro", time: "Amanhã", prio: "Média", module: "Admin" },
      { t: "Validar config. SMTP/IMAP Importação", time: "Amanhã", prio: "Baixa", module: "Admin" },
    ],
  }[role];

  // ranked alerts: danger first
  const alerts = [...D.alerts].sort((a,b) => {
    const order = { danger: 0, warning: 1, info: 2 };
    return order[a.level] - order[b.level];
  });

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="page-head__l">
          <div className="page-head__eyebrow">
            <span className="vp-rule" style={{ display: "inline-block", width: 24, height: 3, background: "var(--vp-yellow)" }}/>
            Dashboard {role}
          </div>
          <h1 className="page-head__title">{greet}, {firstName.toUpperCase()}.</h1>
          <p className="page-head__sub">
            Quarta-feira, 13 de maio de 2026. Você tem <b>3 alertas críticos</b> e <b>{tasks.length} tarefas</b> hoje.
          </p>
        </div>
        <div className="page-head__r">
          <Button variant="outline" icon="calendar">Hoje · 13/mai</Button>
          <Button variant="secondary" icon="download">Relatório</Button>
          <Button variant="primary" icon="plus">Novo Lead</Button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {kpis.map((k, i) => <KPI key={i} {...k} icon={["flag","globe","proposal","trending","ruler","fileText","calendar","clock","dollar","award","zap","trending","briefcase","ship","warning","trending"][i % 16]}/>)}
      </div>

      <div className="split" style={{ marginBottom: 20 }}>
        <Card title="Projetos em Andamento" sub={projetos_count(D) + " projetos · 5 fases · timeline 200 dias"}
          action={<>
            <div className="seg">
              <button className="is-active">Gantt</button>
              <button>Lista</button>
              <button>Kanban</button>
            </div>
            <Button variant="ghost" size="sm" icon="expand"/>
          </>}>
          <GanttChart projetos={D.projetos} onClick={() => setRoute("propostas")}/>
        </Card>

        <Card title="Tarefas de Hoje" sub={tasks.length + " pendentes"} action={<Button variant="ghost" size="sm" icon="plus"/>}>
          <div className="stack">
            {tasks.map((t, i) => (
              <div key={i} className="task-row">
                <input type="checkbox"/>
                <div className="task-row__body">
                  <div className="task-row__title">{t.t}</div>
                  <div className="task-row__meta">
                    <span className="mono">{t.time}</span>
                    <span>·</span>
                    <span>{t.module}</span>
                  </div>
                </div>
                <Badge variant={t.prio === "Alta" ? "danger" : t.prio === "Média" ? "warning" : "neutral"}>{t.prio}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Central de Alertas" sub="ações pendentes que requerem sua atenção" style={{ marginBottom: 20 }}
        action={<Button variant="ghost" size="sm" iconRight="arrowRight" onClick={() => setRoute("notificacoes")}>Ver tudo</Button>}>
        <div className="stack">
          {alerts.map((a) => <AlertRow key={a.id} alert={a} onClick={() => setRoute(a.module === "Importação" ? "importacao" : a.module === "Jurídico" ? "juridico" : a.module === "Financeiro" ? "financeiro" : a.module === "Engenharia" ? "engenharia" : "cotacoes")}/>)}
        </div>
      </Card>

      <div className="grid-3">
        <Card title="Pipeline Comercial" sub="ABR–MAI 2026">
          <PipelineFunnel/>
        </Card>
        <Card title="Conversão por Origem" sub="abril 2026">
          <OriginBars/>
        </Card>
        <div>
          <NcmDashboardWidget setRoute={setRoute}/>
          <div style={{ height: 16 }}/>
          <Card title="Estoque Crítico" sub="peças com saldo < 5 unidades"
            action={<Button variant="ghost" size="sm" iconRight="arrowRight">Detalhar</Button>}>
            <div className="stack">
              <StockRow sku="VP-DG-2400" name="Degraus Esc. Rolante 1000mm" qty={2} min={6} status="danger"/>
              <StockRow sku="VP-CR-3100" name="Corrimão Schindler 9300" qty={4} min={5} status="warning"/>
              <StockRow sku="VP-BI-220"  name="Barreira Infravermelha 220V" qty={3} min={8} status="danger"/>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function projetos_count(D) { return D.projetos.length; }

function PipelineFunnel() {
  const stages = [
    { label: "Leads", value: 128, color: "#000" },
    { label: "Cotação China", value: 47, color: "var(--vp-gray-700)" },
    { label: "Precificação", value: 31, color: "var(--vp-gray-500)" },
    { label: "Proposta", value: 18, color: "var(--vp-yellow-press)" },
    { label: "Contrato", value: 12, color: "var(--vp-yellow)" },
  ];
  const max = stages[0].value;
  return (
    <div className="stack" style={{ gap: 8 }}>
      {stages.map((s) => (
        <div key={s.label} className="funnel-row">
          <div className="funnel-row__lbl">{s.label}</div>
          <div className="funnel-row__bar">
            <div style={{ width: (s.value / max * 100) + "%", background: s.color }}>
              <span>{s.value}</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <span className="muted small">Conversão Lead→Contrato</span>
        <span className="mono" style={{ fontWeight: 700 }}>9.4%</span>
      </div>
    </div>
  );
}

function OriginBars() {
  const data = [
    { l: "Site",       v: 42, conv: 28 },
    { l: "Indicação",  v: 31, conv: 41 },
    { l: "WhatsApp",   v: 24, conv: 19 },
    { l: "Licitação",  v: 18, conv: 22 },
    { l: "Email",      v: 13, conv: 31 },
  ];
  const max = 42;
  return (
    <div className="stack" style={{ gap: 10 }}>
      {data.map((d) => (
        <div key={d.l} className="origin-row">
          <div className="origin-row__lbl">{d.l}</div>
          <div className="origin-row__bar"><div style={{ width: (d.v / max * 100) + "%" }}/></div>
          <div className="origin-row__val mono">{d.v}</div>
          <div className="origin-row__pct" style={{ color: d.conv > 30 ? "var(--vp-success)" : "var(--fg3)" }}>{d.conv}%</div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--fg3)" }}>
        <span>volume</span>
        <span>conversão</span>
      </div>
    </div>
  );
}

function StockRow({ sku, name, qty, min, status }) {
  return (
    <div className="stock-row">
      <div className="status-dot" style={{ background: status === "danger" ? "var(--vp-danger)" : status === "warning" ? "var(--vp-warning)" : "var(--vp-success)" }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="cell-main" style={{ fontSize: 12 }}>{name}</div>
        <div className="cell-sub">{sku} · min {min}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="mono tabular" style={{ fontSize: 16, fontWeight: 700 }}>{qty}</div>
        <div className="cell-sub">em estoque</div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
