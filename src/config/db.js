// src/config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || "root",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "taskmanager",
  charset:            "utf8mb4",
  timezone:           "Z",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

pool.getConnection()
  .then(async (conn) => {
    await conn.query("SET NAMES utf8mb4");
    console.log("✅ MySQL connecté");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Erreur MySQL :", err.message);
    process.exit(1);
  });

module.exports = pool;