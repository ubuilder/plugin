const Model = require("./knex/models/Model");
const createTable = require("./knex/migrations/createTable");
const removeTable = require("./knex/migrations/removeTable");

module.exports = {
  Model,
  createTable,
  removeTable
};
