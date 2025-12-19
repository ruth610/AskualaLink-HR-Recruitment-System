import app from './src/app';
import pool from './src/configs/db';

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    return res.status(500).json({ status: 'ERROR', db: 'disconnected' });
  }
});

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});