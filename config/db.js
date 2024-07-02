// db.js
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "redis_db",
};

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error("Could not create a connection to the database:", err);
    throw err;
  }
};

module.exports = {
  getConnection,
};
