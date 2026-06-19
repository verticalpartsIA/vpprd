/* ============================================================
   data-book-store.js
   Gerenciamento de documentos personalizáveis por obra
   Upload, armazenamento e entrega de Data Books no Supabase Storage
   ============================================================ */
(function () {
  'use strict';

  function sb() { return (window.__VP_SB || {}).sb; }

  async function uploadDataBook(projectId, file) {
    const c = sb();
    if (!c || !projectId || !file) throw new Error('Parâmetros inválidos');

    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `data-books/${projectId}/${timestamp}-${safeFileName}`;

    const { error: uploadError } = await c.storage
      .from('engenharia')
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = c.storage
      .from('engenharia')
      .getPublicUrl(filePath);

    const dataBook = {
      documento: filePath,
      nome_arquivo: safeFileName,
      tamanho_bytes: file.size,
      tipo_arquivo: file.type || 'application/octet-stream',
      enviado_em: new Date().toISOString(),
      url_publica: publicUrl,
    };

    const { error: updateError } = await c.from('projetos')
      .update({ data_book: dataBook, atualizado_em: new Date().toISOString() })
      .eq('id', projectId);

    if (updateError) throw updateError;

    return dataBook;
  }

  async function getDataBook(projectId) {
    const c = sb();
    if (!c || !projectId) return null;

    const { data } = await c.from('projetos')
      .select('data_book')
      .eq('id', projectId)
      .single();

    return data?.data_book || null;
  }

  async function deleteDataBook(projectId) {
    const c = sb();
    if (!c || !projectId) throw new Error('projectId inválido');

    const { data } = await c.from('projetos')
      .select('data_book')
      .eq('id', projectId)
      .single();

    if (data?.data_book?.documento) {
      await c.storage.from('engenharia').remove([data.data_book.documento]);
    }

    const { error } = await c.from('projetos')
      .update({ data_book: null, atualizado_em: new Date().toISOString() })
      .eq('id', projectId);

    if (error) throw error;
  }

  function fmtFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  window.DataBookStore = {
    uploadDataBook,
    getDataBook,
    deleteDataBook,
    fmtFileSize,
  };
})();
