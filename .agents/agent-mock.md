# Agent: MOCK — Remoção de Dados Mockados
**Versão:** 1.0.0  
**Projeto:** VP Gestão — Vertical Parts (vpprd)  
**Branch de trabalho:** `claude/nifty-fermi-l5wL9`  
**Acionado por:** CEO Agent (FASE 2) — somente após FASE 1 (DB) concluída

---

## 1. Identidade e Papel

Você é o **agente MOCK**. Sua missão é **remover completamente todos os dados mockados** do projeto VP Gestão e substituí-los por chamadas reais ao Supabase. O site nunca foi usado em produção — todos os dados existentes são fictícios e devem ser eliminados.

---

## 2. Mapeamento Completo de Mocks

### 2.1 Arquivo principal de mock

| Arquivo | Natureza | Ação |
|---------|----------|------|
| `src/data.js` | **FONTE de todo mock** — `window.__VP_DATA` com 375 linhas de dados falsos | **DELETAR o arquivo inteiro** |

### 2.2 Referências em componentes

| Arquivo | Referências a remover |
|---------|----------------------|
| `src/dashboard.jsx` | `const MOCK_TASKS = {...}` (linhas 49–74), `const MOCK_STOCK = [...]` (linhas 76–80), `const D = window.__VP_DATA` (linha 131) |
| `src/comercial.jsx` | `const D = window.__VP_DATA` (linhas 7, 137, 290, 383) |
| `src/financeiro.jsx` | `const D = window.__VP_DATA` (linhas 7, 106, 187) |
| `src/logistica.jsx` | `const D = window.__VP_DATA` (linhas 7, 215, 413, 502) + strings `"neste mock"` (linhas 664, 688) |
| `src/operacoes.jsx` | `const D = window.__VP_DATA` (linhas 7, 97) |
| `src/precificacao.jsx` | `const D = window.__VP_DATA` (linhas 8, 261) |
| `src/print-app.jsx` | `const D = window.__VP_DATA` (linha 35) |

### 2.3 Referência em `index.html`

Verificar se `<script src="src/data.js">` existe e **removê-la**.

---

## 3. Estratégia de Substituição

### Princípio central

O arquivo `src/supabase.js` já contém `window.__VP_SB.loadDashboardData(role)` que retorna dados reais do Supabase. O `dashboard.jsx` já usa o padrão correto de fallback. **Estenda esse padrão para todos os componentes.**

### Padrão a adotar (hook de dados)

Cada componente que hoje usa `window.__VP_DATA` deve passar a usar o seguinte padrão:

```jsx
// ANTES (mock):
const D = window.__VP_DATA;
const rows = D.leads;

// DEPOIS (Supabase):
const [rows, setRows] = React.useState([]);
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  window.__VP_SB.sb
    .from('leads')
    .select('*')
    .order('date', { ascending: false })
    .then(({ data }) => { setRows(data || []); setLoading(false); });
}, []);

if (loading) return <LoadingSpinner/>;
```

### Estado vazio (empty state)

Quando a tabela estiver vazia (site novo), exibir estado vazio amigável:

```jsx
if (!loading && rows.length === 0) {
  return (
    <div className="empty-state">
      <p>Nenhum registro encontrado. Comece adicionando o primeiro.</p>
    </div>
  );
}
```

---

## 4. Mudanças Arquivo por Arquivo

### 4.1 `src/data.js` — DELETAR

Remover o arquivo completamente. Ele não será mais necessário.

---

### 4.2 `src/dashboard.jsx`

**Remover:**
- Bloco `const MOCK_TASKS = { ... }` inteiro (linhas 49–74)
- Bloco `const MOCK_STOCK = [...]` inteiro (linhas 76–80)
- Qualquer `const D = window.__VP_DATA`

**O dashboard já tem a lógica correta** de carregar via `window.__VP_SB.loadDashboardData(role)`. Após remover os MOCK_, o código já funcionará com tabelas vazias retornando arrays `[]`.

Verificar que a linha de tarefas usa apenas o dado real:
```jsx
// ANTES:
const tasks = sbData !== null ? (sbData.tarefas || []) : (MOCK_TASKS[role] || []);
// DEPOIS:
const tasks = sbData?.tarefas || [];
```

Verificar que o estoque usa apenas dado real:
```jsx
// ANTES:
const stocks = sbData?.estoqueCritico?.length > 0 ? sbData.estoqueCritico : MOCK_STOCK;
// DEPOIS:
const stocks = sbData?.estoqueCritico || [];
```

---

### 4.3 `src/comercial.jsx`

Cada função que usa `const D = window.__VP_DATA` deve ser refatorada para buscar dados do Supabase.

**LeadsPage** (usa `D.leads`):
- Substituir por query: `sb.from('leads').select('*').order('date', {ascending: false})`
- Usar `React.useState([])` + `React.useEffect` com loading state
- KPIs de leads: calcular a partir do array retornado (mesma lógica já existente em `supabase.js`)

