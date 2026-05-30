-- ============================================================
-- seed_demo_data.sql — Dados de demonstração do VP PRD
-- ------------------------------------------------------------
-- Projeto Supabase: jxtqwzmpgofwctqajewt
-- Estes dados deixam as telas (Jurídico, Logística/navios, etc.)
-- completas como no protótipo do Claude Designer, mantendo tudo
-- persistente no Supabase real.
--
-- Conforme Workflow.md (seção DADOS DE TESTE): dados fictícios são
-- permitidos desde que exista rotina de limpeza/reset (abaixo).
--
-- Uso (psql ou SQL editor do Supabase):
--   1) Para repovoar o alinhamento de demonstração: rode o bloco SEED.
--   2) Para limpar dados de teste: rode o bloco RESET.
-- ============================================================

-- ============================================================
-- SEED — alinhamento de demonstração
-- ============================================================

-- Contratos (Jurídico): status batendo com KPIs + contagem de redações
ALTER TABLE public.contratos ADD COLUMN IF NOT EXISTS redacted integer DEFAULT 0;
UPDATE public.contratos SET status='Assinado',              redacted=2, pages=18 WHERE id='CTR-001';
UPDATE public.contratos SET status='Em redação',            redacted=3, pages=24 WHERE id='CTR-002';
UPDATE public.contratos SET status='Aguardando assinatura', redacted=0, pages=14 WHERE id='CTR-003';
UPDATE public.contratos SET status='Em assinatura digital', redacted=4, pages=34 WHERE id='CTR-004';

-- Embarques (Logística/Mapa Marítimo): posição, geo, milestones e docs
UPDATE public.embarques SET position=0.62 WHERE id='EMB-001';
UPDATE public.embarques SET position=0.97, lat=-23.00, lng=-44.05, speed=0, heading=0 WHERE id='EMB-002';
UPDATE public.embarques SET position=0.45 WHERE id='EMB-003';

UPDATE public.embarques SET
  docs = '["BL ✓","Invoice ✓","Packing List ✓","Certificado de Origem ✓","Seguro pendente"]'::jsonb,
  milestones = '[{"label":"Booking confirmado","date":"2026-04-10","state":"done"},{"label":"Carregamento Xangai","date":"2026-04-20","state":"done"},{"label":"Saída origem (ETD)","date":"2026-04-22","state":"done"},{"label":"Trânsito marítimo","date":"—","state":"current","note":"Atraso de 5 dias"},{"label":"Chegada Santos (ETA)","date":"2026-06-02","state":"future"},{"label":"Liberação aduaneira","date":"—","state":"future"}]'::jsonb
WHERE id='EMB-001';
UPDATE public.embarques SET
  docs = '["BL ✓","Invoice ✓","Packing List ✓","DI registrada"]'::jsonb,
  milestones = '[{"label":"Booking confirmado","date":"2026-04-25","state":"done"},{"label":"Carregamento Xangai","date":"2026-05-05","state":"done"},{"label":"Saída origem (ETD)","date":"2026-05-07","state":"done"},{"label":"Chegada Itaguaí","date":"2026-06-15","state":"done"},{"label":"Liberação aduaneira","date":"—","state":"current","note":"Canal vermelho — inspeção"},{"label":"Entrega CD","date":"—","state":"future"}]'::jsonb
WHERE id='EMB-002';
UPDATE public.embarques SET
  docs = '["BL ✓","Invoice ✓","Packing List ✓","Origem aguardando"]'::jsonb,
  milestones = '[{"label":"Booking confirmado","date":"2026-04-18","state":"done"},{"label":"Carregamento Hamburgo","date":"2026-04-28","state":"done"},{"label":"Saída origem (ETD)","date":"2026-04-30","state":"done"},{"label":"Trânsito marítimo","date":"—","state":"current"},{"label":"Chegada Santos (ETA)","date":"2026-06-05","state":"future"},{"label":"Liberação aduaneira","date":"—","state":"future"}]'::jsonb
WHERE id='EMB-003';

-- Usuários: remover entradas fictícias (placeholder e duplicata mal grafada)
DELETE FROM public.usuarios WHERE email='gelsonsimoes@gmail.com' AND name='Fulano de Tal';
DELETE FROM public.usuarios WHERE email='ariliene.avila@verticalparts.com.br';

-- ============================================================
-- RESET — limpeza de dados de teste transacionais
-- (descomente para usar; NÃO apaga colaboradores/usuários reais)
-- ============================================================
-- DELETE FROM public.leads      WHERE id LIKE 'LD-E2E%' OR building ILIKE '%teste e2e%';
-- DELETE FROM public.cotacoes   WHERE id LIKE 'CT-E2E%';
-- DELETE FROM public.embarques  WHERE id LIKE 'EM-E2E%';
-- DELETE FROM public.contratos  WHERE id LIKE 'CO-E2E%';
