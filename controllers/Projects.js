const knex = require("../config/mysql")

const getAllProjects = async (req, res) => {
  try {
    const response = await knex('projects').select().orderBy('projectId', 'desc');
    res.send(response)
  } catch (err) {
    res.send(`[PROJECTS:GET_ALL] ${err}`)
  }
}

const getProject = async (req, res) => {
  try {

    let { id } = req.params;

    if (!id)
      throw 'NEED: projectId'

    const response = await knex('projects')
      .select("projectId", "project")
      .where({
        projectId: id
      });

    res.send(response)
  } catch (err) {
    res.send(`[PROJECTS:GET] ${err}`)
  }
}

/**
 * @param {object} projectData Project fields
 * @returns 
 */
const createProject = async (req, res) => {
  let data = '';
  req.on('data', (chunk) => data += chunk);

  req.on('end', async () => {
    data = JSON.parse(data)
    try {
      const response = await knex('projects').insert(data)
      res.send(response);
    } catch (err) {
      res.send(`[PROJECTS:CREATE] ${err}`);
    }
  })
}

module.exports = {
  getAllProjects,
  getProject,
  createProject
}