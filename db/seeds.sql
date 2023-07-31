-- Core Departments in an Organization
INSERT INTO department
    (id, name)
VALUES
    (1, 'Customer Service'),
    (2, 'Marketing'),
    (3, 'Human Resources'),
    (4, 'Operations Management'),
    (5, 'Accounting');

-- Employees' roles including their ids, titles, salaries, and department ids.
INSERT INTO roles
    (id, title, salary, department_id)
VALUES
    (1, 'Customer Service Manager', 120000, 1),
    (2, 'Marketing Director', 140000, 2),
    (3, 'Director of Human Resources', 115000, 3),
    (5, 'Chief Operating Officer', 205000, 5),
    (6, 'Chief Accountant', 185000, 6),
    (7, 'Sales Manager', 182000, 2),
    (8, 'Production Manager', 112000, 4),
    (9, 'Employee Relations Manager', 95000, 3);


-- Names of Employees
INSERT INTO employees
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Charles', 'Williams', 1, NULL),
    (2, 'Mason', 'Gibson', 2, 1),
    (3, 'Victoria', 'Jackson', 3, 1),
    (4, 'Anthony', 'Goodluck', 4, 3),
    (5, 'Patrick', 'Peter', 5, 4),
    (6, 'Karen', 'Jones', 6, 4);