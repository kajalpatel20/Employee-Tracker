const mysql = require('mysql');
const inquirer = require('inquirer');
// const { inherits } = require('util');
// const connection = require('./db/connection');
const consoleTable = require('console.table');
// const { create } = require('domain');

//create connection for sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db',
})

connection.connect(function (err) {
    if (err) throw err;
    options();
})

function options() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Welcome to our employee database! What would you like to do? ',
        choices: [
            'view all employees',
            'view all departments',
            'view all roles',
            'add an employee',
            'add a department',
            'add a role',
            'update employee role',
            'delete an employee',
            'exit'
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case 'view all employees':
                viewEmployees();
                break;
            case 'view all departments':
                viewDepartments();
                break;
            case 'view all roles':
                viewRoles();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'update employee role':
                updateEmployeeRole();
                break;
            case 'delete an employee':
                deleteEmployee();
                break;
            case 'exit':
                exitApp();
                break;
            default:
                break;
        }
    })
}

function viewEmployees() {
    var query = 'select * from employee';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found! ')
        console.table('All employees: ', res);
        options();
    })
}
function viewDepartments() {
    var query = 'select * from department';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' departments found! ')
        console.table('All departments: ', res);
        options();
    })
}
function viewRoles() {
    var query = 'select * from role';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' roles found! ')
        console.table('All roles: ', res);
        options();
    })
}
function addEmployee() {
    var query = 'select * from role';
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name ?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?"
            },
            {
                name: 'manager_id',
                type: 'input',
                message: "What is manager's id?"
            },
            {
                name: 'role',
                type: 'list',
                choices: function () {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is this employee's role?"
            }
        ]).then(function (answer) {
            let role_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].title == answer.role) {
                    role_id = res[a].id;
                    console.log(role_id)
                }
            }
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    manager_id: answer.manager_id,
                    role_id: role_id,
                },
                function (err) {
                    if (err) throw err;
                    console.log('your employee has been added!');
                    options();
                }
            )
        })
    })
};
function addDepartment() {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'Which department would you like add?',
        }
    ]).then(function (answer) {
        connection.query(
            'INSERT INTO department SET ?',
            {
                name: answer.newDepartment
            })
        var query = 'select * from department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("your department has been added");
            console.table("All Departments: ", res);
            options();
        })
    })
}
function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'new_role',
                type: 'input',
                message: 'What new role would you like add?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function () {
                    var departmentArray = [];
                    for (let i = 0; i < res.length; i++) {
                        departmentArray.push(res[i].name);
                    }
                    return departmentArray
                }
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id
                }
            }
            connection.query('INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if (err) throw err;
                    console.log('your new role has been added!');
                    console.table('All roles : ', res);
                    options();
                }
            )
        })
    });
}
function updateEmployeeRole() {
    let employeeArray = [];
    let roleArray = [];
    connection.query('SELECT id, title FROM role ORDER BY title ASC', function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })

    connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            employeeArray.push(res[i].Employee);
        }
    })


    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'What would you like to edit?',
            choices: employeeArray

        },
        {
            name: 'role',
            type: 'list',
            message: 'What is their new role?',
            choices: roleArray
        },
    ]).then((answer) => {
        let roleID;
        let employeeID;
        for (i = 0; i < roles.length; i++) {
            if (answer.role == roles[i].title) {
                roleID = roles[i].id
            }
        }
        for (i = 0; i < employees.length; i++) {
            if (answer.employee == employees[i].Employee) {
                employeeID = employees[i].id
            }
        }
        connection.query('UPDATE employee SET role_id = ? where id = ?', {
            role_id: roleID,
            id: employeeID,
        },
            function (err) {
                if (err) throw err;
                console.log("employee role has been updated!")
                options();
            })
    })


}

