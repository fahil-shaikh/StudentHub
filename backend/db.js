require('dotenv').config()

const mysql = require('mysql2')

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test database connection
db.getConnection((error, connection) => {
  if (error) {
    console.error('MySQL connection failed:', error.message)
    return
  }

  console.log('MySQL database connected successfully!')

  connection.release()
})

module.exports = db