**CotacoesPage** (usa `D.cotacoes`):
- Substituir por query: `sb.from('cotacoes').select('*').order('date', {ascending: false})`

**PrecificacaoPage** (usa `D.parts`, `D.clients`):
- `D.parts` (catálogo de peças fixo): mover para `src/ncm-data.js` como constante exportada ou buscar de `estoque`
- `D.clients`: buscar de `leads` via `.select('building').eq('status','Convertido')`

**PropostasPage** (usa `D.leads`, `D.parts`):
- `D.leads`: query `sb.from('leads').select('id,building,contact,value')`
- `D.parts`: usar constante local ou `estoque`

---

### 4.4 `src/financeiro.jsx`

**FinanceiroPage** (usa `D.gatilhos`):
- Substituir por: `sb.from('gatilhos').select('*').order('due_date')`
- KPIs hard-coded como `"R$ 2.4M"` e `"11"`: **remover valores hard-coded**, calcular a partir dos dados reais ou exibir `—` quando não houver dados

**ComissoesPage** (usa `D.comissoes`):
- Substituir por: `sb.from('comissoes').select('*').order('id')`

**NotificacoesPage** (usa `D.notifications`):
- Criar tabela `notificacoes` no Supabase (adicionar ao agent-database.md se necessário)
- Ou: substituir por array vazio `[]` com empty state

---

### 4.5 `src/logistica.jsx`

**ImportacaoPage** (usa `D.embarques`):
- Substituir por: `sb.from('embarques').select('*').order('eta')`
- KPIs hard-coded (`"9"`, `"USD 1.8M"`): calcular a partir dos dados reais

**ImportacaoDetail** (usa `D.embarques` para buscar por ID):
- Substituir por: `sb.from('embarques').select('*').eq('id', embarqueId).single()`

**ImportacaoRastreamento** (usa `D.embarques` para mapa):
- Substituir por: `sb.from('embarques').select('id,vessel,lat,lng,speed,heading,status').eq('status','Em trânsito')`

**EmailInbox** (usa `D.emails`):
- Remover strings `"Mensagem completa não exibida neste mock."` (linhas 664, 688)
- Substituir por empty state: `"Nenhuma mensagem encontrada."` ou integrar futuramente com IMAP

**ComprasPage** (usa `D.fretes`):
- Criar tabela `fretes` no Supabase (adicionar ao agent-database.md se necessário)
- Ou: substituir por array vazio com empty state: `"Nenhum frete registrado."`

---

### 4.6 `src/operacoes.jsx`

Identificar o que usa `D` e substituir pelos respectivos queries:
- Projetos de engenharia (`D.projetosEng`): `sb.from('projetos').select('*').eq('status','ativo')`
- Contratos jurídicos (`D.contratos`): `sb.from('contratos').select('*').order('issued_date', {ascending:false})`

---

### 4.7 `src/precificacao.jsx`

- `D.parts` (catálogo NCM): mover como constante local em `src/ncm-data.js` (esse arquivo já existe e pode conter dados de catálogo — verificar seu conteúdo)
- `D.clients`: buscar leads convertidos do Supabase

---

### 4.8 `src/print-app.jsx`

- Verificar o que usa `D` e substituir por props ou queries Supabase equivalentes
- Se o print usa dados de uma proposta específica, receber via props ou buscar por ID

---

### 4.9 `index.html`

Remover a linha:
```html
<script src="src/data.js"></script>
```

---

## 5. Verificação Final

Após todas as alterações, executar:

```bash
grep -rn "__VP_DATA\|MOCK_TASKS\|MOCK_STOCK\|window\.MOCK" src/
```

**Resultado esperado:** nenhuma linha encontrada.

```bash
grep -rn "neste mock" src/
```

**Resultado esperado:** nenhuma linha encontrada.

---

## 6. Critério de Sucesso

A FASE 2 está concluída quando:
- [ ] `src/data.js` não existe mais.
- [ ] `grep -rn "__VP_DATA" src/` retorna 0 resultados.
- [ ] `grep -rn "MOCK_" src/` retorna 0 resultados.
- [ ] `grep -rn "neste mock" src/` retorna 0 resultados.
- [ ] A tag `<script src="src/data.js">` não existe em `index.html`.
- [ ] Todos os componentes têm loading state e empty state implementados.

---

## 7. Restrições

- **Não alterar** `src/supabase.js` — ele já está correto.
- **Não alterar** `src/ncm-data.js` além do necessário (verificar conteúdo antes).
- **Não remover** lógica de UI — apenas as referências a dados mock.
- **Não adicionar** dados de seed — o sistema deve funcionar com tabelas vazias.
- **Não criar** novos arquivos além do necessário.
- Reportar ao CEO Agent ao concluir ou em caso de erro.
