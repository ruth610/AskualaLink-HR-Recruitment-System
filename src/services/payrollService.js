import db from '../models/index.js';
import { decrypt } from '../utils/crypto.js';
import { calculatePayroll, calculateWorkingDays } from '../utils/payrollFunctions.js';

const {Payroll, User} = db;

async function generatePayroll(userId, month, year) {
    try {
        const now = new Date();

        const yearValue = year || now.getUTCFullYear();
        const monthValue = month || now.getUTCMonth() + 1;

        const monthKey = `${yearValue}-${String(monthValue).padStart(2, '0')}`;

        const existing = await Payroll.findOne({ where: { user_id: userId, month: monthKey } });
        if (existing) {
            return res.status(400).json({ message: 'Payroll already generated for this month' });
        }

        const user = await User.findByPk(userId);
        if (!user || !user.salary) {
            return res.status(404).json({ message: 'User or salary not found' });
        }
        const fullBaseSalary = Number(decrypt(user.salary));

        const workingDays = calculateWorkingDays(yearValue, monthValue);

        const lastDayOfMonth = new Date(yearValue, monthValue, 0).getDate();
        const lateDays = await Attendance.count({
            where: {
            user_id: userId,
            status: ['LATE', 'LATE_AND_UNDER_TIME'],
            date: {
                [Op.between]: [
                `${monthKey}-01`,
                `${monthKey}-${lastDayOfMonth}`
                ]
            }
            }
        });
        const adjustedLateDays = Math.floor(lateDays / 2);


        const presentDays = await Attendance.count({
            where: {
            user_id: userId,
            status: ['PRESENT', 'PRESENT_BUT_UNDER_TIME'],
            date: {
                [Op.between]: [
                `${monthKey}-01`,
                `${monthKey}-${lastDayOfMonth}`
                ]
            }
            }
        });

        // remember Paid Leave
        let payableGross = fullBaseSalary;
        const totalPresent = presentDays - adjustedLateDays;
        if (totalPresent < workingDays) {
            const dailyRate = fullBaseSalary / workingDays;
            payableGross = dailyRate * totalPresent;
        }

        const salaryDetails = calculatePayroll(payableGross, 0);

        const payroll = await Payroll.create({
            user_id: userId,
            month: monthKey,

            base_salary: salaryDetails.base_salary,
            total_allowance: salaryDetails.total_allowance,
            gross_pay: salaryDetails.gross_pay,
            taxable_income: salaryDetails.taxable_income,
            income_tax: salaryDetails.income_tax,
            pension: salaryDetails.pension,
            total_deductions: salaryDetails.total_deductions,
            net_pay: salaryDetails.net_pay,

            working_days: workingDays,
            present_days: totalPresent,
            status: 'DRAFT',
            generated_by: req.user.id
        });

        return res.json({
            message: 'Payroll generated successfully',
            payroll: payroll
        });
    } catch (error) {
        return { error: error.message, statusCode: 500 };
    }
}

export { generatePayroll };