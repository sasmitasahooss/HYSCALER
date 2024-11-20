const express = require('express');
const router = express.Router();
const Employee = require('../models/userModel'); // Assumes you have a model for Employee
const LeaveRequest = require('../models/leaveRequestModel'); // Assumes you have a model for LeaveRequest
const {registerUser, loginUser} = require('../controller/authController');


router.post("/register", registerUser);
router.post("/login", loginUser);


router.post('/leave-requests', async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason, employeeId } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const calculateDurationInDays = (start, end) => {
            const differenceInTime = end - start;
            const differenceInDays = (differenceInTime / (1000 * 60 * 60 * 24))+1;
            return differenceInDays;
        };
        const durationInDays = calculateDurationInDays(start, end);

        const employee = await Employee.findById(employeeId);
        const leaveRequest = await LeaveRequest.create({ 
            leaveType, 
            startDate: start,
            endDate: end,
            reason, 
            createdBy: employeeId, 
            name: employee.name, 
            status: 'pending',
            leaveBalance: {
                leaveType: leaveType,
                durationInDays: durationInDays
            }
        });

        res.json({ message: "Leave request created successfully", leaveRequest });
    } catch (error) {
        console.error("Error creating leave request:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Route to fetch leave requests by employee ID
router.get('/:employeeId/leaveRequests', async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const leaveRequests = await LeaveRequest.find({ createdBy: employeeId });
        if (leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this employee' });
        }
        res.status(200).json(leaveRequests);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/:employeeId/leave-balance', async (req, res) => {
    const employeeId = req.params.employeeId;
    const leaveBalance = await LeaveRequest.find({ createdBy: employeeId });
    res.json(leaveBalance);
});

module.exports = router;
