import mongoose from "mongoose";

const User = mongoose.model('User',
    new mongoose.Schema({
        email: String,
        password: {
            type: String,
            select: false
        },
        salt: {
            type: String,
            select: false
        }, // salt for increasing security
        name: String,
        roles: [String],
        courses: [String],
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule"
        },
        appointments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        }]
    })
);

export default User;
