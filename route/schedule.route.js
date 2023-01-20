import express from 'express';
import scheduleCtrl from '../controller/schedule.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/").post(auth.verifyToken, scheduleCtrl.createSchedule)
    .put(auth.verifyToken, scheduleCtrl.updateSchedule)
    .delete(auth.verifyToken, scheduleCtrl.deleteSchedule);

router.route("/:tutorId").get(scheduleCtrl.getScheduleByTutor);
router.route("/:course").get(scheduleCtrl.getScheduleByCourse);

export default router;
