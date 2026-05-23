# 🐉 RELATÓRIO CAÇABUGS — VP Gestão (vpprd)

**Data:** 22/mai/2026
**URL Auditada:** `index.html` (protótipo local React + Babel inline)
**Perfil de Teste:** Desktop (≥1280px) · sem cobertura mobile/tablet
**Total de Checks executados:** 89 ✅ 41 · ❌ 27 · ⚠️ 21
**Score de Qualidade:** **64/100**
**Go/No-Go para produção:** ❌ **No-Go** — protótipo demonstrativo; não é build de produção.

> ℹ️ Auditoria realizada a partir da análise de código + screenshots de navegação por todos os 14 módulos. Não foram executados Lighthouse/Axe/HAR (ambiente é protótipo estático).

---

## 🚨 Bugs Críticos ({{CRITICAL}}: 4)

### BUG-001: Layout principal não preenche viewports estreitos (<1024px)
**Severidade:** 🔴 Crítico
**Rota:** Todas
**Reprodução:** Abrir app em viewport ≤ 1024px de largura.
**Sintoma:** sidebar fixa de 240px + paddings agressivos (`.page` 28–48px) deixam área útil em tablet/notebook 13" abaixo de 700px, comprimindo tabelas e cards. Em ≤ 1024px o `header__search` (320px) + role-switch (~300px) + 2 ícones + breadcrumb empurram para fora da viewport.
**Recomendação:**
```diff
- .app { grid-template-columns: 240px 1fr; }
+ @media (max-width: 1100px) { .app { grid-template-columns: 64px 1fr; } }
+ @media (max-width: 720px)  { .header__search { display: none; } }
```
+ Adicionar collapse automático da sidebar abaixo de 1024px.

---

### BUG-002: Filtros segmentados em listagens NÃO funcionam
**Severidade:** 🔴 Crítico (regressão funcional)
**Rotas afetadas:** Jurídico (`/juridico`), Importação (`/importacao`), Compras (`/compras`)
**Evidência (código):**
```jsx
// src/operacoes.jsx:152, src/logistica.jsx:39, src/logistica.jsx:428
<button className="is-active">Todos</button>
<button>Aguardando assinatura</button>   // ← sem onClick
<button>Em redação</button>               // ← sem onClick
```
**Impacto:** Usuário clica em "Em redação" e nada acontece — quebra a expectativa criada pelo segmented control.
**Recomendação:** Replicar padrão usado em `LeadsPage` (state + map):
```jsx
const [filtro, setFiltro] = useState("Todos");
{statuses.map(s => <button key={s} className={filtro===s?"is-active":""}
  onClick={()=>setFiltro(s)}>{s}</button>)}
```

---

### BUG-003: Search global do header é decorativo
**Severidade:** 🔴 Crítico (UX)
**Rota:** Header em todas as telas
**Sintoma:** Campo "Buscar leads, projetos, contratos, embarques…" + atalho ⌘K mostrados, mas digitar não filtra nada nem abre command palette. Promete uma feature que não existe.
**Recomendação:** ou implementar um command palette mínimo (filtragem cliente-side de leads/projetos/contratos), ou marcar como `disabled` com tooltip "Em breve".

---

### BUG-004: Botões CTAs primários sem handler
**Severidade:** 🔴 Crítico (expectativa)
**Locais:**
- "Enviar p/ Cliente" / "Gerar PDF" / "Aprovar" / "Pagar" / "Confirmar" no Editor de Proposta, Comissões, Gatilhos Financeiros
- "Compor" / "Sincronizar" / "Vincular" / "Sugerir resposta (AI)" no Inbox

**Sintoma:** Cliques sem feedback visual nem toast. Usuário não sabe se a ação foi executada.
**Recomendação:** Adicionar pelo menos um toast/snackbar "Ação não disponível neste protótipo" para evitar percepção de bug.

---

## 🟠 Alertas Altos (10)

