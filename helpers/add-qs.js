const newDepartment = deptName => `INSERT INTO departments (name) VALUES ('${deptName}')`;

const newRole = (title, salary, dept) => {
  let salaryAmount = Number(salary);
  let deptId = Number(dept);
  let sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salaryAmount}', '${deptId}')`;
  return sql;
};

const newEmployee = (firstName, lastName, role, manager) => {
  let role_id = Number(role);
  if (manager) {
    const manager_id = Number(manager);
    let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${role_id}, ${manager_id})`;
    return sql;
  } else {
    let sql = `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${firstName}', '${lastName}', ${role_id})`;
    return sql;
  }
};

const updateEmp = (empId, roleId) => {
  let employee_id = Number(empId);
  let role_id = Number(roleId);
  let sql = `UPDATE employees SET role_id = ${role_id} WHERE id = ${employee_id}`;
  return sql;
};

module.exports = { newDepartment, newRole, newEmployee, updateEmp };
