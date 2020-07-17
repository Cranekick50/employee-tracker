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

      }
    });
}

function viewAll() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, department.name as "department name"
  FROM employee_db.employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startQuestions();
    }
  );
}

//to create multiple choice, you need to run SELECT command first to get a query for the answers.
function viewByDept() {
  connection.query(`SELECT * FROM employee_db.department`, function (err, res) {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Which department?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
          }
          return choiceArray;
        },
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
  });
}

function viewByRole() {
  connection.query(`SELECT role.title FROM employee_db.role`, function (
    err,
    res
  ) {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which role?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].title);
          }
          return choiceArray;
        },
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
  });
}

function createDept() {
  inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What is the name of the department?",
    })
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        name: answer.addDept,
      });
      connection.query(`SELECT * FROM employee_db.department`, function (err, res) {
        if (err) throw err
        console.table(res);
      });
      startQuestions();
    });
}

function createRole() {
  connection.query(
    "SELECT department.name, department.id FROM employee_db.department",
    function (err, res) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            choices: function () {
              var choiceArray = [];
              var choiceArrayID = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].name);
                choiceArrayID.push(res[i].id);
              }
              return choiceArray;
            },
            message: "Which Department?",
          },
          {
            name: "title",
            type: "input",
            message: "What is the role name?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary?",
          },
        ])
        .then(function (answer) {
          var department_id = answer.choice;
          for (var i = 0; i < res.length; i++) {
            if (res[i].name === answer.choice) {
              department_id = res[i].id;
              console.log(department_id);
            }
          }
          connection.query(
            "INSERT INTO role SET ?",
            {
              title: answer.title,
              salary: answer.salary,
              department_id: department_id,
            },
            function (err) {
              if (err) throw err;

              connection.query(`SELECT * FROM employee_db.role`, function (err, res) {
                if (err) throw err
                console.table(res);
              });
              startQuestions();
            }
          );
        });
    }
  );
}

function addEmployee() {
  connection.query(
    "SELECT role.title, role.id FROM employee_db.role",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      inquirer
        .prompt([
          {
            name: "addFirst",
            type: "input",
            message: "What is the first name of the employee?",
          },
          {
            name: "addLast",
            type: "input",
            message: "What is the last name of the employee?",
          },
          {
            name: "addRole",
            type: "list",
            message: "What is the role?",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push(res[i].title);
              }
              return choiceArray;
            },
          },
          {
            name: "addManager",
            type: "number",
            message: "What is the manager ID (must be a number)?",
          },
        ])
        .then(function (answer) {
          console.log(answer);
          console.log(answer.addRole);
          var role_id = answer.addRole;
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.addRole) {
              role_id = res[i].id;
              console.log(role_id);
            }
          }

          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.addFirst,
              last_name: answer.addLast,
              role_id: role_id,
              manager_id: answer.addManager,
            },

            function (err) {
              if (err) throw err;
            }
          );
          connection.query(`SELECT * FROM employee_db.employee`, function (err, res) {
            if (err) throw err
            console.table(res);
          });
          startQuestions();
        });
    }
  );
}

function delEmployee() {
  connection.query(`SELECT * FROM employee`, function (err, results) {
    if (err) throw err;
    console.table(results);
    inquirer
      .prompt({
        name: "employee_delete",
        type: "list",
        message: "Who do you want to remove?",
        choices: function () {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push({
              name: `${results[i].first_name} ${results[i].last_name}`,
              value: results[i],
            });
          }
          return choiceArray;
        },
      })
      .then((answer) => {
        console.log(answer);
        connection.query(
          `DELETE FROM employee WHERE ?`,
          {
            id: answer.employee_delete.id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("Employee deleted.");

            startQuestions();
          }
        );
      });
  });
}

function updateRole() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.salary, role.title, role.id, department.name as "Department Name"
    FROM employee_db.employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "employeeChoice",
            type: "list",
            choices: function () {
              var choiceArray1 = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray1.push(`${res[i].first_name} ${res[i].last_name}`);
              }
              return choiceArray1;
            },
            message: "Which employee do you want to change?",
          },
        ])
        .then(function (answer) {
          connection.query(
            `SELECT role.title, role.id, role.salary
            FROM employee_db.role`,
            function (err, res4) {
              if (err) throw err;
              inquirer
                .prompt([
                  {
                    name: "roleChoice",
                    type: "list",
                    choices: function () {
                      var choiceArray2 = [];
                      for (var i = 0; i < res4.length; i++) {
                        choiceArray2.push(res4[i].title);
                      }
                      return choiceArray2;
                    },
                    message: "Which role do you want to apply to the employee?",
                  },
                ])
                .then(function (answer2) {
                  console.log(answer);
                  // variables for update
                  var role_id, employeeId;
                  // searching and matching for name
                  connection.query(
                    `SELECT employee.first_name, employee.last_name, employee.id
            FROM employee_db.employee`,
                    function (err, res2) {
                      if (err) throw err;
                      for (var i = 0; i < res2.length; i++) {
                        if (
                          `${res2[i].first_name} ${res2[i].last_name}` ===
                          answer.employeeChoice
                        ) {
                          employeeId = res2[i].id;
                        }
                      }
                      // searching and matching for title
                      connection.query(
                        `SELECT role.title, role.salary, role.id
              FROM employee_db.role`,
                        function (err, res3) {
                          if (err) throw err;
                          for (var i = 0; i < res3.length; i++) {
                            if (`${res3[i].title}` === answer2.roleChoice) {
                              role_id = res3[i].id;
                            }
                          }
                          connection.query(
                            "UPDATE employee SET ? WHERE ?",
                            [
                              {
                                role_id: role_id,
                              },
                              {
                                id: employeeId,
                              },
                            ],
                            function (err) {
                              if (err) throw err;
                              console.log("Employee's role has been changed.");
                              startQuestions();
                            }
                          );
                        }
                      );
                    }
                  );
                });
            }
          );
        });
    }
  );
}