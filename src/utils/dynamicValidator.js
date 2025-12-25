export const validateJobAnswers = (jobCustomFields, applicantAnswers) => {
    const errors = [];

    if (!jobCustomFields || jobCustomFields.length === 0) return true;

    if (!applicantAnswers) {
        return ["This job requires additional answers, but none were provided."];
    }
    console.log(applicantAnswers);
    jobCustomFields.forEach(field => {
        // console.log(field.key);
        console.log(applicantAnswers[field.key]);
        const fieldValue = applicantAnswers[field.key];
        if (field.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
            errors.push(`Missing required field: ${field.label}`);
            return;
        }

        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            if (field.type === 'number' && typeof fieldValue !== 'number') {
                errors.push(`${field.label} must be a number`);
            }
        }
    });

    return errors.length > 0 ? errors : null;
};