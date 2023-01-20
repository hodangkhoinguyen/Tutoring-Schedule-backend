import express from 'express';
import appointmentCtrl from '../controller/appointment.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.route("/").post(auth.verifyToken, appointmentCtrl.createAppointment)
    .get(auth.verifyToken, appointmentCtrl.getAppointment)
    .put(auth.verifyToken, appointmentCtrl.updateAppointment)
    .delete(auth.verifyToken, appointmentCtrl.deleteAppointment);

export default router;
