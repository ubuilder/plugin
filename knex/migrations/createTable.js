const knex = require("../knex");

async function createTable(name, columns) {
  await knex.schema.createTable(name, (table) => {
    for (const column of columns) {
      let columnBuilder = table[column.type](column.name);

      if (column.autoIncrement) {
        columnBuilder = columnBuilder.unsigned().notNullable().primary();
      }

      if (column.required) {
        columnBuilder = columnBuilder.notNullable();
      }

      if (column.unique) {
        columnBuilder = columnBuilder.unique();
      }
    }
  });

  return `Table ${name} created`;
}

module.exports = createTable;
