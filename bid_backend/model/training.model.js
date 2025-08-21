const mongoose = require("mongoose");

const TrainingSessionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 100
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        max: 200
    },
    type: {
        type: String,
        enum: ['Technical Skills', 'Physical Fitness', 'Tactical Training', 'Scrimmage', 'Recovery', 'Team Building'],
        required: true
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    maxParticipants: {
        type: Number,
        default: 25
    },
    participants: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Players'
        },
        attended: {
            type: Boolean,
            default: false
        },
        performance: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor'],
            default: null
        },
        notes: {
            type: String,
            default: ''
        }
    }],
    equipment: [{
        type: String
    }],
    objectives: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    weather: {
        type: String,
        default: ''
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'],
            default: null
        },
        endDate: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
});

module.exports.TrainingSession = mongoose.model("TrainingSessions", TrainingSessionSchema);
