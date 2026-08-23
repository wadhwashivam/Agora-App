import * as db from "../database/queries.js";
import { body, validationResult } from "express-validator";

export const validateComment = [
    body("content").trim().isLength({ max: 600}).withMessage("Maximum 600 Characters.").isLength({min: 4}).withMessage("Minimum 4 Characters.").escape()
];

export const validatePost = [
    body("content").trim().isLength({max: 3000}).withMessage("Maximum 3000 Characters.").isLength({min: 60 }).withMessage("Minimum 60 Characters.").escape()
];

async function createPost(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        const myId = req.user.id;
        const { content } = req.body;

        const post = await db.createPost(myId, content);
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}

async function postsList(req,res,next){
    try {
        const myId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        page = Math.max(page, 1);
        limit = Math.min(Math.max(limit,1), 50);


        const skip = (page - 1) * limit;

        const posts = await db.getFeedPosts(myId, {skip, take: limit });
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
}

async function getPost(req,res,next){
    try {
        const postId = req.params.id;
        const post = await db.getPostById(postId);

        if (!post){
            return res.status(404).json({ message: "Post not found."});
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}

async function createComment(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        const myId = req.user.id;
        const postId = req.params.postId;
        const { content } = req.body;
        const comment = await db.createComment(myId, postId, content);
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}

async function toggleLikes(req,res,next){
    try {
        const myId = req.user.id;

        const postId = req.params.postId;
        const existingLike = await db.findLike(myId, postId);

        if(existingLike){
            await db.deleteLike(myId, postId);
            return res.status(200).json({ like: false});
        }

        await db.createLike(myId, postId);
        return res.status(201).json({ like: true});
    } catch (error) {
        next(error);
    }
}

export { createPost, postsList, getPost, createComment, toggleLikes };