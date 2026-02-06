/**
 * @param {number} year
 * @param {number} month
 * @returns {number}
 */
function calculateWorkingDays(year, month) {
  let workingDays = 0;

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}

/**
 * @param {number} basicSalary
 * @param {number} taxableAllowances
 */
const calculatePayroll = (basicSalary, taxableAllowances = 0) => {
  const salary = parseFloat(basicSalary);
  const allowances = parseFloat(taxableAllowances);
  const grossPay = salary + allowances;

  const pension = salary * 0.07;

  const taxableIncome = grossPay - pension;

  let incomeTax = 0;
  if (taxableIncome <= 600) {
    incomeTax = 0;
  } else if (taxableIncome <= 1650) {
    incomeTax = (taxableIncome * 0.10) - 60;
  } else if (taxableIncome <= 3200) {
    incomeTax = (taxableIncome * 0.15) - 142.50;
  } else if (taxableIncome <= 5250) {
    incomeTax = (taxableIncome * 0.20) - 302.50;
  } else if (taxableIncome <= 7800) {
    incomeTax = (taxableIncome * 0.25) - 565;
  } else if (taxableIncome <= 10900) {
    incomeTax = (taxableIncome * 0.30) - 955;
  } else {
    incomeTax = (taxableIncome * 0.35) - 1500;
  }

  const totalDeductions = pension + incomeTax;
  const netPay = grossPay - totalDeductions;

  return {
    base_salary: salary.toFixed(2),
    gross_pay: grossPay.toFixed(2),
    pension: pension.toFixed(2),
    taxable_income: taxableIncome.toFixed(2),
    income_tax: incomeTax.toFixed(2),
    total_deductions: totalDeductions.toFixed(2),
    net_pay: netPay.toFixed(2)
  };

};

export { calculateWorkingDays, calculatePayroll };