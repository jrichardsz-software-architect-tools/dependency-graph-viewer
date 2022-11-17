const knex = require("../config/mysql")

const projects = knex.schema.hasTable('projects').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('projects', (table) => {
      table.increments('projectId').primary();
      table.string('project').unique({ indexName: 'i_projects1'}).notNullable();
      table.string('class');
    })
  }
})


module.exports = {
  projects
}