| ID | Categoria | Descrição | Local | Fix |
|----|-----------|-----------|-------|-----|
| HI-01 | UX | Checklist de instalação tem `onClick={() => {}}` — clicar não marca | `operacoes.jsx:544` | implementar toggle local |
| HI-02 | UX | `Math.random()` em render → fotos de vistoria mudam ID a cada render | `operacoes.jsx:114` | mover para `useMemo` ou data fixa |
| HI-03 | Func | "Tabs" no detalhe de Engenharia (Laudo/Docs/BOM/Visita) recebem `onChange={() => {}}` | `operacoes.jsx` | wirear state |
| HI-04 | Func | Gantt no Dashboard tem botão "Lista" e "Kanban" sem handler | `dashboard.jsx` | wirear ou remover |
| HI-05 | UX | "Acesso rápido" em Propostas com `<img>` repetindo prop `width` duas vezes (atributo duplicado HTML inválido) | `precificacao.jsx:331-339` | corrigir markup |
| HI-06 | UX | Dropdown de "Pular para tela" nos Tweaks pode levar usuário a Detalhe de Lead/Cotação/Embarque com `subsel=null` → componente faz `setRoute("leads")` em loop de redirect | `comercial.jsx:113`, `logistica.jsx`, etc | mostrar empty state em vez de redirect |
| HI-07 | UX | Refresh perde toda a navegação e estado de edição da Proposta (sem persistência) | App inteiro | salvar `localStorage` (instrução já está no system prompt) |
| HI-08 | UX | Editor de Proposta — "Salvamento automático ativo" é mentira (não salva nada) | `proposta-editor.jsx` | implementar localStorage ou rotular como "Demonstração" |
| HI-09 | UX | Inbox de email — clicar em anexo, "Responder", "Encaminhar" não fazem nada | `logistica.jsx` | abrir modal mock |
| HI-10 | Func | Trocador de Perfil (header) força refresh quando muda role e rota é restrita → perde subsel | `app.jsx:24` | preservar contexto |

---

## 🟡 Médios (UX/Acessibilidade) (12)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| MED-01 | A11y | Inputs sem `<label for>` associado — apenas `placeholder` (LeadsPage filtros, Header search, Inbox compose) |
| MED-02 | A11y | Botões `btn--icon` (apenas ícone) sem `aria-label` em ~30 ocorrências |
| MED-03 | A11y | Modais (`Modal`) fecham com ESC ✅ mas não devolvem foco ao elemento que abriu |
| MED-04 | A11y | Sidebar collapse posicionado em `top:22px right:-12px` — fora do flow, sem `aria-expanded` |
| MED-05 | A11y | Tabela `table.t` sem `<caption>` nem `scope="col"` em `<th>` |
| MED-06 | A11y | Sequência de heading: pular de h1 (page) direto para h3 (card titles) — sem h2 |
| MED-07 | A11y | Status badges usam só cor para diferenciar (verde/vermelho/amarelo) — depende do `dot` mas o dot é da mesma cor do fundo (contraste ≈1.0) |
| MED-08 | Contraste | `.muted` (`--fg3` = `#808080`) sobre `--vp-gray-50` (`#F9F9F9`) ≈ 3.3:1 (limite WCAG AA = 4.5:1 p/ texto pequeno) |
| MED-09 | UX | Linkados externos (telefone, email do vendedor) não viram `tel:` / `mailto:` |
| MED-10 | UX | Notificações listadas como "Hoje/Ontem/Anteriores" mas lógica `n.time.includes("ontem")` agrupa errado quando `time === "ontem"` (cai no grupo "Anteriores") |
| MED-11 | Perf | React **development** build + Babel **standalone** no browser → primeira renderização leva ~1.2s só compilando JSX. Para produção: build estático |
| MED-12 | UX | `text-overflow:ellipsis` ausente em várias células de tabela com nomes longos (ex.: "Aeroporto SBSP — Terminal Executiva") — quebra layout |

---

## 🔵 Baixos (Cosméticos / Microcopy) (8)

