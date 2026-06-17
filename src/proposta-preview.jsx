/* ============================================================
   proposta-preview.jsx — Live PDF preview pages (right column)
   Mirrors filled-in data; uses real uploaded covers
   ============================================================ */

function PEPreview({ data, eq }) {
  const eqLabel = eq === "elevador" ? "elevador" : eq === "escada" ? "escada" : "esteira";
  const eqName = eq === "elevador" ? "Elevador" : eq === "escada" ? "Escada Rolante" : "Esteira Rolante";
  const ed = data[eq];

  return (
    <div className="pe__preview">
      <div className="pe__preview-head">
        <h4>Preview da Proposta</h4>
        <div className="row gap-2">
          <Badge variant="yellow">{eqName}</Badge>
          <Button variant="ghost" size="sm" icon="eye" data-tip="Tela cheia"/>
          <Button variant="ghost" size="sm" icon="download" data-tip="Gerar PDF"/>
        </div>
      </div>

      <div className="pe__preview-pages">
        {/* Page 1: Capa */}
        <PreviewCapa data={data} eq={eqLabel}/>

        {/* Page 2: Cliente + Obra */}
        <PreviewClienteObra data={data} eq={eqLabel}/>

        {/* Page 3: Texto da Proposta */}
        <PreviewTexto data={data} eq={eqLabel} eqName={eqName}/>

        {/* Page 4: Descrição + Especificações */}
        <PreviewDescricaoEspec data={data} eq={eqLabel}/>

        {eqLabel === "elevador" && <PreviewAcabamentos data={data}/>}

        {/* Page final: Valores */}
        <PreviewValores data={data} eq={eqLabel}/>

        {/* Garantia */}
        <PreviewGarantia data={data} eq={eqLabel}/>

        {/* Cláusulas Comerciais (P2 + P9 + P10) — apenas elevador */}
        {eqLabel === "elevador" && <PreviewClausulas data={data}/>}
      </div>
    </div>
  );
}

function PreviewCapa({ data, eq }) {
  const v = data.vendedor;
  const filial = FILIAIS.find(f => f.id === data.filial) || FILIAIS[0];
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-capa" data-eq={eq}>
        <div className="pe__pdf-capa-img"/>
        <div className="pe__pdf-capa-body">
          <h1 className="pe__pdf-capa-title">Proposta<br/>Comercial</h1>
          <dl className="pe__pdf-capa-grid">
            <dt>Nº da Proposta</dt>
            <dt>Vendedor</dt>
            <dd>{data.numero || <span style={{ color: "var(--vp-gray-300)" }}>VP-2026-XXX</span>}</dd>
            <dd>{v.nome || <span style={{ color: "var(--vp-gray-300)" }}>—</span>}</dd>
            <dt>Contato</dt>
            <dt>&nbsp;</dt>
            <dd>{v.email || <span style={{ color: "var(--vp-gray-300)" }}>@verticalparts.com.br</span>}</dd>
            <dd>&nbsp;</dd>
          </dl>
          <div className="pe__pdf-capa-foot">
            <span><Icon.message size={6}/> {v.celular || v.fixo || "(11) 2528-6473"}</span>
            <span><Icon.pin size={6}/> {filial.endereco} — {filial.cidade}/{filial.uf}</span>
          </div>
        </div>
      </div>
      <div className="pe__pdf-pgnum">Página 1 de 16</div>
    </div>
  );
}

function PreviewClienteObra({ data, eq }) {
  const c = data.cliente, o = data.obra;
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 02 · Identificação</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Cliente & Obra</div>
        <h2 className="pdf-h2">Identificação</h2>
        <div className="pdf-rule"/>

        <h3 className="pdf-h3">Dados do Cliente</h3>
        <div className="pdf-spec-grid">
          <div><span>Razão Social</span><b>{c.nome || "—"}</b></div>
          <div><span>CNPJ</span><b>{c.cnpj || "—"}</b></div>
          <div><span>A/C</span><b>{c.responsavel || "—"}</b></div>
          <div><span>Telefone</span><b>{c.telefone || "—"}</b></div>
          <div><span>E-mail</span><b>{c.email || "—"}</b></div>
          <div><span>CEP</span><b>{c.cep || "—"}</b></div>
          <div><span>Endereço</span><b>{[c.endereco, c.numero].filter(Boolean).join(", ") || "—"}</b></div>
          <div><span>Bairro / Cidade</span><b>{[c.bairro, c.cidade, c.uf].filter(Boolean).join(" · ") || "—"}</b></div>
        </div>

        <h3 className="pdf-h3">Dados da Obra</h3>
        <div className="pdf-spec-grid">
          <div><span>Empreendimento</span><b>{o.nome || "—"}</b></div>
          <div><span>CEP</span><b>{o.cep || "—"}</b></div>
          <div><span>Endereço</span><b>{[o.endereco, o.numero].filter(Boolean).join(", ") || "—"}</b></div>
          <div><span>Bairro / Cidade / UF</span><b>{[o.bairro, o.cidade, o.uf].filter(Boolean).join(" · ") || "—"}</b></div>
        </div>
      </div>
      <div className="pe__pdf-pgnum">Página 2 de 16</div>
    </div>
  );
}

