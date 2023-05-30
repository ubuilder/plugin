import { Model } from "./model.js";
import { createTable, removeTable } from "./table.js";
import knex from "knex";

export function connect(config) {
    const db = knex(config)
  return {
    Model(tableName) {
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
