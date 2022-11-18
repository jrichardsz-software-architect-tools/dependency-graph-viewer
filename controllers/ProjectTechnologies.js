const knex = require("../config/mysql");

const __getProjectTechnologies = async (projectId = null) => {
  let projects = null;

  if (projectId) {
    projects = await knex('project_technologies')
      .join('projects', 'project_technologies.projectId', '=', 'projects.projectId')
      .join('technologies', 'project_technologies.technologiesId', '=', 'technologies.technologiesId')
      .select("technologies.technologiesId", "technologies.technologie")
      .where({
        'projects.projectId': projectId
      });

  } else {

    /* projects = await knex('project_technologies')
      .leftJoin('projects', function () {
        this.on('projects.projectId', '=', 'project_technologies.projectId')
      })
      .join('technologies', 'project_technologies.technologiesId', '=', 'technologies.technologiesId')
      .select('projects.projectId', 'projects.project', 'technologies.technologiesId', 'technologies.technologie')
      .orderBy('projects.projectId', 'desc'); */

    projects = await knex('projects')
      .leftJoin('project_technologies', function () {
        this.on('project_technologies.projectId', '=', 'projects.projectId')
      })
      .leftJoin('technologies', function () {
        this.on('technologies.technologiesId', '=', 'project_technologies.technologiesId')
      })
      .select('projects.projectId', 'projects.project', 'technologies.technologiesId', 'technologies.technologie')
      .orderBy('projects.projectId', 'desc');

    let data = []
    let projectName = null;
    let projectData = {};
    let countProject = 0;

    for (const project of projects) {
      countProject++;

      if (projectData !== project.project) {
        projectName = project.project;

        if (projectData.length > 1) {
          data.push(projectData)
          projectData = []
        }

      }

      if (!projectData[`${project.project}`]) {
        projectData[`${project.project}`] = []
      }
      projectData[`${project.project}`].push(project)

      if (projects.length === countProject) {
        if (projectData[`${project.project}`].length > 1) {
          data.push(projectData)
          projectData = []
        }
      }
    }

    projects = data;
  }

  return projects;
}

const getProjectTechnologie = async (req, res) => {
  try {
    let { id } = req.params;
    const response = await __getProjectTechnologies(id);
    res.send(response)
  } catch (err) {
    console.log(`[PROJECT_TECHNOLOGIES:GET] ${err}`)
    res.send(`[PROJECT_TECHNOLOGIES:GET] ${err}`);
  }
}

const getProjectTechnologies = async (req, res) => {
  try {
    const response = await __getProjectTechnologies();
    res.send(response);
  } catch (err) {
    console.log(`[PROJECT_TECHNOLOGIES:GET_ALL] ${err}`)
    res.send(`[PROJECT_TECHNOLOGIES:GET_ALL] ${err}`);
  }
}

const getProjectTechnologiesGraph = async (req, res) => {
  try {
    let dataJson = {
      "nodes": [],
      "links": []
    }
    let nodes = [];
    let links = [];
    let technologies = await knex('technologies').select();

    let countNode = 0;
    for (const technologie of technologies) {
      let newNode = {
        name: technologie.technologie,
        position: countNode,
        class: "technologie"
      }

      nodes.push(newNode)
      countNode++;
    }

    let projectTechnologies = await __getProjectTechnologies();

    for (const projectTechnologie in projectTechnologies[0]) {
      let newNode = {
        name: projectTechnologie,
        position: countNode,
        class: "project"
      }
      for (const technologie of projectTechnologies[0][projectTechnologie]) {
        let source = null;

        if (technologie.technologiesId === null)
          continue;

        nodes.map(node => {
          if (node.name === technologie.technologie) source = node.position
        })

        let newLink = {
          source: source,
          target: countNode,
          type: "depends"
        }

        links.push(newLink)
      }

      nodes.push(newNode)
      countNode++;
    }

    dataJson.nodes = nodes;
    dataJson.links = links;

    res.send(dataJson)
  } catch (err) {
    console.log(`[PROJECT_TECHNOLOGIES:GRAPH] ${err}`)
    res.send(`[PROJECT_TECHNOLOGIES:GRAPH] ${err}`);
  }
}

const createProjectTechnologie = async (req, res) => {
  let data = '';

  req.on('data', (chunk) => data += chunk);

  req.on('end', async () => {
    data = JSON.parse(data);
    try {
      const response = await knex('project_technologies')
        .insert(data);
      res.send(response)
    } catch (err) {
      console.log(`[PROJECT_TECHNOLOGIES:CREATE] ${err}`)
      res.send(`[PROJECT_TECHNOLOGIES:CREATE] ${err}`);
    }
  })
}

const registerProjectsTechnologies = async (req, res) => {
  let projects = '';
  req.on('data', (chunk) => projects += chunk);

  req.on('end', async () => {
    projects = JSON.parse(projects);
    try {
      for (const project of projects) {
        let newProject = project.project;
        let newClass = project.class;
        let newTechnologies = project.technologies || null;

        let projectId = await knex.select('projectId', 'project')
          .from('projects')
          .where('project', newProject);

        if (projectId.length === 0) {
          projectId = await knex('projects').insert({ project: newProject, class: newClass })
          console.log(`Insert new project: ${newProject}`)
        } else {
          projectId = projectId[0].projectId;
        }

        if (newTechnologies) {
          newTechnologies.map(async (technologie) => {
            let technologiesId = await knex.select('technologiesId', 'technologie')
              .from('technologies')
              .where('technologie', technologie);

            if (technologiesId.length === 0) {
              technologiesId = await knex('technologies').insert({ technologie, class: 'technologie' })
              console.log(`Insert new technologie: ${technologie}`)
            } else {
              technologiesId = technologiesId[0].technologiesId;
            }

            let projectTechnologiesId = await knex.select('projectTechnologiesId')
              .from('project_technologies')
              .where({
                technologiesId: technologiesId,
                projectId: projectId
              });

            if (projectTechnologiesId.length === 0) {
              projectTechnologiesId = await knex('project_technologies')
                .insert({
                  technologiesId: technologiesId,
                  projectId: projectId
                })
              console.log(`New project technology registered: ${projectTechnologiesId}`)
            }
          })
        }
      }

      res.status(200).send('Register projects and their technologies')
    } catch (err) {
      console.log(`[PROJECT_TECHNOLOGIES:REGISTER_PROJECTS_AND_TECHNOLOGIES] ${err}`)
      res.send(`[PROJECT_TECHNOLOGIES:REGISTER_PROJECTS_AND_TECHNOLOGIES] ${err}`);
    }
  })
}

module.exports = {
  getProjectTechnologie,
  getProjectTechnologies,
  createProjectTechnologie,
  registerProjectsTechnologies,
  getProjectTechnologiesGraph
}