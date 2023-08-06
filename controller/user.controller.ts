import { Request, Response } from 'express';
import User from '../model/user.model';

async function getInfo(req: Request, res: Response) {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).select(["-_id", "-__v"]);
        res.json(user);
    }
    catch (err) {
        res.status(500).json({message: "Cannot get user info"});
    }
}

const userCtrl = {
    getInfo
}

export default userCtrl;
