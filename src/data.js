/* ============================================================
   data.jsx — Mock data: leads, cot/precificacao, projetos,
   embarques, fretes, contratos. BR realistic.
   ============================================================ */

const VP_BRANDS = ["Atlas Schindler", "Otis", "ThyssenKrupp", "Mitsubishi", "Kone", "Sigma"];
const VP_BUILDINGS = [
  "Ed. Itacolomi", "Ed. Esmeralda da Vila Mariana", "Cond. Park Tower Itaim", "Shopping Vila Olímpia",
  "Hospital São Luiz Morumbi", "Ed. Rio Branco 137", "Cond. Maxhaus Pinheiros", "Aeroporto SBSP",
  "Ed. Faria Lima Plaza", "Cond. Reserva Granja Viana", "Ed. Comercial Berrini", "Cond. Vila Madalena Garden",
  "Metrô Estação Higienópolis", "Ed. Anália Franco Tower", "Cond. Alphaville Residencial", "Shopping Eldorado",
  "Ed. Paulista Square", "Cond. Riviera São Lourenço"
];
const VP_CLIENTS = [
  "Cond. Park Tower Itaim", "Ricci Manutenções", "Athie Wohnrath", "Schahin Engenharia",
  "JFL Realty", "TPA Empreendimentos", "Tegra Incorporadora", "Cyrela Brazil Realty",
  "Even Construtora", "Helbor Empreendimentos", "Aliansce Sonae Shopping"
];
const VP_PARTS = [
  { sku: "VP-DG-2400", name: "Degraus de Escada Rolante 1000mm", cat: "Escada rolante", weight: 18.4 },
  { sku: "VP-CR-3100", name: "Corrimão Borracha 30m Schindler 9300", cat: "Corrimão", weight: 22 },
  { sku: "VP-BT-880", name: "Botoeira Cabine Inox c/ Braille", cat: "Botoeira", weight: 1.2 },
  { sku: "VP-QC-450", name: "Quadro de Comando MAX-3000 Trifásico", cat: "Quadro de Comando", weight: 38 },
  { sku: "VP-GU-1200", name: "Guia T127/T89 Otis Gen2 — 2.5m", cat: "Guia de elevadores", weight: 64 },
  { sku: "VP-BI-220", name: "Barreira Infravermelha 220V — Cortina Cabine", cat: "Barreira infravermelha", weight: 2.4 },
  { sku: "VP-CD-512", name: "Corrente de Degraus 9300AE — Step Chain", cat: "Corrente de degraus", weight: 41 },
];

