import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import User from '../model/user.model';

dotenv.config();

const HASH_TIME = 12;

async function signUp(req: Request, res: Response) {
    try {
        // Generate a random 32-bit string for salt
        const salt = crypto.randomBytes(64).toString('hex');

        const hashPassword = bcrypt.hashSync(salt + req.body.password, HASH_TIME);

        let roles = req.body.roles;

        if (!roles || roles.length === 0) {
            roles = ['student'];
        }

        const user = new User({
            email: req.body.email,
            salt: salt,
            password: hashPassword,
            name: req.body.name,
            roles: roles,
            courses: req.body.courses || [],
            schedule: null,
            appointments: [],
        });

        await user.save();
        res.send({ message: 'register successfully!' });
    } catch (err) {
        return res.status(500).send({ message: 'Sign up failed' });
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const password = req.body.password;
        let user = await User.findOne({
            email: req.body.email,
        }).select('+salt +password');
        if (user === null) {
            return res.status(505).json({ message: "This email doesn't exist" });
        }

        const passwordIsValid = bcrypt.compareSync(user.salt + password, user.password as string);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: 'Invalid Password!',
            });
        }
        const roles = user.roles;
        var token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET || '');

        return res.json({
            id: user._id,
            name: user.name,
            roles: roles,
            accessToken: token,
        });
    } catch (err) {
        return res.status(500).send({
            message: 'Sign in failed',
        });
    }
}

const authCtrl = {
    signUp,
    signIn,
};

export default authCtrl;
