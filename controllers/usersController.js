import * as db from "../database/queries.js";

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
        const otherUserId = req.params.id;
        const userProfile = await db.getUserProfile(otherUserId);

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

export { getUsers, userProfile, toggleFollow }