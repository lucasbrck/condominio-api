/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.createTable('boletos', function (table) {
      table.increments('id').primary();
      table.string('nome_sacado').notNullable();
      table.string('linha_digitavel').notNullable();
      table.float('valor').notNullable();
      table.integer('lote_id').notNullable();
      table.foreign('lote_id').references('id').inTable('lotes').onDelete('CASCADE');
      table.boolean('ativo').defaultTo(true);
      table.timestamp('criado_em').defaultTo(knex.fn.now());
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    knex.schema.dropTableIfExists('boletos');
  };
  