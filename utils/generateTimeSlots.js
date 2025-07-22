export const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
  const times = [];
  let currentTime = new Date(startTime);

  let adjustedEndTime = new Date(endTime);
  if (endTime.getHours() < startTime.getHours()) {
    adjustedEndTime.setDate(adjustedEndTime.getDate() + 1);
  }

  while (currentTime <= adjustedEndTime) {
    times.push(new Date(currentTime));
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return times;
};
