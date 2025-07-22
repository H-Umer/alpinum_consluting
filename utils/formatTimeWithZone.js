export const formatTimeWithZone = (timeString, zoneString) => {
  if (!timeString || !zoneString) return "";

  try {
    // Create today's date with the time from timeString
    const today = new Date();
    const [hours, minutes] = timeString.split(":");

    // Set the time components
    today.setHours(parseInt(hours, 10));
    today.setMinutes(parseInt(minutes, 10));
    today.setSeconds(0);

    // Format to 12-hour time
    const formattedTime = today.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  } catch (error) {
    console.error("Time formatting error:", error);
    return "Invalid time";
  }
};
