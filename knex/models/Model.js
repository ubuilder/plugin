const knex = require("../knex");

class Model {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async index() {
    const [rows] = await knex(this.tableName).then(rows => rows);
    return rows;
  }

  async create(data) {
    const [row] = await knex(this.tableName).insert(data);
    return row;
  }

  async findById(id) {
    const [row] = await knex(this.tableName).where({ id });
    return row;
  }

  async updateById(id, data) {
    await knex(this.tableName).where({ id }).update(data);
  }

  async deleteById(id) {
    await knex(this.tableName).where({ id }).del();
  }
}

module.exports = Model;
