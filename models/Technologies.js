const knex = require("../config/mysql")

const technologies = knex.schema.hasTable('technologies').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('technologies', (table) => {
      table.increments('technologiesId').primary();
      table.string('technologie').unique({ indexName: 'i_technologies1' }).notNullable();
      table.string('class');
    })
  }
})

module.exports = {
  technologies
}