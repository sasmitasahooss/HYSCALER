const mongoose = require('../Database/mongooseConnection');

const leaveRequestSchema = new mongoose.Schema({
    id: {
        type: String,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },
    leaveBalance: {
        type: Object,
        properties: {
            'Sick Leave': {
                type: Number,
                min: 0,
                max: 5
            },
            'Vacation Leave': {
                type: Number,
                min: 0,
                max: 10
            },
            'Maternity Leave': {
                type: Number,
                min: 0,
                max: 90
            },
            'Paternity Leave': {
                type: Number,
                min: 0,
                max: 15
            }
        }
    },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Vacation Leave', 'Maternity Leave', 'Paternity Leave'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
    },
    reason: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    isRejected: {
        type: Boolean
    },
    rejectedBy: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
