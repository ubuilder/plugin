import { Model } from "./model";
import { createTable, removeTable } from "./table";

export function connect(config) {
  return {
    Model(tableName) {
      return new Model(tableName, config);
    },
    createTable(tableName, columns) {
      return createTable(tableName, columns, config);
    },
    removeTable(tableName) {
      return removeTable(tableName, config);
    },
  };
}
