import db from "../model/index.js";

const User = db.user;
const Schedule = db.schedule;

async function createSchedule(req, res, next) {
    try {
        const userId = req.userId;
        const schedule = new Schedule({
            tutorId: userId,
            schedule: req.body.schedule
        });

        const newSchedule = await Schedule.save();
        const scheduleId = newSchedule._id;

        // Add the schedule to Student and Tutor
        await User.findByIdAndUpdate(userId, { $set: { schedules: scheduleId } });

        res.json({ message: "Create schedule successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot create schedule"
        });
    }
}

async function getScheduleByTutor(req, res, next) {
    try {
        const tutorId = req.params.tutorId;
        const scheduleId = (await User.findById(tutorId)).schedule;
        if (!scheduleId) {
            res.json({});
        }
        const schedule = (await Schedule.findById(scheduleId)).schedule;
        res.json(schedule);
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot read schedule"
        });
    }
}

async function getScheduleByCourse(req, res, next) {
    try {
        const course = req.params.course;
        const result = (await User.find({ courses: { $in: [course] } },
            { roles: { $in: ["tutor"] } })
            .select("_id email name schedule"));
        res.json(result);
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot read schedule"
        });
    }
}

async function updateSchedule(req, res, next) {
    try {
        const userId = req.userId;
        const scheduleId = (await User.findById(userId)).schedule;
        await Schedule.findByIdAndUpdate(scheduleId, { schedule: req.body.schedule });
        res.json({ message: "Update schedule successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot update schedule"
        });
    }
}

async function deleteSchedule(req, res, next) {
    try {
        const userId = req.userId;
        const scheduleId = (await User.findById(userId)).schedule;
        await Schedule.findByIdAndDelete(scheduleId);
        await User.findByIdAndUpdate(userId, { schedule: null });
        res.json({ message: "Update schedule successfully" });
    }
    catch (e) {
        res.status(500).json({
            error: e.message,
            message: "Cannot delete schedule"
        });
    }
}

const scheduleCtrl = {
    createSchedule,
    getScheduleByCourse,
    getScheduleByTutor,
    updateSchedule,
    deleteSchedule
}

export default scheduleCtrl;
