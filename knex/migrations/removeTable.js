const knex = require("./knex");

async function removeTable(name) {
  await knex.schema.dropTableIfExists(name);

  return `Table ${name} removed`;
}

module.exports = removeTable;
