import express from 'express';
import userCtrl from '../controller/user.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.route('/info').get(auth.verifyToken, userCtrl.getInfo);

export default router;
