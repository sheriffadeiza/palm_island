import { Schema, model } from "mongoose";

const MatchSchema = Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 100
    },
    opponent: {
        name: {
            type: String,
            required: true,
            max: 100
        },
        logo: {
            type: String,
            default: ''
        },
        contact: {
            type: String,
            default: ''
        }
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        name: {
            type: String,
            required: true,
            max: 200
        },
        address: {
            type: String,
            required: true,
            max: 300
        },
        isHome: {
            type: Boolean,
            default: true
        }
    },
    type: {
        type: String,
        enum: ['Friendly', 'League', 'Cup', 'Tournament', 'Playoff'],
        required: true
    },
    ageGroup: {
        type: String,
        required: true,
        max: 50
    },
    squad: [{
        playerId: {
            type: Schema.Types.ObjectId,
            ref: 'Players'
        },
        position: {
            type: String,
            enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
        },
        isStarter: {
            type: Boolean,
            default: false
        },
        jerseyNumber: {
            type: Number,
            min: 1,
            max: 99
        }
    }],
    result: {
        homeScore: {
            type: Number,
            default: null
        },
        awayScore: {
            type: Number,
            default: null
        },
        ourScore: {
            type: Number,
            default: null
        },
        opponentScore: {
            type: Number,
            default: null
        },
        outcome: {
            type: String,
            enum: ['Win', 'Loss', 'Draw'],
            default: null
        },
        penalties: {
            ourPenalties: {
                type: Number,
                default: null
            },
            opponentPenalties: {
                type: Number,
                default: null
            }
        }
    },
    events: [{
        type: {
            type: String,
            enum: ['Goal', 'Assist', 'Yellow Card', 'Red Card', 'Substitution', 'Injury']
        },
        playerId: {
            type: Schema.Types.ObjectId,
            ref: 'Players'
        },
        minute: {
            type: Number,
            min: 0,
            max: 120
        },
        description: {
            type: String,
            max: 200
        }
    }],
    status: {
        type: String,
        enum: ['Scheduled', 'Live', 'Completed', 'Cancelled', 'Postponed'],
        default: 'Scheduled'
    },
    importance: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    coachId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    preparation: {
        tactics: {
            type: String,
            default: ''
        },
        keyPlayers: [{
            type: Schema.Types.ObjectId,
            ref: 'Players'
        }],
        weaknesses: {
            type: String,
            default: ''
        },
        strengths: {
            type: String,
            default: ''
        }
    },
    attendance: {
        expected: {
            type: Number,
            default: 0
        },
        actual: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

export const Match = model("Matches", MatchSchema);
