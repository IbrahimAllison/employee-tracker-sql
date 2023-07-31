const inquirer = require("inquirer");
const mysql = require("mysql2");
const myPrintTable = require("console.table");
const cfonts = require('cfonts');

// Create Data Connection using MYSQL
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "DataBase2023",
  database: "employee_db",
});

// Console.log 
connection.connect((err) => {
  if (err) throw err;
  console.log("You are connected to the Employee Tracker.");
  startTracker();
});

cfonts.say('Employee Tracker!', {
	font: 'block',              
	align: 'left',              
	colors: ['system'],         
	background: 'transparent',  
	letterSpacing: 1,          
	lineHeight: 1,              
	space: true,                
	maxLength: '0',             
	gradient: false,            
	independentGradient: false, 
	transitionGradient: false,  
	env: 'node'                 
});

function startTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What action do you want to perform with the database? Please select from the options below",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })

    // Response based on the selection from line 43 through 50 above
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log("Invalid. Please make another selection.");
          startTracker();
      }
    });
}

// The code for viewing all the departments
function viewAllDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {
 
    if (err) throw err;
    console.table(res);
    startTracker();
  });
}

// Code to view all roles in the database.
function viewAllRoles() {
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department ON roles.department_id = department.id",
    (err, res) => {

      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
}

// Code for viewing all employees in the database.
function viewAllEmployees() {
  connection.query(
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id',
    (err, res) => {

      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
}

// The code is for adding a department.
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Please enter the name of the department you want to add:",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        (err) => {
          if (err) throw err;
          console.log("Great!. Department added successfully!");
          startTracker();
        }
      );
    });
}

function addRole() {

  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Please enter the title for the role:",
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter the salary for this role:",
          validate: (value) => {
            if (isNaN(value) === false) {
              return true;
            }
            return "Invalid. Please enter the salary again.";
          },
        },
        {
          name: "department",
          type: "list",
          message: "Please select the department from the list below:",
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answers) => {
        const selectedDepartment = departments.find(
          (department) => department.name === answers.department
        );

        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: selectedDepartment.id,
          },
          (err) => {
            if (err) throw err;
            console.log("Great!. Role added successfully!");
            startTracker();
          }
        );
      });
  });
}

function addEmployee() {

  connection.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;

    connection.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Please enter the employee's first name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Please enter the employee's last name?:",
          },
          {
            name: "role",
            type: "list",
            message: "Please choose the employee's role:",
            choices: roles.map((role) => role.title),
          },
          {
            name: "manager",
            type: "list",
            message: "Choose the employee's manager:",
            choices: [
              "None",
              ...employees.map(
                (employees) => `${employees.first_name} ${employees.last_name}`
              ),
            ],
          },
        ])
        .then((answers) => {
          const choosenRole = roles.find(
            (roles) => roles.title === answers.role
          );

          let managerId = null;
          if (answers.manager !== "None") {
            const choosenManager = employees.find(
              (employees) =>
                `${employees.first_name} ${employees.last_name}` ===
                answers.manager
            );
            managerId = choosenManager.id;
          }

          connection.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: choosenRole.id,
              manager_id: managerId,
            },
            (err) => {
              if (err) throw err;
              console.log("Great!. You have successfully added a New Employee!");
              startTracker();
            }
          );
        });
    });
  });
}

// Update employees role
function updateEmployeeRole() {

  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employees",
            type: "list",
            message: "Choose the employee to update:",
            choices: employees.map(
              (employees) => `${employees.first_name} ${employees.last_name}`
            ),
          },
          {
            name: "role",
            type: "list",
            message: "What is the employees's new role?",
            choices: roles.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const selectedEmployees = employees.find(
            (employees) =>
              `${employees.first_name} ${employees.last_name}` ===
              answers.employees
          );
          const choosenRole = roles.find(
            (role) => role.title === answers.role
          );

          connection.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [choosenRole.id, selectedEmployees.id],
            (err) => {
              if (err) throw err;
              console.log("Employee role has been updated!");
              startTracker();
            }
          );
        });
    });
  });
}