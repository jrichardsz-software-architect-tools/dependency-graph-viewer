const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  getProject,
  createProject
} = require("../controllers/Projects");

const {
  getProjectTechnologies,
  getProjectTechnologie,
  createProjectTechnologie,
  getProjectTechnologiesGraph
} = require("../controllers/ProjectTechnologies");

router.get("/status", (req, res) => {
  res.send('200')
})

/**
 * List projects
 */
router.get("/", getAllProjects)

/**
 * List project
 */
router.get("/:id", getProject)

/**
 * Create project
 */
router.post("/create", createProject)

/**
 * Get data for graph
 */
router.get("/graph/data", getProjectTechnologiesGraph)

/**
 * List project and technologies details
 */
router.get("/detail/all", getProjectTechnologies)


/**
 * Get project detail
 */
router.get("/detail/:id", getProjectTechnologie)

/**
 * Create project detail
 */
router.post("/detail/create", createProjectTechnologie)


module.exports = router