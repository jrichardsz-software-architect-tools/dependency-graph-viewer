const express = require("express");
const router = express.Router();

const {
  getAllTechnologies,
  getTechnologie,
  createTechnologie
} = require("../controllers/Technologies");

router.get("/status", (req, res) => {
  res.send('200')
})

/**
 * List technologies
 */
router.get("/", getAllTechnologies)

/**
 * Get technologies
 */
router.get("/:id", getTechnologie)

/**
 * Create project
 */
router.post("/create", createTechnologie)

module.exports = router