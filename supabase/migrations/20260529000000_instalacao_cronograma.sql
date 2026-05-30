-- ============================================================
-- Cronograma de Pagamento da Instalação (mão de obra · 4 fases)
-- Tela: Instalação & Entrega → Cronograma
-- ============================================================

CREATE TABLE IF NOT EXISTS public.instalacao_cronograma (
  id            text PRIMARY KEY,
  endereco      text,
  montador      text,
  paradas       integer,
  carga_kg      integer,
  valor_total   numeric DEFAULT 0,
  f1_valor      numeric DEFAULT 0,
  f2_valor      numeric DEFAULT 0,
  f3_valor      numeric DEFAULT 0,
  f4_valor      numeric DEFAULT 0,
  -- status por fase: 'Pendente' → 'Liberada' (marco atingido) → 'Paga'
  f1_status     text DEFAULT 'Liberada',   -- 1ª fase: início da instalação
  f2_status     text DEFAULT 'Pendente',   -- 2ª fase: equipamento tracionado
  f3_status     text DEFAULT 'Pendente',   -- 3ª fase: portas de pavimento + elétrica
  f4_status     text DEFAULT 'Pendente',   -- 4ª fase: conclusão do equipamento
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.instalacao_cronograma ENABLE ROW LEVEL SECURITY;

CREATE POLICY leitura_publica ON public.instalacao_cronograma FOR SELECT TO public USING (true);
CREATE POLICY escrita_anon    ON public.instalacao_cronograma FOR INSERT TO public WITH CHECK (true);
CREATE POLICY update_anon     ON public.instalacao_cronograma FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY delete_anon     ON public.instalacao_cronograma FOR DELETE TO public USING (true);
