const db = require('../config/db');

const findManyByNames = async (loteNames) => {
    return await db('lotes')
    .whereIn(db.raw("CAST(name AS INTEGER)"), loteNames)
    .select('id', 'name');
};

module.exports = {
    findManyByNames,
};