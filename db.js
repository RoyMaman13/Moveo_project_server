const mysql = require('mysql');
require('dotenv').config();

// Create a MySQL database connection configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    port : process.env.DB_PORT,
});

// Establish a connection to the MySQL database
db.connect((err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
}));

module.exports = db;
