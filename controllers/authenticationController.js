import bcrypt from "bcryptjs";
import * as db from "../database/queries.js";

import passport from "passport";
import jwt from "jsonwebtoken";

import { body, validationResult } from "express-validator";

export const validateLogin = [
    body("username").trim().notEmpty().withMessage("Username is required.").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters.").matches(/^[a-zA-Z0-9_]/).withMessage("Username can only contain letters, numbers, and underscores.").escape(),
    body("password").isLength({ min: 6 }).withMessage("Password must be greater or equal to 6 characters."),
];

export const validateSignUp = [
    body("username").trim().notEmpty().withMessage("Username is required.").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters.").matches(/^[a-zA-Z0-9_]/).withMessage("Username can only contain letters, numbers, and underscores.").escape(),
    body("name").trim().notEmpty().withMessage("Name is required.").escape(),
    body("password").isLength({ min: 6 }).withMessage("Password must be greater or equal to 6 characters."),
    body("confirmPassword").custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error("Password do not match.");
        }
        return true;
    }),
];

async function postSignUp(req,res,next){
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const {username, name, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(username, name, hashedPassword);

        res.status(201).json({ message: "User Created" });
    } catch (error) {
        next(error);
    }
}

async function postLogin(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    passport.authenticate("local", { session: false }, (error, user, info) => {
        if (error){
            return next(error);
        }

        if(!user){
            return res.status(401).json({ message: info.message || "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    })(req,res,next);
}

export { postLogin, postSignUp }; 