/* ============================================================
   ficha-tecnica-engine.js
   Gerador Universal de Fichas Técnicas — engine + biblioteca.
   Categorias pré-prontas, templates rápidos, compile do estado
   para o renderer da ficha.
   Exporta window.FT = { ... } pra não colidir.
   ============================================================ */
(function () {
  'use strict';

  /* Unidades disponíveis no Add Field modal */
  const UNIDADES = [
    '', '—',
    'mm', 'cm', 'm', 'pol', '°',
    'kg', 'g', 't', 'Nm',
    'V', 'VAC', 'VDC', 'A', 'mA', 'W', 'kW', 'HP', 'Hz', 'Ω', 'F', 'µF', 'Ah', '%',
    'm/s', 'RPM', 'm/s²',
    'L', 'mL', 'm³/h', 'bar', 'PSI',
    'dB', 'dBA', '°C', '°F', 'IP',
    'un', 'PC', 'PAR', 'JG', 'CX', 'polos', 'feixes', 'pinos', 'pax',
    'N', 'kN', 'HRC', 'dias', 'min', 'ano',
  ];

  const f = (nome, unidade, tipo, extra) => ({
    k: nome.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    nome, unidade: unidade || '', tipo: tipo || 'number', ...(extra || {}),
  });

  /* 9 categorias pré-configuradas */
  const LIB = [
    {
      id: 'dimensoes', nome: 'Dimensões Físicas', icon: 'ruler',
      campos: [
        f('Altura', 'mm'), f('Largura', 'mm'), f('Profundidade', 'mm'), f('Comprimento', 'mm'),
        f('Diâmetro', 'mm'), f('Espessura', 'mm'), f('Curso / Stroke', 'mm'), f('Passo / Pitch', 'mm'),
        f('Ângulo / Inclinação', '°'), f('Raio', 'mm'),
      ],
    },
    {
      id: 'peso', nome: 'Peso e Massa', icon: 'weight',
      campos: [
        f('Peso Líquido', 'kg'), f('Peso Bruto', 'kg'), f('Capacidade de Carga', 'kg'),
        f('Carga Estática', 'kg'), f('Torque', 'Nm'),
      ],
    },
    {
      id: 'eletricas', nome: 'Elétricas', icon: 'bolt',
      campos: [
        f('Tensão de Alimentação', 'VAC'), f('Corrente Nominal', 'A'), f('Potência', 'kW'),
        f('Frequência', 'Hz'), f('Fator de Potência', '', 'text'), f('Resistência', 'Ω'), f('Capacitância', 'µF'),
      ],
    },
    {
      id: 'velocidade', nome: 'Velocidade e Movimento', icon: 'gauge',
      campos: [
        f('Velocidade', 'm/s'), f('Rotação', 'RPM'), f('Percurso Máximo', 'm'), f('Aceleração', 'm/s²'),
      ],
    },
    {
      id: 'fluidos', nome: 'Fluidos e Volumes', icon: 'droplet',
      campos: [f('Volume', 'L'), f('Vazão de Ar', 'm³/h'), f('Pressão', 'bar')],
    },
    {
      id: 'acustica', nome: 'Acústica e Ambiente', icon: 'wave',
      campos: [f('Ruído', 'dBA'), f('Temperatura de Operação', '°C'), f('Grau de Proteção', 'IP', 'text')],
    },
    {
      id: 'tracao', nome: 'Tração e Rolagem', icon: 'cog',
      campos: [
        f('Bitola / Diâmetro Nominal', 'mm'), f('Construção do Cabo', '', 'text'),
        f('Carga de Ruptura Mínima', 'kN'), f('Passo da Corrente', 'mm'), f('Diâmetro Rolo / Pino', 'mm'),
      ],
    },
    {
      id: 'componentes', nome: 'Específicas de Componentes', icon: 'chip',
      campos: [
        f('Número de Paradas', 'un'), f('Número de Polos', 'polos'), f('Qtd. de Cabos', 'un'),
        f('Número de Feixes', 'feixes'), f('Número de Pinos', 'pinos'), f('Número de Contatos', '', 'text'),
      ],
    },
    {
      id: 'codigos', nome: 'Códigos e Classificações', icon: 'barcode',
      campos: [
        f('NCM', '', 'text'), f('CEST', '', 'text'), f('EAN / GTIN', '', 'text'),
        f('Part Number', '', 'text'), f('Código ANVISA', '', 'text'), f('Código ANP', '', 'text'),
      ],
    },
  ];

  /* Templates rápidos */
  const TEMPLATES = [
    {
      nome: 'Rolamento 6205', produto: 'Rolamento 6205',
      campos: [
        { cat: 'dimensoes', nome: 'Diâmetro Interno', unidade: 'mm', valor: '25' },
        { cat: 'dimensoes', nome: 'Diâmetro Externo', unidade: 'mm', valor: '52' },
        { cat: 'dimensoes', nome: 'Largura', unidade: 'mm', valor: '15' },
        { cat: 'componentes', nome: 'Tipo de Vedação', unidade: '', tipo: 'text', valor: '2RS' },
      ],
    },
    {
      nome: 'Cabo de Aço 8mm', produto: 'Cabo de Aço 8mm',
      campos: [
        { cat: 'tracao', nome: 'Bitola / Diâmetro Nominal', unidade: 'mm', valor: '8' },
        { cat: 'tracao', nome: 'Construção do Cabo', unidade: '', tipo: 'text', valor: '6x19 + AF' },
        { cat: 'tracao', nome: 'Carga de Ruptura Mínima', unidade: 'kN', valor: '41' },
        { cat: 'dimensoes', nome: 'Comprimento', unidade: 'm', valor: '' },
      ],
    },
  ];

  function slug(s) {
    return 'c_' + String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 24)
      + '_' + Math.random().toString(36).slice(2, 6);
  }

  function hoje() { return new Date().toLocaleDateString('pt-BR'); }

  /* Cache da biblioteca persistente (carregada via FTStore.loadLibrary).
     Estrutura: { cats: [{id, nome, icon}], campos: [{cat_id, k, nome, unidade, tipo}] } */
  let LIB_EXTRAS = { cats: [], campos: [] };

  function setLibraryExtras(extras) {
    LIB_EXTRAS = {
      cats: (extras && extras.cats) || [],
      campos: (extras && extras.campos) || [],
    };
  }

  function freshCats() {
    /* Começa com as 9 categorias pré-prontas */
    const cats = LIB.map((c) => ({
      id: c.id, nome: c.nome, icon: c.icon, custom: false,
      campos: c.campos.map((fld) => ({ ...fld, ativo: false, valor: '', ordem: 0 })),
    }));
    /* Adiciona categorias customizadas da biblioteca */
    LIB_EXTRAS.cats.forEach((cat) => {
      if (cats.find((x) => x.id === cat.id)) return;
      cats.push({
        id: cat.id, nome: cat.nome, icon: cat.icon || 'folder',
        custom: true, campos: [],
      });
    });
    /* Adiciona campos customizados da biblioteca em suas categorias */
    LIB_EXTRAS.campos.forEach((fld) => {
      const cat = cats.find((c) => c.id === fld.cat_id);
      if (!cat) return;
      if (cat.campos.find((x) => x.k === fld.k)) return;
      cat.campos.push({
        k: fld.k, nome: fld.nome,
        unidade: fld.unidade || '', tipo: fld.tipo || 'number',
        ativo: false, valor: '', ordem: 0, custom: true,
      });
    });
    return cats;
  }
  function genId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function freshState() {
    return {
      __id: genId(),    // estável desde o mount — usado como pasta no Storage e id na DB
      identificacao: { nomeProduto: '', descricaoComercial: '', descricaoTecnica: '', categoriaProduto: '', sku: '', codigoProduto: '', partNumber: '' },
      /* NCM/DUIMP — campos novos do copiloto (inputs do humano) */
      insumo: '', funcao_aplicacao: '', eh_parte_de: '', forma_estado: '',
      /* NCM/DUIMP — decisão limpa devolvida pela IA */
      ncm_recomendado: '', ncm_descricao: '', descricao_duimp: '',
      /* Defesa — só guardada em memória durante o wizard, persiste na tabela relatorio */
      __defesa: null,
      cats: freshCats(),
      midia: { desenho: null, foto: null },
    };
  }

  const filled = (v) => v != null && String(v).trim() !== '';

  /* Compila o estado bruto em um modelo pronto pro renderer da ficha:
     { identificacao, grupos[], midia, temMidia } */
  function compile(state) {
    const grupos = state.cats
      .map((c) => {
        const ativos = c.campos.filter((fld) => fld.ativo && filled(fld.valor));
        const linhas = ativos
          .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
          .map((fld) => ({ nome: fld.nome, valor: String(fld.valor).trim(), unidade: fld.unidade, tipo: fld.tipo }));
        const ordem = ativos.length
          ? Math.min.apply(null, ativos.map((fld) => fld.ordem || 0))
          : Infinity;
        return { id: c.id, nome: c.nome, linhas, ordem };
      })
      .filter((g) => g.linhas.length)
      .sort((a, b) => a.ordem - b.ordem);
    const midia = state.midia || {};
    const temMidia = !!(midia.desenho || midia.foto);
    return { identificacao: state.identificacao, grupos, midia, temMidia };
  }

  /* Aplica um template ao estado atual: desativa tudo, injeta campos do template */
  function aplicarTemplate(state, tp) {
    const cats = state.cats.map((c) => ({ ...c, campos: c.campos.map((fld) => ({ ...fld, ativo: false })) }));
    let seq = 1;
    tp.campos.forEach((tc) => {
      const cat = cats.find((c) => c.id === tc.cat); if (!cat) return;
      let fld = cat.campos.find((x) => x.nome.toLowerCase() === tc.nome.toLowerCase());
      if (!fld) { fld = { k: slug(tc.nome), nome: tc.nome, unidade: tc.unidade || '', tipo: tc.tipo || 'number', custom: true }; cat.campos.push(fld); }
      fld.ativo = true; fld.valor = tc.valor || ''; if (tc.unidade != null) fld.unidade = tc.unidade; fld.ordem = seq++;
    });
    return {
      ...state,
      identificacao: { ...state.identificacao, nomeProduto: tp.produto || state.identificacao.nomeProduto },
      cats,
    };
  }

  function nextOrdem(cats) {
    return Math.max(0, ...cats.flatMap((c) => c.campos.map((fld) => fld.ordem || 0))) + 1;
  }

  /* podeGerar: pelo menos nome + 1 grupo preenchido */
  function podeGerar(state) {
    return !!(state.identificacao.nomeProduto || '').trim() && compile(state).grupos.length > 0;
  }

  window.FT = {
    UNIDADES, LIB, TEMPLATES,
    slug, hoje, freshCats, freshState,
    compile, aplicarTemplate, nextOrdem, podeGerar,
    setLibraryExtras,
  };
}());
