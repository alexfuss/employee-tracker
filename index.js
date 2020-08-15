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

// Create a function for the user to view all departments
function viewDepartments() {
    let query = "SELECT * FROM department";
        connection.query(query, (err, res) => {
            console.log(`DEPARTMENTS:`)

            res.forEach(department => {
                console.log(`ID: ${department.id} | Name: ${department.dep_name}`);
            })

            startTracker();
        });
}

// Create a function for the user to view all roles
function viewRoles() {
    let query = "SELECT * FROM employee_role";
        connection.query(query, (err, res) => {
            console.log(`ROLES:`)

            res.forEach(role => {
                console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
            })

            startTracker()
        });
}

// Create a function for the user to view all employees
function viewEmployees() {
    let query = "SELECT * FROM employee";
        connection.query(query, (err, res) => {
            console.log(`EMPLOYEES:`)

            res.forEach(employee => {
                console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
            })

            startTracker()
        });
}

// Create a function so the user can add a department
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What is the name of the new department?",
        }).then((answer) => {
            let query = "INSERT INTO department (name) VALUES ( ? )";
            connection.query(query, answer.department, (err, res) => {
                console.log(`You have added this department: ${(answer.department).toUpperCase()}.`);
            })

            viewDepartments();
        })
}

// Create a function so the user can add an employee role
function addRole() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw (err);

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the new role?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of the new role?",
                },
                {
                    name: "departmentName",
                    type: "list",
                    message: "Which department does this role fall under?",
                    choices: function() {
                        let choicesArr = [];
                        res.forEach(res => {
                            choicesArr.push(res.name);
                        })

                        return choicesArr;
                    }
                }
        ]).then((answer) => {
            const department = answer.departmentName;
            connection.query("SELECT * FROM DEPARTMENT", (err, res) => {
                if (err) throw (err);

                let filteredDept = res.filter(function(res) {
                    return res.name == department;
                })

                let id = filteredDept[0].id;
                let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                let values = [answer.title, parseInt(answer.salary), id]
                console.log(values);

                connection.query(query, values, function(err, res, fields) {
                    console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                })

                viewRoles();
            })
        })
    })
}

// Create an asynchronous function to allow the user to add an employee
async function addEmployee() {
    connection.query("SELECT * FROM role", (err, result) => {
        if (err) throw (err);

        inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "roleName",
                    type: "list",
                    message: "What role does the employee have?",
                    choices: function() {
                        rolesArr = [];
                        result.forEach(result => {
                            rolesArr.push(result.title);
                        })
                        return rolesArr;
                    }
                }
            ]).then((answer) => {
                console.log(answer);
                const role = answer.roleName;

                connection.query("SELECT * FROM role", (err, res) => {
                    if (err) throw (err);

                    let filteredRole = res.filter(function(res) {
                        return res.title == role;
                    })

                    let roleId = filteredRole[0].id;
                    connection.query("SELECT * FROM employee", (err, res) => {
                        inquirer
                            .prompt([
                                {
                                    name: "manager",
                                    type: "list",
                                    message: "Who is your manager?",
                                    choices: function() {
                                        managersArr = []
                                        res.forEach(res => {
                                            managersArr.push(res.last_name)
                                        })
                                        return managersArr;
                                    }
                                }
                            ]).then((managerAnswer) => {
                                const manager = managerAnswer.manager;

                                connection.query("SELECT * FROM employee", (err, res) => {
                                    if (err) throw (err);

                                    let filteredManager = res.filter(function(res) {
                                        return res.last_name == manager;
                                    })

                                    let managerId = filteredManager[0].id;
                                        console.log(managerAnswer);

                                        let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                                        let values = [answer.firstName, answer.lastName, roleId, managerId]
                                        console.log(values);

                                        connection.query(query, values, (err, res, fields) => {
                                            console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                                        })

                                        viewEmployees();
                                })
                            })
                    })
                })
            })
    })
}

// Create a function that allows the user to update a role
function updateRole() {
    connection.query("SELECT * FROM employee", (err, result) => {
        if (err) throw (err);

        inquirer
            .prompt([
                {
                    name: "employeeName",
                    type: "list",
                    message: "Which employee's role is changing?",
                    choices: function() {
                        employeeArr = [];
                            result.forEach(result => {
                                employeeArr.push(result.last_name);
                            })
                        
                        return employeeArr;
                    }
                }
            ]).then((answer) => {
                console.log(answer);

                const name = answer.employeeName;

                connection.query("SELECT * FROM role", (err, res) => {
                    inquirer
                        .prompt([
                            {
                                name: "role",
                                type: "list",
                                message: "What is their new role?",
                                choices: function() {
                                    rolesArr = [];
                                    res.forEach(res => {
                                        rolesArr.push(res.title)
                                    })

                                    return rolesArr;
                                }
                            }
                        ]).then((roleAnswer) => {
                            const role = roleAnswer.role;
                            console.log(roleAnswer.role);

                            connection.query("SELECT * FROM role WHERE title = ?", [role], (err, res) => {
                                if (err) throw (err);

                                let roleId = res[0].id;
                                let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                                let values = [roleId, name]

                                console.log(values);

                                connection.query(query, values, (err, res, fields) => {
                                    console.log(`You have updated ${name}'s role to ${role}.`)
                                })

                                viewEmployees();
                            })
                        })
                })
            })
    })
}