function PreviewTexto({ data, eq, eqName }) {
  const ed = data[eq];
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 03 · Apresentação</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Comercial</div>
        <h2 className="pdf-h2">{eqName}</h2>
        <div className="pdf-rule"/>
        {data.dataLinha ? <p style={{ fontWeight: 700, marginBottom: 4 }}>{data.dataLinha}</p> : <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>São Paulo, [data]</p>}
        {calcDataExpiracao(data.dataEmissao, data.validadeDias)
          ? <p style={{ fontSize: 8, color: "var(--vp-gray-500)", marginBottom: 8 }}>Válido até <b>{calcDataExpiracao(data.dataEmissao, data.validadeDias)}</b></p>
          : null}
        {ed.textoProposta ? <p>{ed.textoProposta}</p> : <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>O texto da proposta aparecerá aqui conforme preenchimento.</p>}
        <h3 className="pdf-h3">Linha de Modelos</h3>
        {ed.textoModelos ? <p>{ed.textoModelos}</p> : <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>Descreva a linha do produto neste campo.</p>}
      </div>
      <div className="pe__pdf-pgnum">Página 3 de 16</div>
    </div>
  );
}

function PreviewDescricaoEspec({ data, eq }) {
  const ed = data[eq];
  const desc = ed.descricao || [];
  const espec = ed.especificacoes || [];
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 04 · Especificação Técnica</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Produto</div>
        <h2 className="pdf-h2">Especificação Técnica</h2>
        <div className="pdf-rule"/>

        {desc.slice(0, 1).map((d, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <h3 className="pdf-h3">{d.titulo || `Produto ${i + 1}`}</h3>
            {d.linha ? <p style={{ fontWeight: 600 }}>{d.linha}</p> : null}
            {eq === "elevador" && (d.familia || d.modelo || d.norma) ? (
              <div className="pdf-spec-grid">
                {d.familia ? <div><span>Família</span><b>{d.familia}</b></div> : null}
                {d.modelo ? <div><span>Modelo</span><b>{d.modelo}</b></div> : null}
                {d.norma ? <div><span>Norma</span><b>NBR {d.norma}</b></div> : null}
              </div>
            ) : null}
            {d.desc ? <p>{d.desc}</p> : null}
            {d.beneficios ? <p style={{ whiteSpace: "pre-line" }}>{d.beneficios}</p> : null}
          </div>
        ))}

        {espec.slice(0, 2).map((s, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <h3 className="pdf-h3">{s.id || `Unidade ${i + 1}`}</h3>
            <div className="pdf-spec-grid">
              {eq === "elevador" ? <>
                <div><span>Modelo</span><b>{s.modelo || "—"}</b></div>
                <div><span>Tipo de Empreendimento</span><b>{s.empreendimento || "—"}</b></div>
                <div><span>Característica</span><b>{s.carac || "—"}</b></div>
                <div><span>Denominação Pavimentos</span><b>{s.denominacao || "—"}</b></div>
                <div><span>Percurso</span><b>{s.percurso ? `${s.percurso}mm` : "—"}</b></div>
                <div><span>Capacidade</span><b>{s.capacidade || "—"}</b></div>
                <div><span>Dimensões Caixa</span><b>{s.dimensoesCaixa || "—"}</b></div>
                <div><span>Prof. Poço</span><b>{s.profPoço ? `${s.profPoço}mm` : "—"}</b></div>
                <div><span>Velocidade</span><b>{s.vel ? `${s.vel} m/s` : "—"}</b></div>
                <div><span>And./Paradas/Portas</span><b>{s.andaresParadasPortas || "—"}</b></div>
              </> : <>
                <div><span>Tipo de Empreendimento</span><b>{s.empreendimento || "—"}</b></div>
                <div><span>Característica</span><b>{s.carac || "—"}</b></div>
                <div><span>{eq === "escada" ? "Desnível" : "Desnível / Comp."}</span><b>{(eq === "escada" ? s.desnivel : s.desnivelComp) ? `${(eq === "escada" ? s.desnivel : s.desnivelComp)}mm` : "—"}</b></div>
                <div><span>Inclinação</span><b>{s.incl || "—"}</b></div>
                <div><span>{eq === "escada" ? "Largura Degrau" : "Largura Pallet"}</span><b>{(eq === "escada" ? s.largDegrau : s.largPallet) || "—"}</b></div>
                <div><span>Balaustrada</span><b>{s.balaustrada || "—"}</b></div>
                <div><span>Velocidade</span><b>{s.vel || "—"}</b></div>
                <div><span>Alimentação</span><b>{s.alimentacao || "—"}</b></div>
                <div><span>Arranjo</span><b>{s.arranjo || "—"}</b></div>
                <div><span>Máquina</span><b>{s.maquina || "—"}</b></div>
              </>}
              <div><span>Quantidade</span><b>{s.qtd || "1"}</b></div>
            </div>
          </div>
        ))}

        {(desc.length === 0 && espec.length === 0) ? (
          <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>Preencha pelo menos uma descrição e uma especificação técnica.</p>
        ) : null}
      </div>
      <div className="pe__pdf-pgnum">Página 4 de 16</div>
    </div>
  );
}

