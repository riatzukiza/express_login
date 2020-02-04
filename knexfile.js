// Update with your config settings.

module.exports = {

  development: {
      client: 'mysql2',
      connection: {
          database: 'express_login_development',
          user:     'root',
          password: 'TestPassword12345'
      },
      pool: {
          min: 2,
          max: 10
      },
      migrations: {
          tableName: 'knex_migrations'
      }
  }


};
