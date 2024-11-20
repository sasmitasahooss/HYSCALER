import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Employee = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState();
  const [leaveCounts, setLeaveCounts] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const navigate = useNavigate();
  const secureEmployeeRoute = async () => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/login');
    }
  }

  useEffect(() => {
    secureEmployeeRoute();
    fetchLeaveHistory();
    fetchLeaveBalance();
  }, []);
  const fetchLeaveBalance = async () => {
    const employeeId = localStorage.getItem("employeeId");
    const response = await axios.get(
      `http://localhost:8080/employees/${employeeId}/leave-balance`
    );
    console.log(response)
    const updatedLeaveBalance = response.data.map(
      (leave) => (leave.leaveType, leave.leaveBalance)
    );
    console.log(updatedLeaveBalance)
    const flattenedLeaveRequests = updatedLeaveBalance.flat();
    const leaveTaken = flattenedLeaveRequests.reduce((acc, leave) => {
      if (acc[leave.leaveType]) {
        acc[leave.leaveType] += leave.durationInDays;
      } else {
        acc[leave.leaveType] = leave.durationInDays;
      }
      return acc;
    }, {});
    console.log(leaveTaken)
    setLeaveBalance(leaveTaken);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeId = localStorage.getItem("employeeId");
  
    // Check if employeeId exists
    if (!employeeId) {
      console.error("Employee ID not found in localStorage.");
      return;
    }
  
    // Check if all fields are populated before submission
    if (!leaveType || !startDate || !endDate || !reason) {
      console.error("All fields are required.");
      return;
    }
  

    if (new Date(endDate) < new Date(startDate)) {
      console.error("End date cannot be before start date.");
      setErrorMessage("End date cannot be before start date.");
      setTimeout(()=>setErrorMessage(''),2000);
      return;
    }
    // Check if the leave balance will go negative
    if (leaveType && leaveBalance) {
      const leaveTakenForType = leaveBalance[leaveType] || 0;
      let durationInDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24) + 1; // calculate the leave duration in days
  

if (leaveType && leaveBalance) {
  const leaveTakenForType = leaveBalance[leaveType] || 0; // Default to 0 if undefined
  const maxLeavesAllowed = {
    "Sick Leave": 5,
    "Vacation Leave": 10,
    "Maternity Leave": 90,
    "Paternity Leave": 15,
  };

  const remainingBalance = maxLeavesAllowed[leaveType] - leaveTakenForType;
  if (remainingBalance < durationInDays) {
    setErrorMessage(`Insufficient balance: You only have ${remainingBalance} ${leaveType} days remaining.`);
    setTimeout(() => setErrorMessage(""), 2000); // Clear the message after 3 seconds
    return;
  }
}

      // if (leaveTakenForType + durationInDays > 5 && leaveType === "Sick Leave") {
      //   console.error("You do not have enough Sick Leave balance.");
      //   return;
      // }
      // if (leaveTakenForType + durationInDays > 10 && leaveType === "Vacation Leave") {
      //   console.error("You do not have enough Vacation Leave balance.");
      //   return;
      // }
      // if (leaveTakenForType + durationInDays > 90 && leaveType === "Maternity Leave") {
      //   console.error("You do not have enough Maternity Leave balance.");
      //   return;
      // }
      // if (leaveTakenForType + durationInDays > 15 && leaveType === "Paternity Leave") {
      //   console.error("You do not have enough Paternity Leave balance.");
      //   return;
      // }
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/employees/leave-requests",
        { leaveType, startDate, endDate, reason, employeeId }
      );
      // After submission, fetch leave history and balance
      fetchLeaveHistory();
      fetchLeaveBalance();
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setSuccessMessage("Leave request submitted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };
  const fetchLeaveHistory = async () => {
    const employeeId = localStorage.getItem("employeeId");
    if (employeeId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/employees/${employeeId}/leaveRequests`
        );
        setLeaveHistory(response.data);
      } catch (error) {
        console.error("Error fetching leave history:", error.message);
      }
    } else {
      console.error("Employee ID not found in localStorage.");
    }
  };
  return (
    <>
      <Header />
      {successMessage && (
  <div className="success-message bg-green-500 text-white p-3 rounded-md mb-4">
    {successMessage}
  </div>
)}


      {errorMessage && (
  <div className="error-message bg-red-500 text-white p-3 rounded-md mb-4">
    {errorMessage}
  </div>
)}

      <div className="lform border-2">
        <div className="leave-request-form border-2 rounded-lg border-[#0e2d49] flex flex-col items-center px-10 mt-5">
          <h2 className="text-2xl text-[#0e2d49] mt-10 font-bold">
            Leave Request Form
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-4 mt-10"
          >
            <label
              htmlFor="leave-type"
              className="w-[100%] border-2 rounded-md px-5 border-[#0e2d49] py-2"
            >
              Leave Type:{" "}
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                id="leave-type"
                name="leave-type"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation Leave">Vacation Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            </label>

            <label
              htmlFor="start-date"
              className="w-[100%] border-2 rounded-md px-5 border-[#0e2d49] py-2"
            >
              Start Date:{" "}
              <input
                type="date"
                id="start-date"
                name="start-date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label
              htmlFor="end-date"
              className="w-[100%] border-2 rounded-md px-5 border-[#0e2d49] py-2"
            >
              End Date:{" "}
              <input
                type="date"
                id="end-date"
                name="end-date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>

            <label
              htmlFor="reason"
              className="w-[100%] border-2 rounded-md px-5 flex items-center border-[#0e2d49] py-2"
            >
              Reason:{" "}
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="bg-[#0e2d49] text-white px-5 py-2 rounded-md"
            >
              Apply
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-4 rounded-lg mt-10 md:mt-0">
          <div className="bg-blue-500 p-4 rounded-lg">
            <h3 className="text-white">Sick Leave</h3>
            <p className="text-white">      Balance: {leaveBalance?.["Sick Leave"] !== undefined ? 5 - leaveBalance["Sick Leave"] : 5} days
            </p>
          </div>
          <div className="bg-green-500 p-4 rounded-lg">
            <h3 className="text-white">Vacation Leave</h3>
            <p className="text-white">      Balance: {leaveBalance?.["Vacation Leave"] !== undefined ? 10 - leaveBalance["Vacation Leave"] : 10} days
            </p>
          </div>
          <div className="bg-yellow-500 p-4 rounded-lg">
            <h3 className="text-white">Maternity Leave</h3>
            <p className="text-white">      Balance: {leaveBalance?.["Maternity Leave"] !== undefined ? 90 - leaveBalance["Maternity Leave"] : 90} days
            </p>
          </div>
          <div className="bg-red-500 p-4 rounded-lg">
            <h3 className="text-white">Paternity Leave</h3>
            <p className="text-white">Balance: {leaveBalance?.["Paternity Leave"] !== undefined ? 15 - leaveBalance["Paternity Leave"] : 15} days</p>
          </div>
        </div>
      </div>
      <div className="leave-history mt-10 w-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Leave History</h2>
        {leaveHistory.length > 0 ? (
          <table className="history-list border-2 rounded-md border-[#0e2d49] w-[80vw]">
            <thead>
              <tr className="border-b-2 bg-[#5ec5d4] border-[#0e2d49]">
                <th className="border-r-2 border-[#0e2d49]">Leave Type</th>
                <th className="border-r-2 border-[#0e2d49]">Reason</th>
                <th className="border-r-2 border-[#0e2d49]">Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((request, index) => (
                <tr key={index}>
                  <td>{request.leaveType}</td>
                  <td>{request.reason}</td>
                  <td>
                    {new Date(request.startDate).toLocaleDateString()} -{" "}
                    {new Date(request.endDate).toLocaleDateString()}
                  </td>
                  <td>{request.status ? request.status : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-black">
            You have not taken any leaves yet
          </div>
        )}
      </div>
    </>
  );
};

export default Employee;
