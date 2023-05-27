module.exports = {
    development: {
        client: 'mysql',
        connection: {
          host : '127.0.0.1',
          user : 'root',
          password : '',
          database : 'ubuilder',
          charset: 'utf8'
        },
        migrations: {
          directory: __dirname + '/knex/migrations',
        },
        seeds: {
          directory: __dirname + '/knex/seeds'
        }
      },
    staging: {},
    production: {}
  };