import mongoose from 'mongoose';

const Appointment = mongoose.model(
    'Appointment',
    new mongoose.Schema(
        {
            date: Date,
            course: String,
            tutorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            status: String,
            note: String,
            file: [String],
        },
        { timestamps: true },
    ),
);

export default Appointment;
