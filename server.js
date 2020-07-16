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
}

function viewAll() {
  connection.query(`SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "department name"
  FROM employee_db.employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id`, 
  function (err, res) {
    if (err) throw err;
    console.table(res);
    startQuestions();
  });
}

//to create multiple choice, you need to run SELECT command first to get a query for the answers.
function viewByDept() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Which department?",
    })
    .then(function (answer) {
      connection.query(
        `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "department name"
      FROM employee_db.employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE department.name LIKE '${answer.department}'`,
        function (err, res) {
          if (err) throw err;
          console.table(res);
        }
      );
      startQuestions();
    });
}

function viewByRole() {
  inquirer
    .prompt({
      name: "role",
      type: "input",
      message: "Which role?",
    })
    .then(function (answer) {
      connection.query(
        `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "department name"
      FROM employee_db.employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
      WHERE role.title LIKE '${answer.role}'`,
        function (err, res) {
          if (err) throw err;
          console.table(res);
        }
      );
      startQuestions();
    });
}

function createDept() {
  inquirer.prompt ({
    name: "addDept",
    type: "input",
    message: "What is the name of the department?",
  })
  .then(function (answer) {
    connection.query(
      "INSERT INTO department SET ?", {name: answer.addDept}
    )
    startQuestions();
  })
}

function createRole() {
  inquirer.prompt ({
    name: "addRole",
    type: "input",
    message: "What is the name of the department?",
  })
  .then(function (answer) {
    connection.query(
      "INSERT INTO role SET ?", {name: answer.addRole}
    )
    startQuestions();
  })
}
//investigate why department name is being added to added employees
function addEmployee() {
  inquirer.prompt ([{
    name: "addFirst",
    type: "input",
    message: "What is the first name of the employee?",
  },
  {
    name: "addLast",
    type: "input",
    message: "What is the first name of the employee?",
  },
  {
    name: "addRole",
    type: "number",
    message: "What is the role ID (must be a number)?",
  },
  {
    name: "addManager",
    type: "number",
    message: "What is the manager ID (must be a number)?",
  }
])
  .then(function (answer) {
    connection.query(
      "INSERT INTO employee SET ?", {first_name: answer.addFirst, last_name: answer.addLast, role_id: answer.addRole, manager_id: answer.addManager}
    )
    startQuestions();
  })
}

function delEmployee() {
  connection.query(`SELECT * FROM employee_db.employee`, function (err, results) {
    if(err) throw err;
  console.table(results);
  inquirer.prompt ({
    name: "employee_delete",
    type: "list",
    message: "Who do you want to remove?",
    choices: function () {
      var choiceArray = [];
      for (var i = 0; i < results.length; i++) {
        choiceArray.push(results[i].first_name + " " + results[i].last_name);
      }
      return choiceArray;
    },
    
    })
  }).then(function (answer){
    var chosenEmployee;
    console.log(chosenEmployee)
    for (var i = 0; i < results.length; i++) {
      if (results[i].id === answer.choice) {
        chosenEmployee = results[i].id;
    //     connection.query(`DELETE FROM employee_db.employee WHERE ?`,
    //     {
    //       employee.id: chosenEmployee
    //     }
      }
    }
  })
}


//try to update the below to not be number related
function updateRole() {
  inquirer.prompt ([{
    name: "employee_id",
    type: "input",
    message: "Who do you want to update?",
  },
  {
    name: "role_id",
    type: "number",
    message: "What is the new role ID (must be a number)?",
  }])
  .then(function (answer) {
    connection.query(
      "UPDATE employee SET role_id= ? WHERE id= ?", [answer.role_id, answer.employee_id]
    )
  })
  startQuestions();
}


function updateManager() {
  inquirer.prompt ([{
    name: "employee_id",
    type: "input",
    message: "Who do you want to update?",
  },
  {
    name: "manager_id",
    type: "number",
    message: "What is the new role ID (must be a number)?",
  }])
  .then(function (answer) {
    connection.query(
      "UPDATE employee SET role_id= ? WHERE id= ?", [answer.manager_id, answer.employee_id]
    )
  })
  startQuestions();
}
