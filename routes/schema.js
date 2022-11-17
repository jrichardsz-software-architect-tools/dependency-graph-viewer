const express = require("express");
const router = express.Router();

const {
  createSchema,
  dropSchema
} = require("../controllers/Schema");

/**
 * Crear esquema
 */
router.get("/", (req, res) => {
  res.send({ schema: '200' })
})

router.get("/create", createSchema)

router.get("/drop", dropSchema)

module.exports = router;