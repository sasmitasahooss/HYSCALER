const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/leaveRequestModel');
const verifyToken = require('../middleware/authMiddleware');
router.get('/admin', verifyToken, (req, res) => {
    res.json({message: "Admin route accessed"});
});

router.get('/employee', verifyToken, (req, res) => {
    res.json({message: "Employee route accessed"});
});


router.get('/leaveRequests', async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find();
        res.json(leaveRequests);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
