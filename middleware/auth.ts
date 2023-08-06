import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/user.model';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export interface CustomRequest extends Request {
    userId: string | JwtPayload;
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract the token from the header
        let token = req.headers.authorization?.replace('Bearer ', '');
        // No token provided handler
        if (!token) {
            return res.status(403).send({ message: 'No token provided!' });
        }

        // Decode the token into the userId
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');
        req.body.userId = decoded.id;
        next();
    } catch (e) {
        return res.status(401).send({ message: 'Verify token failed' });
    }
}

async function checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
    try {
        // Find if there's any account with the provided email
        const user = await User.findOne({ email: req.body.email });

        // If the user exists, it means the email is used
        if (user) {
            return res.status(400).send({ message: 'Failed! Email is already used!' });
        }
        next();
    } catch (e) {
        return res.status(409).send({ message: 'Check duplicate email failed' });
    }
}

async function authRole(role: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.body.userId);

        if (checkRole(role, user)) {
            next();
        }

        return res.status(401).send({ message: 'Your role is not authorized!' });
    };
}

function checkRole(userRole: any, user: any) {
    if (!user.role) {
        return false;
    }

    for (let role of user.role) {
        if (role === userRole) {
            return true;
        }
    }

    return false;
}

const auth = {
    verifyToken,
    checkDuplicateEmail,
    authRole,
};

export default auth;
