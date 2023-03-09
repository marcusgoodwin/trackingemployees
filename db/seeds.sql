-- Inserting department data
INSERT INTO departments (name)
VALUES
("Human Resources"),
("Sales"),
("Engineering");

-- Inserting role data
INSERT INTO roles (title, salary, department_id)
VALUES
("HR Manager", 250000, 1),
("Finance", 127000, 1),
("Frontend Engineer", 80000, 3),
("Sales Manager", 176400, 2),
("Sales Rep", 95000, 2),
("Backend Engineer", 210000, 3),
("Full Stack Engineer", 156000, 3);

-- Inserting employee data
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Goodwin", "Marcus", 1, null),
("Parker", "Payton", 2, 1),
("Merrill", "Spencer", 3, null),
("Edward", "Kaneki", 4, null),
("Brian", "Ryo", 5, 4),
("John", "Schmitt", 6, null),
("The", "Joe", 7, 3);
