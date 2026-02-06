/**
 * @param {Object} data
 * @param {number} candidateCount
 */
export const generateSlots = (data, candidateCount) => {
  const slots = [];
  let slotsGenerated = 0;

  const startDay = new Date(data.startDate);
  const endDay = new Date(data.endDate);

  const createDateTime = (dateObj, timeString) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return new Date(`${dateStr}T${timeString}:00`);
  };

  let currentDay = new Date(startDay);

  while (currentDay <= endDay && slotsGenerated < candidateCount) {

    const dayOfWeek = currentDay.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDay.setDate(currentDay.getDate() + 1);
      continue;
    }

    let currentCursor = createDateTime(currentDay, data.dailyStartTime);
    const dayEndLimit = createDateTime(currentDay, data.dailyEndTime);

    while (currentCursor < dayEndLimit && slotsGenerated < candidateCount) {

      const slotEnd = new Date(currentCursor.getTime() + data.slotDurationMinutes * 60000);

      if (slotEnd > dayEndLimit) {
        break;
      }

      slots.push({
        start: new Date(currentCursor),
        end: new Date(slotEnd)
      });
      slotsGenerated++;
      currentCursor = slotEnd;
    }

    currentDay.setDate(currentDay.getDate() + 1);
  }

  if (slotsGenerated < candidateCount) {
    const error = new Error(`Not enough time slots! Needed ${candidateCount}, but could only generate ${slotsGenerated} between ${data.startDate} and ${data.endDate}.`);
    error.statusCode = 400;
    throw error;
  }

  return slots;
};