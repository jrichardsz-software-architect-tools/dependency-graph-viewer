const knex = require("../config/mysql")
const projects = require("../models/Projects")
const projectTechnologies = require("../models/ProjectTechnologies")
const technologies = require("../models/Technologies")

const createSchema = (req, res) => {
  try {
    res.send({
      projects, technologies, projectTechnologies
    })
  } catch (err) {
    res.send(`[SCHEMA:CREATE_SCHEMA] ${err}`)
  }
}

const dropSchema = (req, res) => {
  try {

    knex.schema.dropTableIfExists('project_technologies')
    knex.schema.dropTableIfExists('technologies');
    knex.schema.dropTableIfExists('projects');

    res.send(`Drop tables`)
  } catch (err) {
    res.send(`[SCHEMA:DROP_SCHEMA] ${err}`)
  }
}

module.exports = {
  createSchema,
  dropSchema
}