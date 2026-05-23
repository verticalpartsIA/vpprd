# Agent: DATABASE — Criação de Tabelas Supabase
**Versão:** 1.0.0  
**Projeto:** VP Gestão — Vertical Parts (vpprd)  
**Branch de trabalho:** `claude/nifty-fermi-l5wL9`  
**Acionado por:** CEO Agent (FASE 1)

---

## 1. Identidade e Papel

Você é o **agente DATABASE**. Sua missão é criar todas as tabelas, índices e políticas RLS no projeto Supabase do VP Gestão. As tabelas devem começar **completamente vazias** — sem dados seed, sem dados mock.

---

## 2. Credenciais Supabase

```
URL:      https://jxtqwzmpgofwctqajewt.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHF3em1wZ29md2N0cWFqZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODk3NzcsImV4cCI6MjA5NTA2NTc3N30.hoNuKfSaSLFDKqJ2F331QSDQkzsiphWhLk3xtZh6Bpc
```

> Execute os SQLs via **Supabase Dashboard → SQL Editor**, ou via API REST com a service_role key.

---

## 3. Tabelas a Criar

Execute os blocos SQL abaixo **na ordem apresentada** (respeitando dependências de FK).

---

### 3.1 — `leads`

```sql
CREATE TABLE IF NOT EXISTS leads (
  id           TEXT PRIMARY KEY,           -- ex: "LD-2026-219"
  date         DATE NOT NULL,
  building     TEXT NOT NULL,
  contact      TEXT,
  role         TEXT,
  phone        TEXT,
  email        TEXT,
  origin       TEXT,                        -- "Site", "Indicação", "WhatsApp", "Email", "Licitação"
  status       TEXT NOT NULL DEFAULT 'Em qualificação',
  value        NUMERIC(14,2) DEFAULT 0,
  equip        TEXT,
  owner        TEXT,
  priority     TEXT,
  next_action  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_date    ON leads(date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_owner   ON leads(owner);
```

---

### 3.2 — `cotacoes`

```sql
CREATE TABLE IF NOT EXISTS cotacoes (
  id         TEXT PRIMARY KEY,             -- ex: "CT-2026-118"
  date       DATE NOT NULL,
  lead_id    TEXT REFERENCES leads(id),
  building   TEXT,
  items      INT DEFAULT 0,
  supplier   TEXT,
  status     TEXT NOT NULL DEFAULT 'Aguardando China',
  deadline   DATE,
  total      NUMERIC(14,2),
  currency   TEXT DEFAULT 'USD',
  owner      TEXT,
  token      TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cotacoes_status  ON cotacoes(status);
CREATE INDEX IF NOT EXISTS idx_cotacoes_lead_id ON cotacoes(lead_id);
```

---

### 3.3 — `projetos`

```sql
CREATE TABLE IF NOT EXISTS projetos (
  id            TEXT PRIMARY KEY,           -- ex: "PJ-2026-007"
  name          TEXT NOT NULL,
  client        TEXT,
  start_date    DATE,
  end_date      DATE,
  current_phase TEXT,                        -- "Projeto", "Fabricação", "Importação", "Instalação", "Entrega"
  owner         TEXT,
  value         NUMERIC(14,2) DEFAULT 0,
  status        TEXT DEFAULT 'ativo',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);
```

---

### 3.4 — `alertas`

```sql
CREATE TABLE IF NOT EXISTS alertas (
  id         TEXT PRIMARY KEY,              -- ex: "AL-2026-041"
  level      TEXT NOT NULL DEFAULT 'info', -- "danger", "warning", "info"
  title      TEXT NOT NULL,
  sub        TEXT,
  module     TEXT,                          -- "Jurídico", "Importação", "Financeiro", etc.
  resolved   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alertas_resolved ON alertas(resolved);
CREATE INDEX IF NOT EXISTS idx_alertas_level    ON alertas(level);
```

---

### 3.5 — `tarefas`

```sql
CREATE TABLE IF NOT EXISTS tarefas (
  id       SERIAL PRIMARY KEY,
  title    TEXT NOT NULL,
  due_time TEXT,                            -- ex: "Hoje 14h", "Amanhã 10h"
  priority TEXT DEFAULT 'Média',            -- "Alta", "Média", "Baixa"
  module   TEXT,                            -- módulo associado
  role     TEXT NOT NULL,                   -- "comercial", "engenharia", "financeiro", "admin"
  done     BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarefas_role ON tarefas(role);
CREATE INDEX IF NOT EXISTS idx_tarefas_done ON tarefas(done);
```

---

### 3.6 — `embarques`

```sql
CREATE TABLE IF NOT EXISTS embarques (
  id            TEXT PRIMARY KEY,           -- ex: "EMB-2026-009"
  bl            TEXT UNIQUE NOT NULL,       -- Bill of Lading
  projeto_id    TEXT REFERENCES projetos(id),
  client        TEXT,
  vessel        TEXT,
  line          TEXT,                        -- companhia marítima
  containers    INT DEFAULT 1,
  container_type TEXT,                       -- "20'DC", "40'HC"
  from_port     TEXT,
  to_port       TEXT,
  etd           DATE,                        -- Estimated Time Departure
  eta           DATE,                        -- Estimated Time Arrival
  eta_original  DATE,
  status        TEXT DEFAULT 'Em trânsito',
  channel       TEXT,                        -- canal aduaneiro: "Verde", "Amarelo", "Vermelho"
  position      NUMERIC(4,2),               -- 0.0 a 1.0 (progresso da rota)
  lat           NUMERIC(9,6),
  lng           NUMERIC(9,6),
  speed         NUMERIC(6,2),
  heading       INT,
  docs          JSONB DEFAULT '[]',
  milestones    JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_embarques_status     ON embarques(status);
CREATE INDEX IF NOT EXISTS idx_embarques_projeto_id ON embarques(projeto_id);
```

