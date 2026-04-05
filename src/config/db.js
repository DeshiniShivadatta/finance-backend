const { Pool } = require('pg');
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL); // add this line

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch((err) => console.error('DB connection error:', JSON.stringify(err, null, 2)));

module.exports = pool;