window.__VP_DATA = {
  brands: VP_BRANDS,
  buildings: VP_BUILDINGS,
  parts: VP_PARTS,
  clients: VP_CLIENTS,

  /* ===== USERS ===== */
  users: {
    comercial: { name: "Letícia Magalhães", role: "Comercial", initials: "LM" },
    engenharia: { name: "Daniel Otsuka", role: "Engenharia", initials: "DO" },
    financeiro: { name: "Cláudia Bertolini", role: "Financeiro", initials: "CB" },
    admin: { name: "Wilson Ferreira", role: "Admin", initials: "WF" }
  },

  /* ===== KPIs ===== */
  kpis: {
    comercial: [
      { label: "Leads do mês", value: "128", unit: "", delta: "+12%", deltaDir: "up", sub: "vs. mar/26" },
      { label: "Cot. em China", value: "23", unit: "", delta: "+4", deltaDir: "up", sub: "abertas" },
      { label: "Propostas enviadas", value: "47", unit: "", delta: "-3", deltaDir: "down", sub: "vs. mar/26" },
      { label: "Conversão Lead→Proposta", value: "27", unit: "%", delta: "+2.1pp", deltaDir: "up", sub: "meta 25%" },
    ],
    engenharia: [
      { label: "Projetos abertos", value: "31", unit: "", delta: "+5", deltaDir: "up", sub: "ativos" },
      { label: "Aguard. laudo técnico", value: "8", unit: "", delta: "-2", deltaDir: "down", sub: "queue" },
      { label: "Visitas semana", value: "12", unit: "", delta: "+3", deltaDir: "up", sub: "agendadas" },
      { label: "SLA médio laudo", value: "3.2", unit: "d", delta: "-0.4d", deltaDir: "up", sub: "meta 4d" },
    ],
    financeiro: [
      { label: "A receber 30d", value: "R$ 2.4", unit: "M", delta: "+R$ 380k", deltaDir: "up", sub: "12 contratos" },
      { label: "Comissões pendentes", value: "R$ 184", unit: "k", delta: "+R$ 22k", deltaDir: "up", sub: "8 vendedores" },
      { label: "Gatilhos próx. 7d", value: "11", unit: "", delta: "+4", deltaDir: "up", sub: "atenção" },
      { label: "Margem média", value: "32.7", unit: "%", delta: "+0.8pp", deltaDir: "up", sub: "Q2/26" },
    ],
    admin: [
      { label: "Projetos ativos", value: "47", unit: "", delta: "+6", deltaDir: "up", sub: "todos módulos" },
      { label: "Embarques em trânsito", value: "9", unit: "", delta: "+2", deltaDir: "up", sub: "Santos+Itaguaí" },
      { label: "Alertas críticos", value: "3", unit: "", delta: "-1", deltaDir: "up", sub: "ver central" },
      { label: "Faturamento YTD", value: "R$ 18.7", unit: "M", delta: "+24%", deltaDir: "up", sub: "vs. 2025" },
    ]
  },

  /* ===== ALERTS ===== */
  alerts: [
    { id: "AL-2026-041", level: "danger", title: "Contrato CT-2026-019 sem assinatura há 14 dias",
      sub: "Cliente: Cond. Park Tower Itaim · Vendedor: Letícia M.", time: "há 2h", module: "Jurídico" },
    { id: "AL-2026-042", level: "danger", title: "Navio MV LIANJIANG atrasado 3 dias — desembarque previsto 12/jun",
      sub: "BL: COSU6029841 · 14 paletes · Santos", time: "há 4h", module: "Importação" },
    { id: "AL-2026-043", level: "warning", title: "Gatilho 50%: pagamento entrada Ed. Itacolomi vence em 2 dias",
      sub: "Contrato CT-2026-007 · R$ 280k", time: "há 6h", module: "Financeiro" },
    { id: "AL-2026-044", level: "warning", title: "Laudo engenharia Cond. Maxhaus aguardando aprovação há 5 dias",
      sub: "Projeto ENG-148 · Daniel O.", time: "ontem", module: "Engenharia" },
    { id: "AL-2026-045", level: "info", title: "Nova solicitação de cotação recebida — Ricci Manutenções",
      sub: "8 itens · Origem: Site público", time: "ontem", module: "Cotações" },
  ],

  /* ===== LEADS ===== */
  leads: [
    { id: "LD-2026-219", date: "2026-05-12", building: "Cond. Park Tower Itaim", contact: "André Pessoa",
      role: "Síndico", phone: "(11) 98821-4477", email: "sindico@parktower.com.br", origin: "Site",
      status: "Em qualificação", value: 480000, equip: "Modernização 4 elevadores Schindler",
      owner: "Letícia M.", priority: "Alta", next: "Ligar 14/mai 10h" },
    { id: "LD-2026-218", date: "2026-05-12", building: "Hospital São Luiz Morumbi", contact: "Gerson Reali",
      role: "Facilities", phone: "(11) 99332-1180", email: "gerson@saoluiz.com.br", origin: "Indicação",
      status: "Aguardando cotação", value: 1240000, equip: "Retrofit 6 elevadores Otis Gen2",
      owner: "Bruno P.", priority: "Alta", next: "Visita técnica 15/mai" },
    { id: "LD-2026-217", date: "2026-05-11", building: "Shopping Vila Olímpia", contact: "Renata Aoki",
      role: "Manutenção", phone: "(11) 97712-0098", email: "renata.aoki@viaolimpia.com", origin: "Site",
      status: "Proposta enviada", value: 320000, equip: "Reposição peças escada rolante",
      owner: "Letícia M.", priority: "Média", next: "Follow-up 16/mai" },
    { id: "LD-2026-216", date: "2026-05-11", building: "Ed. Faria Lima Plaza", contact: "Maurício Salla",
      role: "Engenheiro", phone: "(11) 95567-3322", email: "msalla@flplaza.com.br", origin: "WhatsApp",
      status: "Negociação", value: 890000, equip: "Substituição quadro de comando 3 elev.",
      owner: "Bruno P.", priority: "Alta", next: "Reunião 13/mai 16h" },
    { id: "LD-2026-215", date: "2026-05-10", building: "Cond. Maxhaus Pinheiros", contact: "Tânia Vidal",
      role: "Adm. Condomínio", phone: "(11) 91188-5544", email: "tania@maxhauspinheiros.com.br", origin: "Indicação",
      status: "Convertido", value: 215000, equip: "Modernização botoeiras + corrimão",
      owner: "Letícia M.", priority: "Concluído", next: "—" },
    { id: "LD-2026-214", date: "2026-05-09", building: "Aeroporto SBSP — Terminal Executiva", contact: "Cap. Sérgio Lobo",
      role: "Coord. Operações", phone: "(11) 96644-8821", email: "slobo@sbsp.aero", origin: "Email",
      status: "Em qualificação", value: 2100000, equip: "4 esteiras rolantes 30m + 2 escadas",
      owner: "Daniel O.", priority: "Alta", next: "Reunião 17/mai 9h" },
    { id: "LD-2026-213", date: "2026-05-09", building: "Ed. Anália Franco Tower", contact: "José Bernardo",
      role: "Síndico Profissional", phone: "(11) 98477-2210", email: "jb@anaftower.com.br", origin: "Site",
      status: "Aguardando cotação", value: 162000, equip: "Reposição corrente de degraus",
      owner: "Bruno P.", priority: "Média", next: "Cotação China 14/mai" },
    { id: "LD-2026-212", date: "2026-05-08", building: "Cond. Riviera São Lourenço", contact: "Helena Castro",
      role: "Administradora", phone: "(13) 99772-3318", email: "helena@riviera.com.br", origin: "Site",
      status: "Sem retorno", value: 78000, equip: "1 botoeira + barreira infravermelha",
      owner: "Letícia M.", priority: "Baixa", next: "Reagendar contato" },
    { id: "LD-2026-211", date: "2026-05-08", building: "Metrô Estação Higienópolis", contact: "Eng. Paulo Yamada",
      role: "Manutenção", phone: "(11) 99001-4422", email: "pyamada@metrosp.gov.br", origin: "Licitação",
      status: "Proposta enviada", value: 3400000, equip: "Modernização total 8 esteiras rolantes",
      owner: "Daniel O.", priority: "Alta", next: "Sessão pública 20/mai" },
  ],

  /* ===== COTAÇÕES China ===== */
  cotacoes: [
    { id: "CT-2026-118", date: "2026-05-08", lead: "LD-2026-219", building: "Cond. Park Tower Itaim",
      items: 8, supplier: "Suzhou Vertical Equip.", status: "Aguardando China", deadline: "2026-05-17",
      total: null, currency: "USD", owner: "Letícia M.", token: "vp-pkr-9821" },
    { id: "CT-2026-117", date: "2026-05-07", lead: "LD-2026-218", building: "Hospital São Luiz Morumbi",
      items: 14, supplier: "Hangzhou Lift Co.", status: "Recebida", deadline: "2026-05-14",
      total: 184320, currency: "USD", owner: "Bruno P.", token: "vp-hsl-4412" },
    { id: "CT-2026-116", date: "2026-05-06", lead: "LD-2026-216", building: "Ed. Faria Lima Plaza",
      items: 3, supplier: "Tianjin Control Sys.", status: "Em análise", deadline: "2026-05-13",
      total: 96440, currency: "USD", owner: "Bruno P.", token: "vp-flp-2278" },
    { id: "CT-2026-115", date: "2026-05-05", lead: "LD-2026-211", building: "Metrô Higienópolis",
      items: 22, supplier: "Suzhou Vertical Equip.", status: "Aprovada", deadline: "2026-05-10",
      total: 412800, currency: "USD", owner: "Daniel O.", token: "vp-mtr-0091" },
    { id: "CT-2026-114", date: "2026-05-05", lead: "LD-2026-213", building: "Ed. Anália Franco Tower",
      items: 4, supplier: "Hangzhou Lift Co.", status: "Recebida", deadline: "2026-05-11",
      total: 22180, currency: "USD", owner: "Bruno P.", token: "vp-aft-7733" },
  ],

  /* ===== PROJETOS (gantt) ===== */
  projetos: [
    { id: "PJ-2026-007", name: "Cond. Park Tower — Modernização", client: "JFL Realty",
      start: "2026-04-10", end: "2026-08-22", phases: [
        { name: "Lead/Cotação", start: 0, end: 20, status: "done" },
        { name: "Proposta+Contrato", start: 20, end: 38, status: "done" },
        { name: "Engenharia", start: 38, end: 65, status: "current" },
        { name: "Importação", start: 55, end: 100, status: "future" },
        { name: "Instalação", start: 92, end: 125, status: "future" },
      ], owner: "Letícia M.", value: 480000 },
    { id: "PJ-2026-006", name: "Hospital São Luiz — Retrofit Gen2", client: "Hospital São Luiz",
      start: "2026-03-22", end: "2026-09-15", phases: [
        { name: "Lead/Cotação", start: 0, end: 18, status: "done" },
        { name: "Proposta+Contrato", start: 18, end: 30, status: "done" },
        { name: "Engenharia", start: 30, end: 48, status: "done" },
        { name: "Importação", start: 48, end: 105, status: "current" },
        { name: "Instalação", start: 95, end: 175, status: "future" },
      ], owner: "Bruno P.", value: 1240000 },
    { id: "PJ-2026-005", name: "Ed. Itacolomi — Substituição QC", client: "Cyrela Brazil",
      start: "2026-02-08", end: "2026-06-30", phases: [
        { name: "Lead/Cotação", start: 0, end: 12, status: "done" },
        { name: "Proposta+Contrato", start: 12, end: 25, status: "done" },
        { name: "Engenharia", start: 25, end: 40, status: "done" },
        { name: "Importação", start: 40, end: 92, status: "done" },
        { name: "Instalação", start: 85, end: 143, status: "current" },
      ], owner: "Letícia M.", value: 320000 },
    { id: "PJ-2026-004", name: "Aeroporto SBSP — Esteiras Terminal", client: "Concessionária SBSP",
      start: "2026-05-01", end: "2027-02-10", phases: [
        { name: "Lead/Cotação", start: 0, end: 15, status: "current" },
        { name: "Proposta+Contrato", start: 15, end: 35, status: "future" },
        { name: "Engenharia", start: 35, end: 65, status: "future" },
        { name: "Importação", start: 60, end: 200, status: "future" },
        { name: "Instalação", start: 180, end: 285, status: "future" },
      ], owner: "Daniel O.", value: 2100000 },
    { id: "PJ-2026-003", name: "Shopping Vila Olímpia — Escadas", client: "Aliansce Sonae",
      start: "2026-03-15", end: "2026-07-18", phases: [
        { name: "Lead/Cotação", start: 0, end: 15, status: "done" },
        { name: "Proposta+Contrato", start: 15, end: 28, status: "done" },
        { name: "Engenharia", start: 28, end: 45, status: "current" },
        { name: "Importação", start: 42, end: 95, status: "future" },
        { name: "Instalação", start: 88, end: 125, status: "future" },
      ], owner: "Letícia M.", value: 320000 },
  ],

  /* ===== IMPORTAÇÃO / EMBARQUES ===== */
  embarques: [
    {
      id: "EMB-2026-009", bl: "COSU6029841", projeto: "PJ-2026-006", client: "Hospital São Luiz",
      vessel: "MV LIANJIANG", line: "COSCO", containers: 2, type: "20'DC",
      from: "Shanghai (CNSHA)", to: "Santos (BRSSZ)", etd: "2026-04-21", eta: "2026-06-12",
      etaOriginal: "2026-06-09", status: "Em trânsito", channel: null, position: 0.62,
      lat: -8.4, lng: -34.2, // currently approaching Brazil
      speed: 16.2, heading: 235, // SW
      docs: ["BL ✓", "Invoice ✓", "Packing List ✓", "Certificate of Origin ✓", "Seguro pendente"],
      milestones: [
        { label: "Booking confirmado", date: "2026-04-12", state: "done" },
        { label: "Carregamento Shanghai", date: "2026-04-21", state: "done" },
        { label: "Saída origem (ETD)", date: "2026-04-23", state: "done" },
        { label: "Trânsito marítimo", date: "—", state: "current", note: "Atraso de 3 dias" },
        { label: "Chegada Santos (ETA)", date: "2026-06-12", state: "future" },
        { label: "Liberação aduaneira", date: "—", state: "future" },
      ]
    },
    {
      id: "EMB-2026-008", bl: "MAEU4912200", projeto: "PJ-2026-005", client: "Cyrela Brazil",
      vessel: "MAERSK TUKANG", line: "Maersk", containers: 1, type: "40'HC",
      from: "Ningbo (CNNGB)", to: "Itaguaí (BRIGI)", etd: "2026-03-08", eta: "2026-05-02",
      etaOriginal: "2026-05-02", status: "Liberação aduaneira", channel: "Amarelo", position: 0.95,
      lat: -22.9, lng: -43.7,
      speed: 0, heading: 0,
      docs: ["BL ✓", "Invoice ✓", "Packing List ✓", "DI registrada"],
      milestones: [
        { label: "Booking confirmado", date: "2026-02-25", state: "done" },
        { label: "Carregamento Ningbo", date: "2026-03-08", state: "done" },
        { label: "Saída origem (ETD)", date: "2026-03-10", state: "done" },
        { label: "Chegada Itaguaí", date: "2026-05-02", state: "done" },
        { label: "Liberação aduaneira", date: "—", state: "current", note: "Canal amarelo" },
        { label: "Entrega CD São Paulo", date: "2026-05-18", state: "future" },
      ]
    },
    {
      id: "EMB-2026-007", bl: "OOLU8740019", projeto: "PJ-2026-003", client: "Aliansce Sonae",
      vessel: "OOCL HAMBURG", line: "OOCL", containers: 1, type: "40'HC",
      from: "Qingdao (CNTAO)", to: "Santos (BRSSZ)", etd: "2026-04-30", eta: "2026-06-20",
      etaOriginal: "2026-06-20", status: "Em trânsito", channel: null, position: 0.35,
      lat: 3.2, lng: 80.5, // Indian ocean
      speed: 17.8, heading: 250,
      docs: ["BL ✓", "Invoice ✓", "Packing List ✓", "Origem aguardando"],
      milestones: [
        { label: "Booking confirmado", date: "2026-04-18", state: "done" },
        { label: "Carregamento Qingdao", date: "2026-04-30", state: "done" },
        { label: "Saída origem (ETD)", date: "2026-05-02", state: "done" },
        { label: "Trânsito marítimo", date: "—", state: "current" },
        { label: "Chegada Santos (ETA)", date: "2026-06-20", state: "future" },
        { label: "Liberação aduaneira", date: "—", state: "future" },
      ]
    },
    {
      id: "EMB-2026-006", bl: "HLCU9921104", projeto: "PJ-2026-008", client: "Tegra",
      vessel: "BARZAN", line: "Hapag-Lloyd", containers: 1, type: "20'DC",
      from: "Shanghai (CNSHA)", to: "Santos (BRSSZ)", etd: "2026-02-14", eta: "2026-04-09",
      etaOriginal: "2026-04-09", status: "Entregue", channel: "Verde", position: 1.0,
      lat: null, lng: null,
      speed: 0, heading: 0,
      docs: ["Concluído"],
      milestones: [
        { label: "Booking confirmado", date: "2026-02-02", state: "done" },
        { label: "Carregamento Shanghai", date: "2026-02-14", state: "done" },
        { label: "Saída origem", date: "2026-02-16", state: "done" },
        { label: "Chegada Santos", date: "2026-04-09", state: "done" },
        { label: "Liberação aduaneira", date: "2026-04-12", state: "done", note: "Canal verde" },
        { label: "Entrega final", date: "2026-04-18", state: "done" },
      ]
    },
  ],

  /* ===== Fretes nacionais ===== */
  fretes: [
    { id: "FR-2026-051", origem: "CD Guarulhos", destino: "Ed. Itacolomi, SP", transportadora: "TransLog SP",
      placa: "FRZ-8821", driver: "Manoel Ribeiro", status: "Em rota", eta: "Hoje 16:30",
      itens: 12, peso: 480, valor: 4200, ocorrencias: 0 },
    { id: "FR-2026-050", origem: "CD Guarulhos", destino: "Hospital São Luiz, SP", transportadora: "Patrus",
      placa: "GFR-2244", driver: "Carlos Vieira", status: "Saiu CD", eta: "Hoje 18:00",
      itens: 4, peso: 110, valor: 1800, ocorrencias: 1 },
    { id: "FR-2026-049", origem: "CD Guarulhos", destino: "Aeroporto SBSP, SP", transportadora: "Braspress",
      placa: "JLM-5511", driver: "Pedro Aguilar", status: "Entregue", eta: "11/mai 09:42",
      itens: 22, peso: 1340, valor: 8800, ocorrencias: 0 },
    { id: "FR-2026-048", origem: "Porto Santos", destino: "CD Guarulhos", transportadora: "Rodrimar Cargo",
      placa: "KZE-0099", driver: "Antônio Souza", status: "Aguardando coleta", eta: "13/mai 14:00",
      itens: 14, peso: 2200, valor: 12000, ocorrencias: 0 },
    { id: "FR-2026-047", origem: "CD Guarulhos", destino: "Cond. Park Tower, SP", transportadora: "JadLog",
      placa: "LPM-7733", driver: "Sérgio Beltrame", status: "Atraso", eta: "Atrasado 2d",
      itens: 8, peso: 320, valor: 3200, ocorrencias: 2 },
  ],

  /* ===== Contratos jurídico ===== */
  contratos: [
    { id: "CT-2026-019", projeto: "PJ-2026-007", client: "Cond. Park Tower Itaim",
      value: 480000, status: "Aguardando assinatura", days: 14, pages: 18, redacted: 0,
      issued: "2026-04-26", lawyer: "Marina Aragão" },
    { id: "CT-2026-018", projeto: "PJ-2026-006", client: "Hospital São Luiz",
      value: 1240000, status: "Em redação", days: 6, pages: 24, redacted: 3,
      issued: "2026-05-04", lawyer: "Marina Aragão" },
    { id: "CT-2026-017", projeto: "PJ-2026-005", client: "Cyrela Brazil",
      value: 320000, status: "Assinado", days: 0, pages: 16, redacted: 2,
      issued: "2026-02-15", lawyer: "Renato Mei" },
    { id: "CT-2026-016", projeto: "PJ-2026-003", client: "Aliansce Sonae",
      value: 320000, status: "Em assinatura digital", days: 2, pages: 19, redacted: 4,
      issued: "2026-05-06", lawyer: "Marina Aragão" },
  ],

  /* ===== Comissões ===== */
  comissoes: [
    { vendedor: "Letícia Magalhães", role: "Comercial Sr.", projetos: 8, faturado: 1840000, comissao: 73600, pct: 4, status: "Aprovado" },
    { vendedor: "Bruno Pacheco", role: "Comercial Pleno", projetos: 5, faturado: 920000, comissao: 27600, pct: 3, status: "Aprovado" },
    { vendedor: "Daniel Otsuka", role: "Eng. Comercial", projetos: 3, faturado: 5600000, comissao: 112000, pct: 2, status: "Aguardando" },
    { vendedor: "Patrícia Holm", role: "Comercial Pleno", projetos: 4, faturado: 680000, comissao: 20400, pct: 3, status: "Pago" },
    { vendedor: "Cláudio Bertolini", role: "Gerente Comercial", projetos: 0, faturado: 9040000, comissao: 45200, pct: 0.5, status: "Aguardando" },
  ],

  /* ===== Engenharia ===== */
  projetosEng: [
    { id: "ENG-148", projeto: "PJ-2026-007", building: "Cond. Park Tower", status: "Vistoria realizada",
      visita: "2026-05-08", responsavel: "Daniel O.", arquivos: 12, laudo: "Aprovado",
      pendencia: "Aguardando assinatura cliente" },
    { id: "ENG-147", projeto: "PJ-2026-006", building: "Hospital São Luiz", status: "Laudo em revisão",
      visita: "2026-04-30", responsavel: "Renan Bertoli", arquivos: 18, laudo: "Em análise",
      pendencia: "Validação medidas guia T127" },
    { id: "ENG-146", projeto: "PJ-2026-004", building: "Aeroporto SBSP", status: "Vistoria agendada",
      visita: "2026-05-17", responsavel: "Daniel O.", arquivos: 4, laudo: "—",
      pendencia: "Visita técnica" },
    { id: "ENG-145", projeto: "PJ-2026-003", building: "Shopping Vila Olímpia", status: "Aguardando aprovação",
      visita: "2026-04-22", responsavel: "Renan Bertoli", arquivos: 9, laudo: "Reprovado",
      pendencia: "Refazer medições corrente degraus" },
  ],

  /* ===== Emails (inbox) ===== */
  emails: {
    importacao: [
      { id: "em-1", from: "freight.ops@cosco.com", subject: "[COSU6029841] Update: ETA delay 3 days — Santos",
        time: "08:42", date: "13/mai", preview: "Dear Customer, please be informed the vessel MV LIANJIANG has been...", unread: true, attached: 1, tags: ["BL", "Urgente"] },
      { id: "em-2", from: "tianjin.export@control-sys.cn", subject: "RE: Invoice CT-2026-116 — Pricing confirmation",
        time: "06:18", date: "13/mai", preview: "Hi Bruno, attached please find the updated PI with 5% supplier discount...", unread: true, attached: 2, tags: ["Invoice"] },
      { id: "em-3", from: "broker@bsmlog.com.br", subject: "Canal Amarelo confirmado — MAEU4912200 (Itaguaí)",
        time: "ontem 17:32", date: "12/mai", preview: "Olá Cláudia, a DI foi parametrizada em canal amarelo. Documentos solicitados...", unread: false, attached: 3, tags: ["Aduana"] },
      { id: "em-4", from: "rastreio@vesselfinder.com", subject: "Position update — OOCL HAMBURG",
        time: "ontem 14:10", date: "12/mai", preview: "Daily tracking digest for monitored vessel OOCL HAMBURG. Current position...", unread: false, attached: 0, tags: ["Auto"] },
      { id: "em-5", from: "hangzhoulift@supplier.cn", subject: "Packing photos — HSL retrofit",
        time: "ontem 10:55", date: "12/mai", preview: "Dear Bruno, please find attached the packing photos before container loading...", unread: false, attached: 8, tags: ["Foto"] },
    ],
    compras: [
      { id: "em-6", from: "carlos.vieira@patrus.com.br", subject: "Confirmação coleta — FR-2026-050",
        time: "10:14", date: "13/mai", preview: "Boa tarde Cláudia, motorista a caminho. Previsão de coleta 11h e entrega...", unread: true, attached: 0, tags: ["Frete"] },
      { id: "em-7", from: "ocorrencias@translog.com.br", subject: "OCORRÊNCIA — FR-2026-047 (Park Tower)",
        time: "09:31", date: "13/mai", preview: "Prezados, registramos avaria leve em 2 caixas durante transporte. Fotos em anexo...", unread: true, attached: 6, tags: ["Avaria"] },
      { id: "em-8", from: "logistica@braspress.com.br", subject: "Comprovante de entrega — FR-2026-049",
        time: "ontem 11:42", date: "12/mai", preview: "Olá, segue comprovante de entrega assinado pelo recebedor. Total: 22 itens...", unread: false, attached: 2, tags: ["CTe"] },
    ]
  },

  /* ===== Notificações ===== */
  notifications: [
    { id: "n-1", title: "Letícia atribuiu a você: \"Revisar proposta Park Tower\"", time: "agora", icon: "user-plus", unread: true, module: "Propostas" },
    { id: "n-2", title: "Pagamento entrada confirmado — Ed. Itacolomi (R$ 280k)", time: "12 min", icon: "check", unread: true, module: "Financeiro" },
    { id: "n-3", title: "Navio MV LIANJIANG atualizou posição — atraso 3d", time: "2 h", icon: "ship", unread: true, module: "Importação" },
    { id: "n-4", title: "Nova cotação recebida da Hangzhou Lift Co.", time: "3 h", icon: "mail", unread: false, module: "Cotações" },
    { id: "n-5", title: "Daniel concluiu laudo — Cond. Maxhaus", time: "5 h", icon: "check", unread: false, module: "Engenharia" },
    { id: "n-6", title: "@você foi mencionado em CT-2026-019", time: "ontem", icon: "at-sign", unread: false, module: "Jurídico" },
    { id: "n-7", title: "Comissão Q1/26 aprovada — R$ 73,6k", time: "ontem", icon: "dollar", unread: false, module: "Comissões" },
    { id: "n-8", title: "Visita técnica reagendada — Aeroporto SBSP", time: "2d", icon: "calendar", unread: false, module: "Engenharia" },
  ],

  /* ===== Triggers Financeiros (prazo reverso) ===== */
  gatilhos: [
    { id: "g-1", projeto: "PJ-2026-007", building: "Cond. Park Tower", trigger: "Entrada 30% (assinatura)",
      value: 144000, dueDate: "2026-05-15", daysLeft: 2, status: "pendente",
      reverseFrom: "Instalação 22/08/26", chain: ["Aprovação eng. 18/mai", "Importação 60d", "Instalação 22/ago"] },
    { id: "g-2", projeto: "PJ-2026-006", building: "Hospital São Luiz", trigger: "Pagamento 50% (embarque)",
      value: 620000, dueDate: "2026-05-22", daysLeft: 9, status: "pendente",
      reverseFrom: "Instalação 15/09/26", chain: ["Embarque 22/mai", "Trânsito 50d", "Liberação 7d", "Instalação 15/set"] },
    { id: "g-3", projeto: "PJ-2026-005", building: "Ed. Itacolomi", trigger: "Pagamento 50% (entrada)",
      value: 280000, dueDate: "2026-05-15", daysLeft: 2, status: "atencao",
      reverseFrom: "Já em instalação", chain: ["Instalação em andamento — desde 25/abr"] },
    { id: "g-4", projeto: "PJ-2026-003", building: "Shopping Vila Olímpia", trigger: "Aprovação técnica + pagamento",
      value: 96000, dueDate: "2026-05-18", daysLeft: 5, status: "pendente",
      reverseFrom: "Instalação 18/07/26", chain: ["Aprov. eng. 18/mai", "Importação 35d", "Instalação 18/jul"] },
    { id: "g-5", projeto: "PJ-2026-004", building: "Aeroporto SBSP", trigger: "Sinal pré-contrato",
      value: 105000, dueDate: "2026-05-25", daysLeft: 12, status: "ok",
      reverseFrom: "Licitação 20/mai", chain: ["Sessão pública 20/mai", "Adjudicação 27/mai", "Sinal 25/mai"] },
  ]
};

/* ============================================================
   Utilitário global: exportação CSV
   ============================================================ */
window.csvDownload = function(rows, filename) {
  if (!rows || !rows.length) return window.toast('Nenhum dado para exportar.', 'warning');
  const keys = Object.keys(rows[0]);
  const esc  = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv  = [keys.map(esc).join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  window.toast('CSV exportado: ' + filename, 'success');
};
