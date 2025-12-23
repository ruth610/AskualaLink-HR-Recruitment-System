import app from './src/app.js';
import db from './src/models/index.js';
import './src/workers/closeExpiredJobs.js';

const sequelize = db.sequelize;

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    return res.status(500).json({ status: 'ERROR', db: 'disconnected' });
  }
});

app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});