const toDomainModel = (csvBoleto, loteId) => {
    return {
      nome_sacado: csvBoleto.nome,
      lote_id: loteId,
      valor: parseFloat(csvBoleto.valor),
      linha_digitavel: csvBoleto.linha_digitavel,
      ativo: true,
      criado_em: new Date()
    };
  };

  module.exports = {
    toDomainModel
  };