import * as attendanceService from '../services/attendanceService.js';
import { StatusCodes } from 'http-status-codes';

async function clockIn(req, res) {
    try {
        const userId = req.user.id;
        const result = await attendanceService.clockIn(userId);
        if(result.error){
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.error });
        }
        return res.status(StatusCodes.OK).json({ message: 'Clock-in successful', data: result });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

export { clockIn };