const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  password: 'jk811002',
  port: 5433,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};