const knex = require("../config/mysql");

const getAllTechnologies = async (req, res) => {
  try {
    const response = await knex('technologies').select();
    res.send(response);
  } catch (err) {
    res.send(`[TECHNOLOGIES:GET_ALL] ${err}`);
  }
}

const getTechnologie = async (req, res) => {
  try {
    let { id } = req.params;
    const response = await knex('technologies')
      .select("technologiesId", "technologie")
      .where({
        technologiesId: id
      });

    res.send(response)
  } catch (err) {
    res.send(`[TECHNOLOGIES:GET] ${err}`);
  }
}

const createTechnologie = async (req, res) => {
  let data = '';
  req.on('data', (chunk) => data += chunk);

  req.on('end', async () => {
    data = JSON.parse(data);

    try {
      const response = await knex('technologies').insert(data);
      res.send(response);
    } catch (err) {
      res.send(`[TECHNOLOGIES:CREATE] ${err}`);
    }
  })
}

module.exports = {
  getAllTechnologies,
  getTechnologie,
  createTechnologie
}