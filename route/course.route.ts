import express from 'express';
import courseCtrl from '../controller/course.controller';

const router = express.Router();

router.route("/").get(courseCtrl.getAllCourses);

export default router;
