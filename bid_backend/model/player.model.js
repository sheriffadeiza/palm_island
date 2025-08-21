const mongoose = require("mongoose");

const PlayerSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 2,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min: 5,
        max: 50
    },
    position: {
        type: String,
        required: true,
        enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
    },
    phoneNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    },
    medicalInfo: {
        allergies: {
            type: String,
            default: 'None'
        },
        medications: {
            type: String,
            default: 'None'
        },
        conditions: {
            type: String,
            default: 'None'
        }
    },
    performance: {
        type: String,
        enum: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        default: 'Good'
    },
    attendance: {
        type: String,
        default: '0%'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports.Player = mongoose.model("Players", PlayerSchema);
