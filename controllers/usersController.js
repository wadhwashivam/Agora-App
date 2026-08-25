import * as db from "../database/queries.js";
import { body, validationResult } from "express-validator";

export const validateProfile = [
    body("name").optional().trim().isLength({max: 50}).withMessage("Name can be maximum 12 characters.").escape(),
    body("bio").optional().trim().isLength({max: 100}).withMessage("Bio can be maximum 100 characters.").escape(),
    body("avatar").optional().isURL().withMessage("Avatar can only be a URL of an image")
];

async function getUsers(req,res,next){
    try {
        const myId = req.user.id;
        const userList = await db.getAllUsers(myId);
        res.status(200).json(userList);
    } catch (error) {
        next(error);
    }
}


async function userProfile(req,res,next){
    try {
        const myId = req.user.id;
        const otherUserId = req.params.id;
        const userProfile = await db.getUserProfile(myId, otherUserId);

        if(!userProfile){
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
}

async function toggleFollow(req,res,next){
    try {
        const followerId = req.user.id;
        const followingId = req.params.id;

        if(followerId === followingId){
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const existingFollow = await db.findFollow(followerId, followingId);

        if(existingFollow){
            await db.deleteFollow(followerId,followingId);
            return res.status(200).json({ following: false });
        }

        await db.createFollow(followerId, followingId);
        return res.status(201).json({ following: true});
    } catch (error) {
        next(error);
    }
}

async function editProfile(req,res,next){

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.params.id;
        const { name, bio, avatar } = req.body;

        const updates = {};
        if(name !== undefined){
            updates.name = name;
        }
        if(bio !== undefined){
            updates.bio = bio;
        }
        if(avatar !== undefined){
            updates.avatar = avatar;
        }

        const updatedProfile = await db.editUserProfile(userId, updates);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
}

export { getUsers, userProfile, toggleFollow, editProfile }