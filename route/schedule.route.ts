import express from 'express';
import scheduleCtrl from '../controller/schedule.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.route("/").post(auth.verifyToken, scheduleCtrl.createSchedule)
    .put(auth.verifyToken, scheduleCtrl.updateSchedule)
    .delete(auth.verifyToken, scheduleCtrl.deleteSchedule);

router.route("/tutor/:tutorId").get(scheduleCtrl.getAvailabilityByTutor);
router.route("/course/:course").get(scheduleCtrl.getAvailabilityByTutor);

export default router;
