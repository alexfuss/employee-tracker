// Create the initial constant variable for all required packages
const mysql = require("mysql");
const inquirer = require("inquirer");

// Setup the mySQL connection
let connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "11990022",
    database: "employee_db"
});

// Establish the connection and callout errors
connection.connect(function(err) {
    if (err) throw err;
    startTracker();
});

// Create a function that initializes the CLI App
function startTracker() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
              "View all departments",
              "View all roles",
              "View all employees",
              "Add a department",
              "Add a role",
              "Add an employee",
              "Update employee role",
              "Exit"
            ]
        }).then((answer) => {
            if (answer.action === "View all departments") {
                viewDepartments();
            }
            else if (answer.action === "View all roles") {
                viewRoles();
            }
            else if (answer.action === "View all employees") {
                viewEmployees();
            }
            else if (answer.action === "Add a departments") {
                addDepartment();
            }
            else if (answer.action === "Add a role") {
                addRole();
            }
            else if (answer.action === "Add an employee") {
                addEmployee();
            }
            else if (answer.action === "Update employee role") {
                updateRole();
            }
            else if (answer.action === "Exit") {
                connection.end();
            }
        });
}