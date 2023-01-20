import mongoose from "mongoose";

const Schedule = mongoose.model('Schedule',
    new mongoose.Schema({
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        /* 
            Schedule format
            "monday": [[start, end], [start, end]],
            "tuesday": [[start, end], [start, end]]
            ...
        */
        schedule: Object
    },
        { timestamps: true })
);

export default Schedule;
