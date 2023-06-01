import { Model } from "./model.js";
import { createTable, removeTable } from "./table.js";
import knex from "knex";

export function connect({ uri, client = "mysql", filename } = {}) {
  const db = knex({
    client: client,
    connection: {
      filename,
      uri,
    },
    useNullAsDefault: true,
  });

  return {
    getModel(tableName) {
      return new Model(tableName, db);
    },
    createTable(tableName, columns) {
      return createTable(tableName, columns, db);
    },
    removeTable(tableName) {
      return removeTable(tableName, db);
    },
  };
}
