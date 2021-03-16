const util = require('util');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shaan0807',
    database: 'employees_db'
});

connection.connect();

connection.query = util.promisify(connection.query);


module.exports = connection;