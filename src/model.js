import knex from "knex";

export class Model {
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }

  async query(options) {
    const result = await this.db(this.tableName).then((rows) => rows);
    return result;
  }

  async insert(data) {
    const result = await this.db(this.tableName).insert(data);
    return result;
  }

  async get(id) {
    const [row] = await this.db(this.tableName).where({ id });
    return row;
  }

  async update(id, data) {
    await this.db(this.tableName).where({ id }).update(data);
  }

  async remove(id) {
    await this.db(this.tableName).where({ id }).del();
  }
}
