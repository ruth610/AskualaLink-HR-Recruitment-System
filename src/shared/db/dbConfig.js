const express = require('express');
const router = express.Router();
const db = require('../../shared/db/db');

router.get('/db', async (req, res) => {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'HR', 'INTERN')),
      is_active BOOLEAN DEFAULT true,
      last_login_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createUserTableQuery);
    return res.json({ success: true, message: 'Users table created or already exists.' });
  } catch (error) {
    console.error('Error during installation:', error);
    return res.status(500).json({ success: false, message: 'Installation failed', error: error.message });
  }
});

module.exports = router;