function PreviewAcabamentos({ data }) {
  const a = data.elevador.acabamentos;
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 05 · Acabamentos</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Cabine & Pavimento</div>
        <h2 className="pdf-h2">Acabamentos</h2>
        <div className="pdf-rule"/>
        <div className="pdf-spec-grid">
          <div><span>Modelo Cabine</span><b>{a.modeloCabine || "—"}</b></div>
          <div><span>Material</span><b>{a.acabamentoMat || "—"}</b></div>
          <div><span>Sub-teto</span><b>{a.subTeto || "—"}</b></div>
          <div><span>Painel Operação</span><b>{a.painelOperacao || "—"}</b></div>
          <div><span>Piso Cabina</span><b>{a.pisoCabina || "—"}</b></div>
          <div><span>Medidas Piso</span><b>{a.medidasPiso || "—"}</b></div>
          <div><span>Modelo Porta</span><b>{a.modeloPorta || "—"}</b></div>
          <div><span>Dim. Porta Cabine</span><b>{a.dimPortaCabine || "—"}</b></div>
          <div><span>Acab. Porta Cabine</span><b>{a.acabPortaCabine || "—"}</b></div>
          <div><span>Portas Pavimento</span><b>{a.portasPavimento || "—"}</b></div>
          <div><span>Botoeiras Pavim.</span><b>{a.botoeirasPavimento || "—"}</b></div>
          <div><span>Sinalização</span><b>{a.sinalizacao || "—"}</b></div>
        </div>
        {a.modeloCabine === "VP-004" && a.paineisVP004 ? <p style={{ marginTop: 6 }}><b>Configuração de painéis:</b> {a.paineisVP004}</p> : null}
        {a.pavInox ? <p style={{ marginTop: 6 }}><b>Pavimentos inox:</b> {a.pavInox}</p> : null}
        {a.demais ? <><h3 className="pdf-h3">Demais</h3><p>{a.demais}</p></> : null}
      </div>
      <div className="pe__pdf-pgnum">Página 5 de 16</div>
    </div>
  );
}

