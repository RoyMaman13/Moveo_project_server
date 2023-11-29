const mysql = require('mysql');

// Create a MySQL database connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'moveo'
});

// Establish a connection to the MySQL database
db.connect((err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
}));

module.exports = db;
