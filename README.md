# Employee Tracker

## Description

The Employee Tracker is a command-line application designed to manage a company's employee database using Node.js, Inquirer, and PostgreSQL. This Content Management System (CMS) allows non-developers to easily view and interact with information stored in the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Features](#features)
- [Bonus Features](#bonus-features)
- [Walkthrough Video](#walkthrough-video)
- [Credits](#credits)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/jerrietkuo/employee-tracker.git
    ```
2. Navigate to the project directory:
    ```sh
    cd employee-tracker
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Ensure you have PostgreSQL installed and running on your machine.
2. Create a PostgreSQL database and configure the connection in the `db` module.
3. Run the application:
    ```sh
    node index.js
    ```
4. Follow the prompts to view and manage departments, roles, and employees.

## Database Schema

The database schema includes three tables: `department`, `role`, and `employee`.

- **department**:
    - `id` (SERIAL PRIMARY KEY)
    - `name` (VARCHAR(30) UNIQUE)

- **role**:
    - `id` (SERIAL PRIMARY KEY)
    - `title` (VARCHAR(30))
    - `salary` (DECIMAL)
    - `department_id` (INTEGER REFERENCES department(id))

- **employee**:
    - `id` (SERIAL PRIMARY KEY)
    - `first_name` (VARCHAR(30))
    - `last_name` (VARCHAR(30))
    - `role_id` (INTEGER REFERENCES role(id))
    - `manager_id` (INTEGER REFERENCES employee(id))

## Features

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee's role

## Bonus Features

- Update employee managers
- View employees by manager
- View employees by department
- Delete departments, roles, and employees
- View the total utilized budget of a department (combined salaries of all employees in that department)

## Walkthrough Video

A walkthrough video demonstrating the functionality of the application can be found [here](./Assets/challenge12demo.webm).

## Credits

- [Your Name](https://github.com/jerrietkuo)

## License

This project is licensed under the MIT License.