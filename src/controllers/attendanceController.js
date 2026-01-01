import { error } from 'console';
import * as attendanceService from '../services/attendanceService.js';
import { StatusCodes } from 'http-status-codes';

async function clockIn(req, res) {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ID is required for clock-in.' });
        }
        const result = await attendanceService.clockIn(userId);
        if(result.error){
            return res.status(error.statusCode).json({ message: result.error });
        }
        return res.status(StatusCodes.OK).json({ message: 'Clock-in successful', data: result });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}
async function clockOut(req,res){
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ID is required for clock-out.' });
        }
        const result = await attendanceService.clockOut(userId);
        if(result.error){
            return res.status(error.statusCode).json({ message: result.error });
        }
        return res.status(StatusCodes.OK).json({ message: 'Clock-out successful', data: result });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

export { clockIn, clockOut };