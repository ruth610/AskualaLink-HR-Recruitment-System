const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false,
  },
});

let connected = false;
pool.on('connect', () => {
  console.log('PostgreSQL (Neon) connected');
  connected = true;

});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});


module.exports = pool;