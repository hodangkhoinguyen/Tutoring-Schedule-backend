import { Request, Response } from 'express';
import User from '../model/user.model';
import Appointment from '../model/appointment.model';

async function createAppointment(req: Request, res: Response) {
    const tutorId = req.body.tutorId;
    const studentId = req.body.studentId;
    let userId = req.body.userId;
    console.log(userId, studentId, userId === studentId);
    if (userId !== tutorId && userId !== studentId) {
        res.status(401).send({ message: 'Not authorized to create appointment' });
        return;
    }

    try {
        let appointment = new Appointment({
            date: new Date(req.body.date),
            course: req.body.course,
            tutorId: tutorId,
            studentId: studentId,
            status: 'active',
            note: req.body.note,
            file: req.body.file || [],
        });

        await appointment.save();

        res.json({ message: 'Create appointment successfully' });
    } catch (e) {
        res.status(500).json({
            message: 'Cannot create appointment',
        });
    }
}

async function getAppointment(req: Request, res: Response) {
    try {
        let userId = req.body.userId;
        let appointments = await Appointment.find({
            $or: [{ tutorId: userId }, { studentId: userId }],
        });

        res.json(appointments);
    } catch (e) {
        res.status(500).json({
            message: 'Cannot read appointment',
        });
    }
}

async function updateAppointment(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const appointmentId = req.body.appointmentId;
        const canUpdate = await canModify(appointmentId, userId);
        const tutorId = req.body.tutorId;
        const studentId = req.body.studentId;

        if (!canUpdate) {
            res.status(401).send({ message: 'Not authorized to update appointment' });
            return;
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            $set: {
                date: new Date(req.body.date), // UPDATE LATER for THE CORRECT DATE OF TUTOR SECTION
                course: req.body.course,
                tutorId: tutorId,
                studentId: studentId,
                note: req.body.note,
                file: req.body.file || [],
            },
        });
        res.json({ message: 'Update appointment successfully' });
    } catch (e) {
        res.status(500).json({
            message: 'Cannot update appointment',
        });
    }
}

async function cancelAppointment(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const appointmentId = req.body.appointmentId;
        const canUpdate = await canModify(appointmentId, userId);
        const tutorId = req.body.tutorId;
        const studentId = req.body.studentId;

        if (!canUpdate) {
            res.status(401).send({ message: 'Not authorized to delete appointment' });
            return;
        }

        await Appointment.findByIdAndDelete(appointmentId);
        await User.findByIdAndUpdate(tutorId, { $pull: { appointments: appointmentId } });
        await User.findByIdAndUpdate(studentId, { $pull: { appointments: appointmentId } });

        res.json({ message: 'Delete appointment successfully' });
    } catch (e) {
        res.status(500).json({
            message: 'Cannot delete appointment',
        });
    }
}

async function deleteAppointment(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const appointmentId = req.body.appointmentId;
        const canUpdate = await canModify(appointmentId, userId);

        if (!canUpdate) {
            res.status(401).send({ message: 'Not authorized to delete appointment' });
            return;
        }

        await Appointment.findByIdAndDelete(appointmentId);

        res.json({ message: 'Delete appointment successfully' });
    } catch (e) {
        res.status(500).json({
            message: 'Cannot delete appointment',
        });
    }
}

async function canModify(appointmentId: string, userId: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return false;

    if (appointment.tutorId?.toString() === userId || appointment.studentId?.toString() === userId) {
        return true;
    }

    return false;
}

const appointmentCtrl = {
    createAppointment,
    getAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
};

export default appointmentCtrl;
