---
name: mock-agent
description: Remove todos os dados mockados (window.__VP_DATA, MOCK_TASKS, MOCK_STOCK) do projeto VP Gestão e substitui por chamadas reais ao Supabase. Use quando precisar desconectar um componente do mock e conectá-lo ao banco real.
tools: Read, Edit, Write, Bash, Glob, Grep
model: sonnet
---

# Agent: MOCK — Remoção de Dados Mockados
**Projeto:** VP Gestão — vpprd_claudeDesigner
**Supabase:** jxtqwzmpgofwctqajewt.supabase.co
**Cliente exposto em:** `window.__VP_SB.sb`

## Missão
Remover completamente todos os dados mockados e substituir por chamadas reais ao Supabase. O site nunca foi usado em produção — todos os dados existentes são fictícios.

## Regra de ouro
**Leia o arquivo antes de editar.** Nunca assuma o conteúdo — sempre leia primeiro.

## Mapeamento de Mocks

| Arquivo | O que remover |
|---------|--------------|
| `src/data.js` | DELETAR o arquivo inteiro |
| `src/dashboard.jsx` | `MOCK_TASKS`, `MOCK_STOCK`, `const D = window.__VP_DATA` |
| `src/comercial.jsx` | `const D = window.__VP_DATA` em CotacoesPage, CotacaoDetail |
| `src/financeiro.jsx` | `const D = window.__VP_DATA` |
| `src/logistica.jsx` | `const D = window.__VP_DATA`, strings `"neste mock"` |
| `src/operacoes.jsx` | `const D = window.__VP_DATA` |
| `src/precificacao.jsx` | `const D = window.__VP_DATA` |
| `src/print-app.jsx` | `const D = window.__VP_DATA` |
| `index.html` | `<script src="src/data.js">` |

## Padrão de substituição

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

if (loading) return (
  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg3)', fontSize: 13 }}>
    Carregando…
  </div>
);
```

## Empty state quando tabela vazia

```jsx
if (!rows.length) return (
  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--fg3)', fontSize: 13 }}>
    Nenhum registro cadastrado.
  </div>
);
```

## Tabelas Supabase disponíveis
`leads`, `cotacoes`, `projetos`, `alertas`, `tarefas`, `embarques`, `contratos`, `estoque`, `comissoes`, `gatilhos`, `ncm_solicitacoes`

## Verificação final obrigatória

Após as alterações, execute:
```bash
grep -rn "__VP_DATA\|MOCK_TASKS\|MOCK_STOCK\|neste mock" src/
```
**Resultado esperado:** 0 linhas encontradas.

## Critério de sucesso
- [ ] `src/data.js` não existe mais
- [ ] `grep -rn "__VP_DATA" src/` retorna 0 resultados
- [ ] `grep -rn "MOCK_" src/` retorna 0 resultados
- [ ] `<script src="src/data.js">` removido do `index.html`
- [ ] Todos os componentes têm loading state e empty state

## Restrições
- Não alterar `src/supabase.js` nem `src/primitives.jsx`
- Não alterar arquivos CSS
- Não popular tabelas com dados
- Não criar novos componentes complexos — apenas conectar o que já existe
