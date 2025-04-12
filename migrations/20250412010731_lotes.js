/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.createTable('lotes', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.timestamp('criado_em').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.dropTableIfExists('lotes');
};