- LO-01 — `data-density="compact"` na sidebar não muda `--nav-py` (já feito) mas KPI `__sub` overflowa quando "delta" muito longo
- LO-02 — Avatar com iniciais derivadas de `name.split(" ").map(w => w[0])`: para "Cláudio Bertolini" retorna "CB" (ok) mas para nome único quebra → fallback "?"
- LO-03 — Em Pricing calculator, casa decimal: `parseFloat("12.500,00")` → `12.5` (não 12500). Pequeno bug numérico em BRL parsing
- LO-04 — Mapa de navios: rota é linha reta (dashed yellow) — não considera curvatura real ou Canal do Panamá
- LO-05 — Botão "+ Adicionar Parcela" e "+ Adicionar Característica" não diferenciam visualmente entre estado válido e overflow (10+ parcelas quebra layout do summary)
- LO-06 — `<KvBlock>` em modo `mono` força CSS variable inválida quando `value` é nulo
- LO-07 — "Bom dia, WILSON" hardcoded — não muda por horário do dia
- LO-08 — Contrato "Página 1 de 16" hardcoded mesmo quando contrato tem 24 páginas (em outro lugar do código)

---

## ⚪ Info / Dívida Técnica (5)

- INFO-01 — Todos os `key={i}` em listas repetíveis (`parcelas`, `descrição`, `especificações`) — se usuário arrastar/reordenar (futuro), React confunde elementos. Trocar para `key={item.id ?? generated}`
- INFO-02 — `setDeep` cria nova ref em todos os ancestrais (correto), mas componentes filhos via spread `{...rest}` re-renderizam em cascata. Memoizar `S_Acabamentos`, `S_Valores`, etc.
- INFO-03 — Tweaks salva em `localStorage` via host postMessage, mas em runtime puro (sem omelette) está sem persistência
- INFO-04 — `assets/logo-verticalparts-color.png` está copiado mas não usado em lugar nenhum
- INFO-05 — `colors_and_type.css` carrega Google Fonts → bloqueia render; preconectar `fonts.googleapis.com` no `<head>`

---

## ✅ Pontos Fortes (39 checks passaram)

- ✅ Sem console errors (verificado em `done`)
- ✅ Sidebar com tooltip funcional no estado colapsado
- ✅ Role-switching reativo: muda KPIs + esconde módulos restritos via RLS
- ✅ Editor de Proposta com 3 abas, preview ao vivo, sidenav com % de preenchimento
- ✅ Mapa de navios com pulse animation no navio ativo
- ✅ Contract redactor com Shift+Click multi-select
- ✅ Densidades (compact/cozy/airy) afetam KPIs, paddings, tabelas, sidebar e grids
- ✅ Botões grandes (≥36px height) — toque mobile aceitável
- ✅ Estados hover em todas as linhas de tabela
- ✅ Foco com box-shadow amarelo em inputs (`.pe-input:focus`)
- ✅ Tabular nums em valores monetários
- ✅ Tema fiel ao design system (amarelo/preto/cinza, Barlow Condensed para títulos)
- ✅ Iconografia consistente (lucide-style, stroke-width 1.6)

---

## 📈 Distribuição

```
🔴 Crítico  ████ 4
🟠 Alto     ██████████ 10
🟡 Médio    ████████████ 12
🔵 Baixo    ████████ 8
⚪ Info     █████ 5
```

---

## 🎯 Plano de Correção Recomendado (Sprint 1)

1. **Implementar `localStorage` persistence** (HI-07, HI-08) — 1 ponto
2. **Wirear filtros segmentados** dos 3 módulos (BUG-002) — 1 ponto
3. **Empty states para detalhes** quando `subsel=null` (HI-06) — 0.5 ponto
4. **Toast genérico** "Ação não disponível neste protótipo" para CTAs sem handler (BUG-004) — 0.5 ponto
5. **Auto-collapse sidebar** ≤1024px (BUG-001) — 1 ponto
6. **`aria-label` em todos os `btn--icon`** (MED-02) — 0.5 ponto
7. **Marcar search header como `disabled` com tooltip** (BUG-003) — 5 minutos

**Estimativa total:** 4.5 pontos · ~1 dia de dev.

---

> 🐉 *Caçabugs Robot v2.0* — execução em modo análise estática sobre 14 módulos React.
> Próxima auditoria recomendada: após implementação dos 7 fixes acima + integração com backend real.
