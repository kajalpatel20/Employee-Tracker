const inquirer = require('inquirer');
const { inherits } = require('util');
const connection = require('./db/connection');


var res = connection.query(
    'SELECT * FROM employee'
)

console.log('RESPONSE', res)
