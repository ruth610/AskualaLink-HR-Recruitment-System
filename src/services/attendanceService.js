import { Attendance } from '../models/attendance.js';
import dotenv from 'dotenv';
dotenv.config();
async function clockIn(userId){
    try {
        const now = new Date();
        const ethiopiaTime = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);

        const getPart = (type) => ethiopiaTime.find(p => p.type === type).value;
        const today = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
        const currentHour = parseInt(getPart('hour'));

        const dayOfWeek = now.getUTCDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { error: 'Clock-in is not allowed on weekends.' };
        }

        const existingRecord = await Attendance.findOne({
            where: { user_id: userId, date: today }
        });

        if (existingRecord && existingRecord.clock_in) {
            return { error: 'You have already clocked in for today.' };
        }

        const startHour = parseInt(process.env.OFFICE_START_HOUR) || 9;
        const status = currentHour < startHour ? 'PRESENT' : 'LATE';

        const record = await Attendance.create({
            user_id: userId,
            date: today,
            clock_in: now,
            status: status
        });

        return record;
    } catch (error) {
        throw new Error('Error during clock-in: ' + error.message);
    }


}
export { clockIn };