function PreviewValores({ data, eq }) {
  const v = data[eq].valores;
  const parcelas = v.parcelas || [];
  const qtd = parseFloat(v.quantidade) || 0;
  const unit = parseFloat((v.valorUnit || "0").toString().replace(/\./g, "").replace(",", ".")) || 0;
  const difal = parseFloat((v.difal || "0").toString().replace(/\./g, "").replace(",", ".")) || 0;
  const totalEq = qtd * unit;
  const totalDifal = totalEq + difal;
  const fmt = (n) => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 09 · Valores</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Comercial</div>
        <h2 className="pdf-h2">Valores e Pagamento</h2>
        <div className="pdf-rule"/>

        <table className="pdf-table">
          <thead>
            <tr><th>Equipamento</th><th style={{ textAlign: "right" }}>Qtd</th><th style={{ textAlign: "right" }}>Valor Unit.</th><th style={{ textAlign: "right" }}>Total</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{v.equipamento || "—"}</td>
              <td style={{ textAlign: "right" }}>{qtd || "—"}</td>
              <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{unit ? fmt(unit) : "—"}</td>
              <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{totalEq ? fmt(totalEq) : "—"}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td colSpan={3}>DIFAL</td><td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{difal ? fmt(difal) : "—"}</td></tr>
          </tfoot>
        </table>

        <div className="pdf-total">
          <span>Total com DIFAL</span>
          <b>{fmt(totalDifal)}</b>
        </div>

        {parcelas.length > 0 ? (
          <>
            <h3 className="pdf-h3" style={{ marginTop: 10 }}>Parcelamento</h3>
            <table className="pdf-table">
              <thead><tr><th>#</th><th>Descrição</th><th style={{ textAlign: "right" }}>Valor</th></tr></thead>
              <tbody>
                {parcelas.map((p, i) => (
                  <tr key={i}>
                    <td style={{ width: 18 }}>{i + 1}</td>
                    <td>{p.desc || "—"}</td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{p.valor ? "R$ " + p.valor : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        <p style={{ marginTop: 6, fontSize: 6.5, color: "var(--fg3)" }}>
          Forma de pagamento: <b>{v.forma || "a definir"}</b>
        </p>
      </div>
      <div className="pe__pdf-pgnum">Página 9 de 16</div>
    </div>
  );
}

function PreviewGarantia({ data, eq }) {
  const g = data[eq].garantia;
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 14 · Garantia</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Jurídico</div>
        <h2 className="pdf-h2">Garantia & Condições</h2>
        <div className="pdf-rule"/>
        <h3 className="pdf-h3">Garantia</h3>
        {g.garantia ? <p>{g.garantia}</p> : <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>Texto de garantia será preenchido.</p>}
        <h3 className="pdf-h3">Condições Gerais</h3>
        {g.condicoes ? <p>{g.condicoes}</p> : <p style={{ color: "var(--vp-gray-400)", fontStyle: "italic" }}>Condições gerais serão preenchidas.</p>}

        <div className="pdf-footer">
          <span>VerticalParts · CNPJ {(FILIAIS.find(f => f.id === data.filial) || FILIAIS[0]).cnpj}</span>
          <span>{data.numero || "VP-2026-XXX"}</span>
        </div>
      </div>
      <div className="pe__pdf-pgnum">Página 14 de 16</div>
    </div>
  );
}

function PreviewClausulas({ data }) {
  const c = data.elevador.condicoesPagto;
  const cli = data.cliente;
  const filial = FILIAIS.find(f => f.id === data.filial) || FILIAIS[0];
  const hasRep = cli.cpfRepresentante || cli.cargoRepresentante;
  return (
    <div className="pe__pdf">
      <div className="pe__pdf-pgmark">P. 15 · Cláusulas Comerciais</div>
      <div className="pe__pdf-inner">
        <div className="pdf-eyebrow">▎ Jurídico / Comercial</div>
        <h2 className="pdf-h2">Cláusulas Comerciais</h2>
        <div className="pdf-rule"/>

        <h3 className="pdf-h3">Reserva de Domínio (P2)</h3>
        <p style={{ whiteSpace: "pre-line", fontSize: 7 }}>{c.reservaDominio || _P2}</p>

        <h3 className="pdf-h3">Reajuste Cambial (P5)</h3>
        <p style={{ whiteSpace: "pre-line", fontSize: 7 }}>{c.reajusteCambial || _P5}</p>

        <h3 className="pdf-h3">Proteção de Dados — LGPD (P10)</h3>
        <p style={{ whiteSpace: "pre-line", fontSize: 7 }}>{c.lgpd || _P10}</p>

        {hasRep ? (
          <>
            <div className="pdf-rule" style={{ marginTop: 14 }}/>
            <h3 className="pdf-h3">Assinaturas</h3>
            <div className="pdf-spec-grid">
              <div><span>Representante Legal</span><b>{cli.responsavel || "—"}</b></div>
              <div><span>CPF</span><b>{cli.cpfRepresentante || "—"}</b></div>
              <div><span>Cargo</span><b>{cli.cargoRepresentante || "—"}</b></div>
              <div><span>Poderes</span><b>{cli.poderesRepresentante || "—"}</b></div>
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 7 }}>
              <div style={{ borderTop: "1px solid #ccc", paddingTop: 4 }}>
                <div>{cli.responsavel || "Representante do Contratante"}</div>
                <div style={{ color: "#666" }}>{cli.nome || "Empresa Contratante"} · CPF {cli.cpfRepresentante || "—"}</div>
              </div>
              <div style={{ borderTop: "1px solid #ccc", paddingTop: 4 }}>
                <div>VerticalParts Elevadores Ltda.</div>
                <div style={{ color: "#666" }}>CNPJ {filial.cnpj} · {filial.cidade}/{filial.uf}</div>
              </div>
            </div>
          </>
        ) : null}

        <div className="pdf-footer">
          <span>VerticalParts · CNPJ {filial.cnpj}</span>
          <span>{data.numero || "VP-2026-XXX"}</span>
        </div>
      </div>
      <div className="pe__pdf-pgnum">Página 15 de 16</div>
    </div>
  );
}

Object.assign(window, { PEPreview });
