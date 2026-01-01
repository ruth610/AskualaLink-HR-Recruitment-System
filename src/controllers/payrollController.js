import * as payrollService from '../services/payrollService.js';
import { StatusCodes } from 'http-status-codes';

async function generatePayroll(req, res) {
    try {
        const { userId, month, year } = req.params;

        if (!userId || !month || !year) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User ID, month, and year are required to generate payroll.' });
        }

        const result = await payrollService.generatePayroll(userId, month, year);
        if (result.error) {
            return res.status(result.statusCode || StatusCodes.BAD_REQUEST).json({ message: result.error });
        }

        return res.status(StatusCodes.OK).json({ message: 'Payroll generated successfully', data: result });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export { generatePayroll };