import React, { useState } from "react";
import { Calendar } from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";

const BookingCalendar = ({ user, handleBooking }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const parseTimeWithAvailability = (timeStr) => {
    if (!timeStr || !user?.contractorProfile?.availability) return null;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const datePart = new Date(user.contractorProfile.availability)
      .toISOString()
      .split("T")[0]; // e.g. 2025-06-30
    const dateTimeStr = `${datePart}T${timeStr}${user.contractorProfile.availabilityZone}`;
    return new Date(dateTimeStr);
  };

  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const allowedDays =
    user?.contractorProfile?.availabilityDays.length > 0
      ? user?.contractorProfile?.availabilityDays
      : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  if (!allowedDays || allowedDays.length === 0) {
    return (
      <div className="text-red-500 text-lg mt-4">
        This contractor has not set any availability days.
      </div>
    );
  }

  const allowedDayIndexes = allowedDays.map((day) => weekdayMap[day]);

  // Utility: generate reserved weekend dates
  const getWeekendBlocks = (start, end) => {
    const result = [];
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (!allowedDayIndexes.includes(day)) {
        const weekendDate = new Date(current);
        result.push({
          startDate: new Date(weekendDate.setHours(0, 0, 0, 0)),
          endDate: new Date(weekendDate.setHours(23, 59, 59, 999)),
        });
      }
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  const availableStart = parseTimeWithAvailability(
    user?.contractorProfile?.startTime
  );
  const availableEnd = parseTimeWithAvailability(
    user?.contractorProfile?.endTime
  );

  const calendarStart = new Date("2025-06-01");
  const calendarEnd = new Date("2025-07-31");

  // Mark everything outside the availability range as reserved (unselectable)
  const reserved = [
    {
      startDate: calendarStart,
      endDate: new Date(availableStart?.getTime() - 1),
    },
    {
      startDate: new Date(availableEnd?.getTime() + 1),
      endDate: calendarEnd,
    },
    ...getWeekendBlocks(calendarStart, calendarEnd),
  ];

  const handleChange = (dates) => {
    setSelectedDates(dates);
    if (dates.length > 1) {
      handleBooking(dates[0]);
    }
  };

  return (
    <>
      <Calendar
        selected={selectedDates}
        reserved={reserved}
        onChange={handleChange}
      />
    </>
  );
};

export default BookingCalendar;
