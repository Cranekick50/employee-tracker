function addEmployee() {
    connection.query("SELECT role.title, role.id FROM employee_trackerDB.role", function (
        err,
        res
      ) {
        if (err) throw err;
        inquirer
          .prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the first name?",
              },
              {
                name: "last_name",
                type: "input",
                message: "What is the last name?",
              },
            {
              name: "choice",
              type: "list",
              choices: function () {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].title);
                }
                return choiceArray;
              },
              message: "Which Role?",
            },
          ])
          .then(function (answer) {
            console.log(answer);
            console.log(answer.choice);
            var role_id = answer.choice;
            for (var i = 0; i < res.length; i++) {
              if (res[i].title === answer.choice) {
                role_id = res[i].id;
                console.log(role_id);
              }
            }
            connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: answer.first_name,
                  last_name: answer.last_name,
                  role_id: role_id,
                },
                function (err) {
                  if (err) throw err;
                  questions();
                }
              );
          });
      });
}