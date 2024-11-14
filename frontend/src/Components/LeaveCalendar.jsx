import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

const LeaveCalendar = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    fetchLeaveRequests(); // Fetch leave requests on mount
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/leave-requests");
      const formattedLeaveHistory = response.data.map(request => {
        // Make sure the startDate and endDate are set to midnight
        const startDate = new Date(request.startDate);
        startDate.setHours(0, 0, 0, 0); // Set time to midnight
        
        const endDate = new Date(request.endDate);
        endDate.setHours(0, 0, 0, 0); // Set time to midnight

        return {
          ...request,
          startDate,
          endDate
        };
      });
      setLeaveHistory(formattedLeaveHistory);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  useEffect(() => {
    setLeaveRequests(leaveHistory); // Sync leaveHistory with leaveRequests state
  }, [leaveHistory]); // Only update when leaveHistory changes

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const leaveDates = leaveRequests.map((request) => ({
        start: new Date(request.startDate),
        end: new Date(request.endDate),
      }));

      // Check if any leave request falls on this date, with time comparison set to midnight
      const isLeaveDate = leaveDates.some(
        ({ start, end }) => date >= start && date <= end
      );

      return isLeaveDate ? 'leave-date' : null;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const selectedDateLeaves = leaveRequests.filter(
    (request) =>
      new Date(request.startDate).getTime() <= selectedDate.getTime() &&
      new Date(request.endDate).getTime() >= selectedDate.getTime()
  );

  return (
    <div className="leave-calendar">
      <h2>Employee Leave Calendar</h2>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>

      <div className="leave-details">
        <h3>Leave Details for {selectedDate.toDateString()}</h3>
        {selectedDateLeaves.length === 0 ? (
          <p>No employees are on leave for this date.</p>
        ) : (
          <ul>
            {selectedDateLeaves.map((leave, index) => (
              <li key={index}>
                <strong>{leave.name}</strong> - {leave.leaveType}
                <p>Reason: {leave.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeaveCalendar;
