const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const viewQueries = require("./helpers/view-qs");
const addQueries = require("./helpers/add-qs");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "kaneki",
    database: "employee_db",
  },
  console.log(`You are now connected to the employee database.`)
);

// Created these 3 const/functions to access department, role, and manager lists for the inquirer prompts.
const dept = async () => {
  let deptArray = [];

  return new Promise((resolve) => {
    let sql = `SELECT name AS name, id AS value FROM departments`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        return;
      } else {
        let rowCount = 0;
        for (let i = rowCount; i < rows.length; i++) {
          let deptNames = {
            name: rows[i].name,
            value: rows[i].value,
          };
          rowCount++;
          deptArray.push(deptNames);
        }
      }
    });
    resolve(deptArray);
  });
};

const role = async () => {
  let roleArray = [];

  return new Promise((resolve) => {
    let sql = `SELECT title, id FROM roles`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        return;
      } else {
        let rowCount = 0;
        for (let i = rowCount; i < rows.length; i++) {
          let roleNames = {
            name: rows[i].title,
            value: rows[i].id,
          };
          rowCount++;
          roleArray.push(roleNames);
        }
      }
    });
    resolve(roleArray);
  });
};

const manager = async () => {
  let managerArray = [];

  return new Promise((resolve) => {
    let sql = `Select id, CONCAT(first_name, " ", last_name) AS managerName FROM employees`;
    db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        return;
      } else {
        let rowCount = 0;
        for (let i = rowCount; i < rows.length; i++) {
          let newEmployee = {
            name: rows[i].managerName,
            value: rows[i].id,
          };
          rowCount++;
          managerArray.push(newEmployee);
        }
        let nullValue = null;
        let noManager = {
          name: "No Manager",
          value: nullValue,
        };
        managerArray.push(noManager);
      }
    });
    resolve(managerArray);
  });
};

const startInquirer = async () => {
  let deptList = await dept();
  let roleList = await role();
  let managerList = await manager();

  inquirer
    .prompt([
      {
        type: "list",
        name: "userInput",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update employee role",
          "Exit out",
        ],
      },
      {
        type: "input",
        name: "departmentName",
        message: "Name of the department",
        when: (answer) => answer.userInput === "Add a department",
        validate(value) {
          if (value.length) {
            return true;
          }
          return "Please enter the name of the department.";
        },
      },
      {
        type: "input",
        name: "roleName",
        message: "Name of the role",
        when: (answer) => answer.userInput === "Add a role",
        validate(value) {
          if (value.length) {
            return true;
          }
          return "Please enter the name of the role.";
        },
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role?",
        when: (answer) => answer.userInput === "Add a role",
        validate(value) {
          if (value.length) {
            return true;
          }
          return "Please enter the salary for this role";
        },
      },
      // This is where the first List came in, by grabbing an array of the departments I was able to list those as the choices for this prompt.
      {
        type: "list",
        message: "What department is this role assigned to?",
        name: "roleDepartment",
        choices: deptList,
        when: (answer) => answer.userInput === "Add a role",
      },
      {
        type: "input",
        name: "employeeFirstName",
        message: "Enter the first name of the employee",
        when: (answer) => answer.userInput === "Add an employee",
        validate(value) {
          if (value.length) {
            return true;
          }
          return "Please enter the first name of the employee.";
        },
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "Enter the last name of the employee",
        when: (answer) => answer.userInput === "Add an employee",
        validate(value) {
          if (value.length) {
            return true;
          }
          return "Please enter the last name of the employee.";
        },
      },
      {
        type: "list",
        message: "What is this employees role?",
        name: "employeeRole",
        choices: roleList,
        when: (answer) => answer.userInput === "Add an employee",
      },
      {
        type: "list",
        message: "Who is this employees manager?",
        name: "employeeManager",
        choices: managerList,
        when: (answer) => answer.userInput === "Add an employee",
      },
      {
        type: "list",
        message: "Which employee do you want to update?",
        name: "chosenEmp",
        choices: managerList,
        // I had to fix this one cause I was following the previous prompt and put 'Update an employee' instead of how I had the userInput listed above.
        when: (answer) => answer.userInput === "Update employee role",
      },
      {
        type: "list",
        message: "What is the new role to be assigned?",
        name: "chosenEmpRoleUpdate",
        choices: roleList,
        when: (answer) => answer.userInput === "Update employee role",
      },
    ])
    .then((answer) => {
      // I initially tried to do if/else statements for the .then(answer), but struggled with the functionality.
      // Then a friend reminded me of the switch/case statements and it just worked much better.
      let sql = "";
      let showTable = true;
      // Switch statement will take the userInput as the parameter and the case will return results based off of the chosen answer.
      switch (answer.userInput) {
        case "View all departments":
          sql = viewQueries.viewAllDepartments();
          break;
        case "Add a department":
          let newDept = answer.departmentName;
          sql = addQueries.newDepartment(newDept);
          console.log(`Added ${newDept} to the database!`);
          showTable = false;
          break;
        case "View all roles":
          sql = viewQueries.viewAllRoles();
          break;
        case "Add a role":
          let newRole = answer.roleName;
          let roleSalary = answer.roleSalary;
          let roleDepartment = answer.roleDepartment;
          sql = addQueries.newRole(newRole, roleSalary, roleDepartment);
          console.log(`Added ${newRole} to the database!`);
          showTable = false;
          break;
        case "View all employees":
          sql = viewQueries.viewAllEmployees();
          break;
        case "Add an employee":
          let empFirstName = answer.employeeFirstName;
          let empLastName = answer.employeeLastName;
          let empRole = answer.employeeRole;
          let empsMan = answer.employeeManager;
          sql = addQueries.newEmployee(
            empFirstName,
            empLastName,
            empRole,
            empsMan
          );
          console.log(`Added ${empFirstName} ${empLastName} to the database!`);
          showTable = false;
          break;
        case "Update employee role":
          let selectedEmp = answer.chosenEmp;
          let updateEmpRole = answer.chosenEmpRoleUpdate;
          sql = addQueries.updateEmp(selectedEmp, updateEmpRole);
          console.log(`Updated employee in database`);
          showTable = false;
          break;
        case "Exit out":
          console.log("Thanks for using this employee tracker.");
          process.exit();
        default:
          console.log("Error - nothing selected.");
          break;
      }
      if (sql === "") {
        startInquirer();
      } else {
        db.query(sql, (err, rows) => {
          if (err) {
            console.log("error");
            return;
          } else {
            if (showTable) {
              console.table(rows);
            }
            startInquirer();
          }
        });
      }
    });
};

app.use((req, res) => {
  res.status(404).end;
});
startInquirer();
