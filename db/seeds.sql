USE employee_db;

INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Search Marketing");
INSERT INTO department (name) VALUES ("Information Technology");
INSERT INTO department (name) VALUES ("Web Development");

INSERT INTO role (title, salary, department_id) VALUES ("Web Analyst", 40, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Account Manager", 70, 5);
INSERT INTO role (title, salary, department_id) VALUES ("Search Manager", 70, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Search Director", 100, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Account Director", 100, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("John", "Doe", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Jane", "Doe", 5);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Robert", "Plant", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Jimi", "Page", 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("John Paul", "Jones", 3);