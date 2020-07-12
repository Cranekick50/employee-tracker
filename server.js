var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "employee_db",
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    startQuestions();
  });

  function startQuestions() {
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Role",
        "Create Department",
        "Create Role",
        "Add Employee",
        "Delete Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees by Department":
          viewByDept();
          break;

        case "View All Employees by Role":
          viewByRole();
          break;

        case "Create Department":
          createDept();
          break;

        case "Create Role":
          createRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Delete Employee":
          delEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;
        
        case "Update Employee Manager":
          updateManager();
          break;
      }
    });
  };

  function viewAll() {
    connection.query(
      "SELECT * FROM employee_db", function(err,res) {
        if (err) throw err;
      console.log(res);
      connection.end();
      }
    )
    startQuestions();
  };
  
  function viewByDept() {
    inquirer
      .prompt({
        name: "department",
        type: "choice",
        message: "What department?",
        choice: []
      })
      .then(function (answer) {
        console.log(answer.department);
        connection.query(
          "SELECT * FROM employee_db WHERE ?",
          { department: answer.department },
          function (err, res) {
            if (err) throw err;
            console.log(
              // table columns
            );
            startQuestions();
          }
        );
      });

function viewByRole() {
    console.log ("this works")
}

function createDept() {
    console.log ("this works")
}

function createRole() {
    console.log ("this works")
}

function addEmployee() {
    console.log ("this works")
}

function delEmployee() {
    console.log ("this works")
}

function updateRole() {
    console.log ("this works")
}

function updateManager() {
    console.log ("this works")
}