const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: process.env.CONNECTION_LIMIT,    // the number of connections node.js will hold open to our database
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dateStrings: true
});

module.exports = pool;
