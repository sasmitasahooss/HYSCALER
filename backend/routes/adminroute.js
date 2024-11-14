const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/userModel'); // Assumes you have a model for Employee
const LeaveRequest = require('../models/leaveRequestModel'); // Assumes you have a model for LeaveRequest

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET); // Use the same secret key used in signing
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(400).json({ msg: 'Token is not valid' });
    }
};

// Route to create a new leave request
router.get('/leave-requests', async (req, res) => {
    const leaveRequests = await LeaveRequest.find();
    if (leaveRequests.length === 0) {
        return res.status(404).json({ message: 'No leave requests found' });
    }
    res.json(leaveRequests);
});


router.post('/approve-leave/:leaveCreatedBy/:leaveRequestId', async (req, res) => {
    const leaveCreatedBy = req.params.leaveCreatedBy;
    const leaveRequestId = req.params.leaveRequestId;
    const leaveRequest = await LeaveRequest.findOneAndUpdate({ createdBy: leaveCreatedBy, _id: leaveRequestId }, 
        { status: 'approved' }, { new: true });
    res.json({ message: 'Leave request approved', leaveRequest });
});

router.post('/reject-leave/:leaveCreatedBy/:leaveRequestId', async (req, res) => {
    const leaveCreatedBy = req.params.leaveCreatedBy;
    const leaveRequestId = req.params.leaveRequestId;
    const leaveRequest = await LeaveRequest.findOneAndDelete({ createdBy: leaveCreatedBy, _id: leaveRequestId }, 
        { status: 'rejected' }, { new: true });
    res.json({ message: 'Leave request rejected', leaveRequest });
});

module.exports = router;
