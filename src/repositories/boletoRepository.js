const db = require('../config/db');

const createMany = async (boletos) => {   
    return await db('boletos').insert(boletos);
};

const findByNames = async (names) => {
    return await db('boletos')
        .where('nome_sacado', names)
        .select('id', 'nome_sacado').first();
}

const index = async (filter) => {
    const query = db('boletos')
    if(filter.nome){
        query.where('nome_sacado', 'like', `%${filter.nome}%`)
    }
    if(filter.id_lote){
        query.where('lote_id', filter.id_lote)
    }
    if(filter.valor_inicial && filter.valor_final){
        query.whereBetween('valor', [filter.valor_inicial, filter.valor_final])
    }
    return await query
}
module.exports = { createMany, findByNames, index };