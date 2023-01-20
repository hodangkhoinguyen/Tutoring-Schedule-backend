import jwt from "jsonwebtoken";
import db from "../model/index.js";
import dotenv from "dotenv";

dotenv.config();

const User = db.user;

async function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        req.userId = decoded.id;
        next();
    })
}

async function checkDuplicateEmail(req, res, next) {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: `Failed! Email is already used!` });
            return;
        }
        next();
    })
}

async function authRole(role) {
    return async (req, res, next) => {
        const user = await User.findById(req.userId);

        if (checkRole(role, user)) {
            next();
        }

        res.status(401).send({ message: "Your role is not authorized!" });
    }
}

function checkRole(userRole, user) {
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
    authRole
}

export default auth;
