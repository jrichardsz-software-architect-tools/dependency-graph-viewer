const knex = require("../config/mysql")

const projectTechnologies = knex.schema.hasTable('project_technologies').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('project_technologies', (table) => {
      table.increments('projectTechnologiesId').primary();
      table.integer('technologiesId').unsigned().notNullable();
      table.integer('projectId').unsigned().notNullable();

      table.foreign('technologiesId').references('technologies.technologiesId');
      table.foreign('projectId').references('projects.projectId');
    })
  }
})


module.exports = {
  projectTechnologies
}