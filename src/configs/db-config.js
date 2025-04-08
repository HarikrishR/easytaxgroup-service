const config = {
  local: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: 5433,
    dialect: 'postgres'
  },

  dev: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  },

  prod: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true, // Validates the SSL certificate
      },
      connectTimeout: 10000,
      // connectionTimeoutMillis: 0.001, // PostgreSQL
      // requestTimeoutMillis: 15000, // PostgreSQL
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000, // soft limit
      evict: 10000,
      // maxIdleTime: 10000, // hard limit
      handleDisconnects: true,
    },
  },
};

module.exports = config;
