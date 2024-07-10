const inquirer = require('inquirer');
const db = require('./db');

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Department Budget',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View Employees by Manager':
                viewEmployeesByManager();
                break;
            case 'View Employees by Department':
                viewEmployeesByDepartment();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'View Department Budget':
                viewDepartmentBudget();
                break;
            default:
                db.pool.end();
        }
    });
};

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewAllRoles = () => {
    db.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        }
    ]).then(answer => {
        db.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) {
                if (err.code === '23505') {
                    console.log('Error: Department already exists.');
                } else {
                    console.error('Error:', err);
                }
                mainMenu();
            } else {
                console.log('Department added!');
                mainMenu();
            }
        });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department ID of the role?',
        }
    ]).then(answer => {
        db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id], (err, res) => {
            if (err) {
                if (err.code === '23505') {
                    console.log('Error: Role already exists.');
                } else {
                    console.error('Error:', err);
                }
                mainMenu();
            } else {
                console.log('Role added!');
                mainMenu();
            }
        });
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role ID of the employee?',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager ID of the employee (if any)?',
        }
    ]).then(answer => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id || null], (err, res) => {
            if (err) {
                if (err.code === '23505') {
                    console.log('Error: Employee already exists.');
                } else {
                    console.error('Error:', err);
                }
                mainMenu();
            } else {
                console.log('Employee added!');
                mainMenu();
            }
        });
    });
};

const updateEmployeeRole = () => {
    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employees
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'Enter the new role ID:'
            }
        ]).then(answer => {
            db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee role updated!');
                mainMenu();
            });
        });
    });
};

const updateEmployeeManager = () => {
    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update their manager:',
                choices: employees
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the new manager:',
                choices: employees
            }
        ]).then(answer => {
            db.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answer.manager_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee manager updated!');
                mainMenu();
            });
        });
    });
};

const viewEmployeesByManager = () => {
    db.query('SELECT e1.id, e1.first_name, e1.last_name, e2.first_name AS manager_first_name, e2.last_name AS manager_last_name FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.id', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewEmployeesByDepartment = () => {
    db.query('SELECT e.id, e.first_name, e.last_name, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const deleteDepartment = () => {
    db.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department to delete:',
                choices: departments
            }
        ]).then(answer => {
            db.query('DELETE FROM department WHERE id = $1', [answer.department_id], (err, res) => {
                if (err) throw err;
                console.log('Department deleted!');
                mainMenu();
            });
        });
    });
};

const deleteRole = () => {
    db.query('SELECT id, title FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role to delete:',
                choices: roles
            }
        ]).then(answer => {
            db.query('DELETE FROM role WHERE id = $1', [answer.role_id], (err, res) => {
                if (err) throw err;
                console.log('Role deleted!');
                mainMenu();
            });
        });
    });
};

const deleteEmployee = () => {
    db.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to delete:',
                choices: employees
            }
        ]).then(answer => {
            db.query('DELETE FROM employee WHERE id = $1', [answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee deleted!');
                mainMenu();
            });
        });
    });
};

const viewDepartmentBudget = () => {
    db.query('SELECT d.name AS department, SUM(r.salary) AS utilized_budget FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id GROUP BY d.name', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

mainMenu();