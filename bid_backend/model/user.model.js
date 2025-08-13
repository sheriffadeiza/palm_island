const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },

    email:{
        required: true,
        type: String,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
})


module.exports.User = mongoose.model("Users", UserSchema)