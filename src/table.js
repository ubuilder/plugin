import knex from "knex";

export async function createTable(name, columns, db) {
    await db.schema.createTable(name, (table) => {
      let query;
      table.increments("id");
      for (const column of columns) {
        if (column.type === "number") {
          query = table.integer(column.name);
        } else if (column.type === "string") {
          query = table.text(column.name);
        } else if (column.type == "boolean") {
          query = table.boolean(column.name);
        }
  
        if (column.required) {
          query = query.notNullable();
        }
  
        if (column.unique) {
          query = query.unique();
        }
      }
    });
  
    return true;
  }
  
export async function removeTable(name, db) {
    await db.schema.dropTableIfExists(name);
  
    return true;
  }
  