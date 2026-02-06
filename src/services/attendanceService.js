import { Attendance } from '../models/attendance.js';
import dotenv from 'dotenv';
dotenv.config();

async function clockIn(userId) {
    try {
        if (!userId) {
            const error = new Error('User ID is required for clock-in.');
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();

        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            weekday: 'short',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const getPart = (type) => parts.find(p => p.type === type).value;

        const today = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
        const currentHour = parseInt(getPart('hour'));
        const currentMinute = parseInt(getPart('minute'));
        const weekday = getPart('weekday');

        if (weekday === 'Sun' || weekday === 'Sat') {
            const error = new Error('Clock-in is not allowed on weekends.');
            error.statusCode = 400;
            throw error;
        }

        const existingRecord = await Attendance.findOne({
            where: { user_id: userId, date: today }
        });

        if (existingRecord && existingRecord.clock_in) {
            const error = new Error('You have already clocked in for today.');
            error.statusCode = 400;
            throw error;
        }

        const startHour = parseInt(process.env.OFFICE_START_HOUR) || 9;
        const graceMinutes = 15;

        let status;
        if (currentHour < startHour || (currentHour === startHour && currentMinute <= graceMinutes)) {
            status = 'PRESENT_BUT_INCOMPLETE';
        } else {
            status = 'LATE_BUT_INCOMPLETE';
        }

        const record = await Attendance.create({
            user_id: userId,
            date: today,
            clock_in: now,
            status: status
        });

        return record;

    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        throw error;
    }
}

async function clockOut(userId) {
    try {
        if (!userId) {
            const error = new Error('User ID is required for clock-out.');
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();

        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Addis_Ababa',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const getPart = (type) => parts.find(p => p.type === type).value;
        const today = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;

        const record = await Attendance.findOne({
            where: { user_id: userId, date: today }
        });

        if (!record || !record.clock_in) {
            const error = new Error('You must clock in before clocking out.');
            error.statusCode = 400;
            throw error;
        }

        if (record.clock_out) {
            const error = new Error('You have already clocked out for today.');
            error.statusCode = 400;
            throw error;
        }

        const endHour = parseInt(process.env.OFFICE_END_HOUR) || 17; // 5 PM
        const graceMinutes = 10;

        const startTime = new Date(record.clock_in);
        const hoursWorked = (now - startTime) / (1000 * 60 * 60);

        const currentHour = parseInt(getPart('hour'));
        const currentMinute = parseInt(getPart('minute'));

        let finalStatus = record.status;

        const isAfterGraceThreshold = (currentHour === endHour - 1 && currentMinute >= (60 - graceMinutes));
        const isAfterEndHour = currentHour >= endHour;

        if (isAfterEndHour || isAfterGraceThreshold) {

            if (finalStatus === 'LATE_BUT_INCOMPLETE') {
                finalStatus = 'LATE';
            } else if (finalStatus === 'PRESENT_BUT_INCOMPLETE') {
                finalStatus = 'PRESENT';
            }
        }
        else if (hoursWorked < 4) {
            finalStatus = 'ABSENT';
        }
        else {
            if (finalStatus === 'PRESENT_BUT_INCOMPLETE') {
                finalStatus = 'PRESENT_BUT_UNDER_TIME';
            } else if (finalStatus === 'LATE_BUT_INCOMPLETE') {
                finalStatus = 'LATE_AND_UNDER_TIME';
            }
        }

        record.status = finalStatus;
        record.clock_out = now;
        await record.save();

        return record;

    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        throw error;
    }
}

export { clockIn, clockOut };