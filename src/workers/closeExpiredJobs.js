import cron from 'node-cron';
import { Op } from 'sequelize';
import db from '../models/index.js';

const { Job } = db;
// console.log('checking for the expired job');

cron.schedule('0 * * * *', async () => {
  console.log('⏰ Checking for expired jobs...');

  try {
    const now = new Date();

    const expiredJobs = await Job.findAll({
      where: {
        deadline: { [Op.lt]: now },
        status: 'OPEN',
      },
      attributes: ['id', 'title', 'deadline', 'status'],
    });

    console.log(`🔍 Found ${expiredJobs.length} expired OPEN jobs`);

    expiredJobs.forEach(job => {
      console.log(
        `→ Job ${job.id} | ${job.title} | deadline=${job.deadline}`
      );
    });

    const [updatedCount] = await Job.update(
      { status: 'CLOSED' },
      {
        where: {
          deadline: { [Op.lt]: now },
          status: 'OPEN',
        },
      }
    );

    console.log(`Closed ${updatedCount} jobs`);
  } catch (error) {
    console.error('Failed to close expired jobs:', error);
  }
});
