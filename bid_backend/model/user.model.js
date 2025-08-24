import { Schema, model } from "mongoose"


const UserSchema = Schema({
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


export const User = model("Users", UserSchema)