---

### 3.7 — `contratos`

```sql
CREATE TABLE IF NOT EXISTS contratos (
  id          TEXT PRIMARY KEY,             -- ex: "CT-2026-019"
  projeto_id  TEXT REFERENCES projetos(id),
  client      TEXT,
  value       NUMERIC(14,2) DEFAULT 0,
  status      TEXT DEFAULT 'Em redação',    -- "Em redação", "Aguardando assinatura", "Em assinatura digital", "Assinado"
  days_open   INT DEFAULT 0,
  pages       INT DEFAULT 0,
  redactions  INT DEFAULT 0,
  issued_date DATE,
  lawyer      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);
```

---

### 3.8 — `estoque`

```sql
CREATE TABLE IF NOT EXISTS estoque (
  id        SERIAL PRIMARY KEY,
  sku       TEXT UNIQUE NOT NULL,            -- ex: "VP-DG-2400"
  name      TEXT NOT NULL,
  category  TEXT,
  qty       INT DEFAULT 0,
  min_qty   INT DEFAULT 0,
  weight_kg NUMERIC(8,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estoque_sku ON estoque(sku);
```

---

### 3.9 — `comissoes`

```sql
CREATE TABLE IF NOT EXISTS comissoes (
  id          SERIAL PRIMARY KEY,
  vendedor    TEXT NOT NULL,
  role_vendor TEXT,                          -- cargo do vendedor
  projetos    INT DEFAULT 0,
  faturado    NUMERIC(14,2) DEFAULT 0,
  comissao    NUMERIC(14,2) DEFAULT 0,
  pct         NUMERIC(5,2) DEFAULT 0,        -- percentual
  status      TEXT DEFAULT 'Aguardando',     -- "Aprovado", "Aguardando", "Pago"
  periodo     TEXT,                          -- ex: "Q1/26"
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comissoes_status ON comissoes(status);
```

---

### 3.10 — `gatilhos`

```sql
CREATE TABLE IF NOT EXISTS gatilhos (
  id           TEXT PRIMARY KEY,             -- ex: "g-1"
  projeto_id   TEXT REFERENCES projetos(id),
  building     TEXT,
  trigger_name TEXT NOT NULL,                -- descrição do gatilho financeiro
  value        NUMERIC(14,2) DEFAULT 0,
  due_date     DATE,
  days_left    INT DEFAULT 0,
  status       TEXT DEFAULT 'pendente',      -- "pendente", "atencao", "ok", "pago"
  reverse_from TEXT,                         -- referência de instalação
  chain        JSONB DEFAULT '[]',           -- etapas da cadeia de prazo reverso
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gatilhos_due_date ON gatilhos(due_date);
CREATE INDEX IF NOT EXISTS idx_gatilhos_status   ON gatilhos(status);
```

---

### 3.11 — `ncm_solicitacoes`

```sql
CREATE TABLE IF NOT EXISTS ncm_solicitacoes (
  id          SERIAL PRIMARY KEY,
  produto     TEXT NOT NULL,
  descricao   TEXT,
  ncm_atual   TEXT,
  ncm_sugerido TEXT,
  status      TEXT DEFAULT 'pendente',       -- "pendente", "em_analise", "aprovado", "reprovado"
  solicitante TEXT,
  responsavel TEXT,
  observacoes TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ncm_status ON ncm_solicitacoes(status);
```

---

## 4. Row Level Security (RLS)

Execute após criar as tabelas:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotacoes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE embarques          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque            ENABLE ROW LEVEL SECURITY;
ALTER TABLE comissoes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE gatilhos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ncm_solicitacoes   ENABLE ROW LEVEL SECURITY;

-- Política temporária: acesso total para a anon key (MVP sem auth)
-- ATENÇÃO: Substituir por políticas baseadas em auth.uid() quando Auth for implementado
CREATE POLICY "anon_full_access" ON leads              FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON cotacoes           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON projetos           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON alertas            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON tarefas            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON embarques          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON contratos          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON estoque            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON comissoes          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON gatilhos           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_full_access" ON ncm_solicitacoes   FOR ALL USING (true) WITH CHECK (true);
```

---

## 5. Critério de Sucesso

A FASE 1 está concluída quando:
- [ ] As 11 tabelas existem em `public` schema no Supabase.
- [ ] Nenhuma tabela contém dados (todas vazias — `SELECT COUNT(*) = 0`).
- [ ] RLS está habilitado em todas as tabelas.
- [ ] A consulta de teste abaixo retorna `200 OK` com `[]`:

```bash
curl "https://jxtqwzmpgofwctqajewt.supabase.co/rest/v1/leads?select=id&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHF3em1wZ29md2N0cWFqZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODk3NzcsImV4cCI6MjA5NTA2NTc3N30.hoNuKfSaSLFDKqJ2F331QSDQkzsiphWhLk3xtZh6Bpc" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHF3em1wZ29md2N0cWFqZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0ODk3NzcsImV4cCI6MjA5NTA2NTc3N30.hoNuKfSaSLFDKqJ2F331QSDQkzsiphWhLk3xtZh6Bpc"
```

---

## 6. Restrições

- **Não popular** nenhuma tabela com dados (nem seed, nem dados do mock).
- **Não alterar** o arquivo `src/supabase.js` — os nomes de coluna usados nele foram base para este schema.
- Reportar ao CEO Agent ao concluir ou em caso de erro.
