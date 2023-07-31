DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- The codes in line 7 through 10 create Table for the Department.
CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(50) NOT NULL,
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE SET NULL
);

-- The line of codes below create table for the employees
CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
FOREIGN KEY (role_id)
REFERENCES roles(id)
On DELETE cascade,
manager_id INT,
FOREIGN KEY (manager_id)
REFERENCES employees(id)
ON DELETE SET NULL
);