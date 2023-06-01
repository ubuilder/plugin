export class Model {
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }

  async query(options) {
    const { select, sort, where, page, perPage } = options;

    let query = this.db(this.tableName);

    if (where) {
      for (const key in where) {
        const value = where[key];

        if (typeof value === "string" && value.includes(":")) {
          const [filterValue, filterType] = value.split(":");

          if (filterType === "like") {
            query = query.whereLike(key, `%${filterValue}%`);
          } else if ((filterType === "=") & (filterValue === "null")) {
            query = query.whereNull(key);
          } else if (filterType === "!=" && filterValue === "null") {
            query = query.whereNotNull(key);
          } else if (filterType === "in") {
            const v = filterValue.split(",");
            query = query.whereIn(key, v);
          } else if (filterType === "between") {
            const [start, end] = filterValue.split(",");
            query = query.whereBetween(key, [start, end]);
          } else {
            query = query.where(key, filterType ?? "=", filterValue);
          }
        } else {
          query = query.where(key, value);
        }
      }
    }

    if (select) {
      query = query.select(select);
    } else {
      query = query.select("*");
    }

    if (sort) {
      query = query.orderBy(sort.column, sort.order);
    }

    let currentPage = page ?? 1;
    let itemsPerPage = perPage ?? 10;

    // Get the total number of rows in the database
    const totalRows = await query.clone().count("* as count").first();
    let total = totalRows.count;

    // Adjust the perPage value if necessary
    if (total < itemsPerPage || !itemsPerPage) {
      itemsPerPage = total;
    }

    const offset = (currentPage - 1) * itemsPerPage;
    query = query.offset(offset).limit(itemsPerPage);

    const data = await query;

    return {
      data,
      total,
      page: currentPage,
      perPage: itemsPerPage,
    };
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
