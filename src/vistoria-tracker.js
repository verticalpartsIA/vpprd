/* ============================================================
   vistoria-tracker.js
   Rastreamento de vistorias/inspeções (3 fases) e controle de custos excedentes
   window.VistoriaTracker — expõe funções de gerenciamento
   ============================================================ */
(function () {
  'use strict';

  function sb() { return (window.__VP_SB || {}).sb; }

  async function criarVistoria(projectId, orcamentoInicial) {
    const c = sb();
    if (!c || !projectId) throw new Error('projectId inválido');

    const vistoria = {
      fases: [
        { numero: 1, status: 'pendente', data: null, custo: 0, observacoes: '' },
        { numero: 2, status: 'pendente', data: null, custo: 0, observacoes: '' },
        { numero: 3, status: 'pendente', data: null, custo: 0, observacoes: '' },
      ],
      orcamento_inicial: orcamentoInicial || 0,
      custo_total: 0,
      custos_excedentes: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    const { error } = await c.from('projetos')
      .update({ vistoria, atualizado_em: new Date().toISOString() })
      .eq('id', projectId);

    if (error) throw error;
    return vistoria;
  }

  async function obterVistoria(projectId) {
    const c = sb();
    if (!c || !projectId) return null;

    const { data } = await c.from('projetos')
      .select('vistoria')
      .eq('id', projectId)
      .single();

    return data?.vistoria || null;
  }

  async function atualizarFaseVistoria(projectId, numeroFase, dadosFase) {
    const c = sb();
    if (!c || !projectId) throw new Error('projectId inválido');

    const { data } = await c.from('projetos')
      .select('vistoria')
      .eq('id', projectId)
      .single();

    let vistoria = data?.vistoria || null;
    if (!vistoria) {
      vistoria = await criarVistoria(projectId, 0);
    }

    const faseIdx = vistoria.fases.findIndex(f => f.numero === numeroFase);
    if (faseIdx >= 0) {
      vistoria.fases[faseIdx] = { ...vistoria.fases[faseIdx], ...dadosFase, atualizado_em: new Date().toISOString() };
    }

    vistoria.atualizado_em = new Date().toISOString();
    vistoria.custo_total = vistoria.fases.reduce((sum, f) => sum + Number(f.custo || 0), 0);
    vistoria.custos_excedentes = Math.max(0, vistoria.custo_total - vistoria.orcamento_inicial);

    const { error } = await c.from('projetos')
      .update({ vistoria })
      .eq('id', projectId);

    if (error) throw error;
    return vistoria;
  }

  function calcularProgresso(vistoria) {
    if (!vistoria || !vistoria.fases) return 0;
    const concluidas = vistoria.fases.filter(f => f.status === 'concluida').length;
    return Math.round((concluidas / vistoria.fases.length) * 100);
  }

  function getStatusColor(status) {
    return status === 'concluida' ? 'var(--vp-success)'
      : status === 'em_progresso' ? 'var(--vp-warning)'
      : 'var(--border)';
  }

  function fmtData(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  function fmtBRL(value) {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  window.VistoriaTracker = {
    criarVistoria,
    obterVistoria,
    atualizarFaseVistoria,
    calcularProgresso,
    getStatusColor,
    fmtData,
    fmtBRL,
  };
})();
