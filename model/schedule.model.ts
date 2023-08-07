import mongoose from 'mongoose';

const Schedule = mongoose.model(
    'Schedule',
    new mongoose.Schema(
        {
            tutorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            /* 
            Schedule format: time is every 30 minutes
            {
                0: [[start, end], [start, end], ...], // Monday
                1: [[start, end], [start, end], ...], // Tuesday
                2: [[start, end], [start, end], ...], // Wednesday
            }
            ...
        */
            time: Object,
        },
        { timestamps: true },
    ),
);

export default Schedule;
