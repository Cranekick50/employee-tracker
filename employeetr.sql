DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- foreign keys not working below
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id),
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ('sales');

INSERT INTO department (name)
VALUES ('accounting');

INSERT INTO role (title, salary, department_id)
VALUES ('salesman', 40000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('accountant', 60000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Srithapin', 1, 0);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Smith', 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Jackson', 1, 1);