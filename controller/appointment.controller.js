import db from "../model/index.js";

const User = db.user;
const Appointment = db.appointment;

async function createAppointment(req, res, next) {
    const tutorId = req.body.tutorId;
    const studentId = req.body.studentId;
    let userId = req.userId;

    if (userId !== tutorId || userId !== studentId) {
        res.status(401).send({ message: "Not authorized to create appointment" });
        return;
    }

    try {
        let appointment = new Appointment({
            date: new Date(), // UPDATE LATER for THE CORRECT DATE OF TUTOR SECTION
            course: req.body.course,
            tutorId: tutorId,
            studentId: studentId,
            note: req.body.note,
            file: req.body.file || []
        });

        const newAppointment = await appointment.save();
        const appointmentId = newAppointment._id;

        // Add the appointment to Student and Tutor
        await User.findByIdAndUpdate(tutorId, { $push: { appointments: appointmentId } });
        await User.findByIdAndUpdate(studentId, { $push: { appointments: appointmentId } });

        res.json({ message: "Create appointment successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot create appointment"
        });
    }
}

async function getAppointment(req, res, next) {
    try {
        let userId = req.userId;
        let appointments = (await User.findById(userId)).appointments;
        if (!appointments) {
            res.status(401).json({ message: "UserId is wrong" });
            return;
        }
        let result = []
        for (let id of appointments) {
            result.push(await Appointment.findById(id));
        }

        res.json(result);
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot read appointment"
        });
    }
}

async function updateAppointment(req, res, next) {
    try {
        const userId = req.userId;
        const appointmentId = req.body.appointmentId;
        const canUpdate = await canModify(appointmentId, userId);
        const tutorId = req.body.tutorId;
        const studentId = req.body.studentId;

        if (!canUpdate) {
            res.status(401).send({ message: "Not authorized to update appointment" });
            return;
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            $set: {
                date: new Date(), // UPDATE LATER for THE CORRECT DATE OF TUTOR SECTION
                course: req.body.course,
                tutorId: tutorId,
                studentId: studentId,
                note: req.body.note,
                file: req.body.file || []
            }
        });
        res.json({ message: "Update appointment successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot update appointment"
        });
    }
}

async function deleteAppointment(req, res, next) {
    try {
        const userId = req.userId;
        const appointmentId = req.body.appointmentId;
        const canUpdate = await canModify(appointmentId, userId);
        const tutorId = req.body.tutorId;
        const studentId = req.body.studentId;

        if (!canUpdate) {
            res.status(401).send({ message: "Not authorized to delete appointment" });
            return;
        }

        await Appointment.findByIdAndDelete(appointmentId);
        await User.findByIdAndUpdate(tutorId, { $pull: { appointments: appointmentId } });
        await User.findByIdAndUpdate(studentId, { $pull: { appointments: appointmentId } });

        res.json({ message: "Delete appointment successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot delete appointment"
        });
    }
}

async function canModify(appointmentId, userId) {
    const appointmentList = (await User.findById(userId)).appointments;
    for (let id of appointmentList) {
        if (id.toString() === appointmentId) {
            return true;
        }
    }
    return false;
}

const appointmentCtrl = {
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment
}

export default appointmentCtrl;
