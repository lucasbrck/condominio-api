const REQUIRED_HEADERS = ['nome', 'unidade', 'valor', 'linha_digitavel'];

const validateHeaders = (headers) => {
    const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h));
    
    if (missing.length > 0) {
        throw new Error(`CSV fora do formato - Colunas faltando: ${missing.join(', ')}`);
    }
    const extra = headers.filter(h => !REQUIRED_HEADERS.includes(h));
    if (extra.length > 0) {
      throw new Error(`CSV fora do formato -  Colunas extras: ${extra.join(', ')}`);
    }
}

module.exports = { validateHeaders}