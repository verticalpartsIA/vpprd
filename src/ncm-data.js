/* ============================================================
   ncm-data.js — Mock data para módulo NCM / Ficha Técnica
   Atrelado a projetos de engenharia existentes
   ============================================================ */

window.__VP_NCM = {

  /* Códigos NCM mais usados na empresa (lista typeahead) */
  ncmCatalog: [
    { code: "8428.10.00", desc: "Elevadores e monta-cargas", attrs: "elevador" },
    { code: "8428.40.00", desc: "Escadas e tapetes rolantes", attrs: "escada" },
    { code: "8428.90.20", desc: "Aparelhos para movimentação de cargas", attrs: "carga" },
    { code: "8431.31.10", desc: "Partes de elevadores - cabos de tração", attrs: "cabos" },
    { code: "8431.31.90", desc: "Outras partes de elevadores", attrs: "outras" },
    { code: "8537.10.20", desc: "Quadros de comando até 1000V", attrs: "quadro" },
    { code: "8501.52.20", desc: "Motores elétricos CA — gearless", attrs: "motor" },
    { code: "9026.20.10", desc: "Sensores de pressão", attrs: "sensor" },
    { code: "8536.50.90", desc: "Botoeiras e interruptores elétricos", attrs: "botoeira" },
  ],

  /* Atributos por NCM (varia conforme classificação) */
  attributesByNcm: {
    "8428.10.00": [
      { key: "acionamento", label: "Tipo de acionamento", type: "select", required: true,
        options: ["Elétrico tração", "Hidráulico", "Pneumático", "Gearless MRL"] },
      { key: "capacidade", label: "Capacidade de carga", type: "number", suffix: "kg", required: true, placeholder: "630" },
      { key: "velocidade", label: "Velocidade nominal", type: "decimal", suffix: "m/s", required: true, placeholder: "1.0" },
      { key: "potencia", label: "Potência do motor", type: "decimal", suffix: "kW", required: true, placeholder: "7.5" },
      { key: "paradas", label: "Número de paradas", type: "number", required: true, placeholder: "8" },
      { key: "uso", label: "Uso", type: "radio", required: true, options: ["Residencial", "Comercial", "Industrial"] },
      { key: "tensao", label: "Tensão de alimentação", type: "select", required: true, options: ["220V", "380V", "440V"] },
      { key: "casaMaquinas", label: "Possui casa de máquinas?", type: "toggle", required: true },
    ],
    "8428.40.00": [
      { key: "tipo", label: "Tipo", type: "select", required: true, options: ["Escada rolante", "Esteira rolante", "Travelator"] },
      { key: "inclinacao", label: "Inclinação", type: "select", required: true, options: ["0°", "10°", "12°", "30°", "35°"] },
      { key: "velocidade", label: "Velocidade nominal", type: "decimal", suffix: "m/s", required: true, placeholder: "0.5" },
      { key: "larguraDegrau", label: "Largura do degrau/pallet", type: "select", required: true, options: ["600 mm", "800 mm", "1000 mm"] },
      { key: "potencia", label: "Potência do motor", type: "decimal", suffix: "kW", required: true, placeholder: "11" },
      { key: "uso", label: "Uso", type: "radio", required: true, options: ["Comercial", "Industrial", "Aeroporto"] },
      { key: "tensao", label: "Tensão", type: "select", required: true, options: ["220V Trifásico", "380V Trifásico"] },
    ],
    "8537.10.20": [
      { key: "tensaoMax", label: "Tensão máxima", type: "select", required: true, options: ["220V", "380V", "440V", "600V"] },
      { key: "corrente", label: "Corrente nominal", type: "decimal", suffix: "A", required: true, placeholder: "32" },
      { key: "protecao", label: "Grau de proteção (IP)", type: "select", required: true, options: ["IP20", "IP44", "IP55", "IP65"] },
      { key: "processador", label: "Microprocessado?", type: "toggle", required: true },
    ],
    "8431.31.10": [
      { key: "diametro", label: "Diâmetro", type: "decimal", suffix: "mm", required: true, placeholder: "10" },
      { key: "comprimento", label: "Comprimento", type: "decimal", suffix: "m", required: true, placeholder: "60" },
      { key: "material", label: "Material", type: "select", required: true, options: ["Aço carbono", "Aço inox", "Sintético kevlar"] },
      { key: "cargaRuptura", label: "Carga de ruptura", type: "decimal", suffix: "kN", required: true, placeholder: "82" },
    ],
  },

  /* Fabricantes (Operador Estrangeiro) — já cadastrados */
  fabricantes: [
    { id: "FAB-001", nome: "Hangzhou Lift Co., Ltd.", pais: "China", flag: "🇨🇳",
      logradouro: "No. 588 Xinyuan Road, Industrial Park", cidade: "Hangzhou", subdivisao: "Zhejiang",
      cep: "310018", email: "export@hangzhoulift.cn", tin: "CN91330000123456789X", codigoInterno: "VP-HLC" },
    { id: "FAB-002", nome: "Suzhou Vertical Equipment Co., Ltd.", pais: "China", flag: "🇨🇳",
      logradouro: "Block 12, Suzhou Industrial Park", cidade: "Suzhou", subdivisao: "Jiangsu",
      cep: "215021", email: "trade@suzhouvertical.cn", tin: "CN91320500987654321X", codigoInterno: "VP-SVE" },
    { id: "FAB-003", nome: "Tianjin Control Systems Co., Ltd.", pais: "China", flag: "🇨🇳",
      logradouro: "Binhai New Area, Bldg 7", cidade: "Tianjin", subdivisao: "Tianjin",
      cep: "300457", email: "sales@tjcontrol.cn", tin: "CN91120116554433221X", codigoInterno: "VP-TCS" },
    { id: "FAB-004", nome: "OOCL Industrial Components", pais: "Coreia do Sul", flag: "🇰🇷",
      logradouro: "157 Gwanggyojungang-ro", cidade: "Suwon-si", subdivisao: "Gyeonggi-do",
      cep: "16229", email: "intl@ooclic.kr", tin: "KR1234567890", codigoInterno: "VP-OIC" },
  ],

};
