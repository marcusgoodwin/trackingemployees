-- Creating a new database called employee_db
CREATE DATABASE IF NOT EXISTS employee_db;

-- Switching to the newly created database
USE employee_db;

-- Creating a table named departments with id as primary key and name as a non-null string
CREATE TABLE IF NOT EXISTS departments (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL
);

-- Creating a table named roles with id as primary key, title as a non-null string, salary as a decimal, and department_id as a foreign key reference to departments table
CREATE TABLE IF NOT EXISTS roles (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(13,2),
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Creating a table named employees with id as primary key, first_name and last_name as non-null strings, role_id and manager_id as foreign key references to roles and employees table respectively.
CREATE TABLE IF NOT EXISTS employees (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
FOREIGN KEY (manager_id) REFERENCES employees(id)
);