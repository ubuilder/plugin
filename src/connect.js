import { Model } from "./model";
import { createTable, removeTable } from "./table";

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
