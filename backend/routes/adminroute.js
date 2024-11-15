const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/leaveRequestModel'); // Assumes you have a model for LeaveRequest

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
