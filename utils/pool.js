var mysql = require('mysql2');

var pool = mysql.createPool({
  host: process.env.HOSTING,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
}).promise();

module.exports = pool;