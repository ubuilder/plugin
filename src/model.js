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
        if (typeof where[key] == "string" && where[key].includes(":")) {
          const [filterValue, filterType ] = where[key].split(":");
          if(filterType == "like") {
            query = query.whereLike(key, `%${filterValue}%`);
          }

          if (filterValue == "null" && filterType == "=") {
            query = query.whereNull(key);
          }else if(filterType == "="){
            query = query.where(key, filterValue);
          }

          if (filterValue == "null" && filterType == "!=") {
            query = query.whereNotNull(key);
          }else if(filterType == "!="){
            query = query.whereNot(key, filterValue);
          } 

          if(filterType == "<" || filterType == ">" || filterType == "<=" || filterType == ">="){
            query = query.where(key, filterType, filterValue)
          }

          if(filterType == "between"){
            const [start, end] = filterValue.split(",");
            query = query.whereBetween(key, [start, end]);
          }

          if(filterType == "in"){
            const v = filterValue.split(",");
            query = query.whereIn(key, v)
          }
        }else{
          query = query.where(key, where[key])
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

    if (page || perPage) {
      let currentPage = page ?? 1;
      let itemsPerPage = perPage ?? 10;

      // Get the total number of rows in the database
      const totalRows = await query.clone().count("* as count").first();
      const totalCount = totalRows.count;

      // Adjust the perPage value if necessary
      if (totalCount < itemsPerPage || !itemsPerPage) {
        itemsPerPage = totalCount;
      }

      const offset = (currentPage - 1) * itemsPerPage;
      query = query.offset(offset).limit(itemsPerPage);
    }

    const result = await query;
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
