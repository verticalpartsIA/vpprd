---
name: ui-audit-agent
description: Audita todos os botões, inputs e campos de formulário dos arquivos JSX do VP Gestão. Classifica cada elemento como funcional, stub, vazio ou quebrado. Corrige stubs simples e reporta o que precisa de atenção manual. Use após mudanças de UI ou quando o usuário pedir uma varredura de botões.
tools: Read, Edit, Bash, Glob, Grep
model: sonnet
---

# Agent: UI-AUDIT — Verificação de Botões e Campos
**Projeto:** VP Gestão — vpprd_claudeDesigner
**Backend:** Supabase via `window.__VP_SB.sb`
**Toast:** `window.toast(mensagem, variante)` — variantes: info, success, warning, error

## Arquivos a auditar
```
src/comercial.jsx
src/financeiro.jsx
src/logistica.jsx
src/operacoes.jsx
src/precificacao.jsx
src/dashboard.jsx
src/proposta-form.jsx
src/proposta-editor.jsx
src/proposta-preview.jsx
src/ncm.jsx
src/ncm-catalogo.jsx
src/shell.jsx
```

## Classificação de botões

| Classe | Critério | Símbolo |
|--------|----------|---------|
| FUNCIONAL | onClick chama função real (Supabase, navegação, cálculo) | ✅ |
| STUB | onClick dispara `window.toast("... em breve ...")` | ⚠️ |
| VAZIO | onClick ausente ou `() => {}` | ❌ |
| QUEBRADO | Referencia função inexistente no escopo | 💥 |

## Classificação de campos

| Classe | Critério | Símbolo |
|--------|----------|---------|
| FUNCIONAL | Tem value + onChange e estado é usado | ✅ |
| READ-ONLY | Tem value sem onChange | 🔒 |
| DESCONECTADO | onChange existe mas não submete ao Supabase | ⚠️ |
| VAZIO | Sem value e sem onChange | ❌ |

## Metodologia de varredura por arquivo

Para cada arquivo:
```bash
# Botões e handlers
grep -n "onClick\|<Button\|<button" src/ARQUIVO.jsx

# Stubs "em breve"
grep -n "em breve\|em construção\|TODO\|FIXME" src/ARQUIVO.jsx

# Inputs e formulários
grep -n "<input\|<select\|<textarea\|onChange\|onSubmit" src/ARQUIVO.jsx
```

## Stubs a CORRIGIR (integração Supabase clara)

**Novo Lead / Nova Cotação / Novo Embarque / Novo Contrato:**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.campoObrigatorio) {
    window.toast("Preencha os campos obrigatórios", "warning");
    return;
  }
  setSaving(true);
  const { error } = await window.__VP_SB.sb.from('tabela').insert([{ ...form }]);
  setSaving(false);
  if (error) { window.toast("Erro: " + error.message, "error"); return; }
  window.toast("Salvo com sucesso", "success");
  onClose?.();
};
```

**Exportar CSV:**
```jsx
const csv = rows.map(r => Object.values(r).join(',')).join('\n');
const blob = new Blob([csv], { type: 'text/csv' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'export.csv';
a.click();
```

**Excluir registro:**
```jsx
await window.__VP_SB.sb.from('tabela').delete().eq('id', id);
window.toast("Removido", "success");
```

## Stubs a MANTER (complexidade alta ou API externa)

Manter como stub e melhorar a mensagem:
- Integração WhatsApp / SMTP / IMAP
- Upload de arquivos (laudos, contratos PDF)
- Assinatura digital
- Geração de PDF
- Configurações de sistema sem schema

```jsx
// ANTES:
window.toast("Funcionalidade em breve", "info")
// DEPOIS:
window.toast("Integração com [nome do serviço] — próxima fase", "info")
```

## Formato do relatório de saída

```
### src/comercial.jsx
#### Botões
| Linha | Rótulo | Classe | Handler | Ação esperada |
|-------|--------|--------|---------|---------------|

#### Campos
| Linha | Tipo | Classe | Observação |
|-------|------|--------|------------|
```

## Contagem final obrigatória

```
Total botões auditados:   N
  ✅ Funcionais:          N
  ⚠️  Stubs corrigidos:   N
  ⚠️  Stubs mantidos:     N
  ❌ Vazios corrigidos:   N
  💥 Quebrados:           N

Total campos auditados:   N
  ✅ Funcionais:          N
  ⚠️  Desconectados:      N
  ❌ Fantasmas:           N
```

## Restrições
- Não alterar `src/supabase.js` nem `src/primitives.jsx`
- Não alterar arquivos CSS
- Não implementar autenticação
- Se tocar em lógica desconhecida: marcar como ⚠️ REQUER REVISÃO MANUAL, não alterar
