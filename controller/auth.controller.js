import dotenv from "dotenv";
import db from "../model/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

dotenv.config();

const User = db.user;

const HASH_TIME = 12;

async function signUp(req, res, next) {
    try {
        // Generate a random 32-bit string for salt
        const salt = crypto.randomBytes(64).toString('hex');
        const hashPassword = bcrypt.hashSync(salt + req.body.password, HASH_TIME);

        let roles = req.body.roles;

        if (!roles || roles.length === 0) {
            roles = ["student"];
        }

        const user = new User({
            email: req.body.email,
            salt: salt,
            password: hashPassword,
            name: req.body.name,
            roles: roles,
            courses: req.body.courses || [],
            schedule: null,
            appointments: []
        });
        let a = await user.save();
        res.send({ message: "register successfully!" });
    }
    catch (e) {
        res.status(500).send({ message: "sign up fails" });
    }
}

async function signIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let user = await User.findOne({
        email: req.body.email
    }).select("+salt +password");
    if (user === null) {
        res.status(505).json({ message: "This email doesn't exist" });
        return;
    };
    console.log(user)
    const passwordIsValid = bcrypt.compareSync(
        user.salt + password,
        user.password
    );

    if (!passwordIsValid) {
        res.status(401).json({
            accessToken: null,
            message: "Invalid Password!"
        });
        return
    }
    const roles = user.roles;
    var token = jwt.sign({ id: user.id, roles: roles }, process.env.ACCESS_TOKEN_SECRET);

    res.json({
        id: user._id,
        name: user.name,
        roles: roles,
        roles: user.roles,
        accessToken: token
    });
}

const authCtrl = {
    signUp,
    signIn
}

export default authCtrl;
