import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import LeaveCalendar from "../Components/LeaveCalendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const fetchLeaveRequests = async () => {
    const response = await axios.get(
      "http://localhost:8080/admin/leave-requests"
    );
    setLeaveRequests(response.data);
  };
  const handleApprove = async (employeeId, id) => {
    console.log(employeeId, id);
    const response = await axios.post(
      `http://localhost:8080/admin/approve-leave/${employeeId}/${id}`
    );
    fetchLeaveRequests();
  };
  const handleReject = async (employeeId, id) => {
    const response = await axios.post(
      `http://localhost:8080/admin/reject-leave/${employeeId}/${id}`
    );
    fetchLeaveRequests();
  };
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const navigate = useNavigate();
  const secureAdminRoute = async () => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/login');
    }
    const data = await axios.get('http://localhost:8080/admin', {
      headers: {
        'x-auth-token': token
      }
    });
    if(!data.data.message) {
      navigate('/login');
    }
  };
  useEffect(() => {
    secureAdminRoute();
  }, []);


  return (
    <>
      <Header />
      <div className="leave-request-list mt-10 w-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Leave Request List</h2>
        <table className="request-list border-2 rounded-md border-[#0e2d49] ">
          <thead>
            <tr className="border-b-2 bg-[#5ec5d4] border-[#0e2d49]">
              <th className="border-r-2 border-[#0e2d49]">Employee ID</th>
              <th className="border-r-2 border-[#0e2d49]">Employee Name</th>
              <th className="border-r-2 border-[#0e2d49]">Leave Type</th>
              <th className="border-r-2 border-[#0e2d49]">Start Date</th>
              <th className="border-r-2 border-[#0e2d49]">End Date</th>
              <th className="border-r-2 border-[#0e2d49]">Reason</th>
              <th className="border-r-2 border-[#0e2d49]">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request, index) => (
              <tr
                key={index}
                className="request-item border-b-2 border-[#0e2d49]"
              >
                <td className="border-r-2 border-[#0e2d49]">
                  {request.createdBy}
                </td>
                <td className="border-r-2 border-[#0e2d49]">{request.name}</td>
                <td className="border-r-2 border-[#0e2d49]">
                  {request.leaveType}
                </td>
                <td className="border-r-2 border-[#0e2d49]">
                  {new Date(request.startDate).toLocaleDateString()}
                </td>
                <td className="border-r-2 border-[#0e2d49]">
                  {new Date(request.endDate).toLocaleDateString() }
                </td>
                <td className="border-r-2 border-[#0e2d49]">
                  {request.reason}
                </td>
                <td className="border-r-2 border-[#0e2d49]">
                  {request.status}
                </td>
                {request.status === "pending" ? (
                  <td>
                    <button
                      onClick={() => handleApprove(request.createdBy, request._id)} className="bg-green-500 text-white px-4 py-2 rounded-md">
                      Approve
                    </button>
                    <button onClick={() => handleReject(request.createdBy, request._id)} className="bg-red-500 text-white px-4 py-2 rounded-md ml-4">
                      Reject
                    </button>
                  </td>
                ) : (
                  <td>
                    <span>{request.status}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LeaveCalendar />
    </>
  );
};

export default Admin;
