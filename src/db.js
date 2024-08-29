require('dotenv').config();
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER ? process.env.DB_USER : "postgres",
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "postgres",
    host: "db",
    port: 5432,
    database: process.env.DB_NAME ? process.env.DB_NAME : "finance"
});

module.exports = pool;