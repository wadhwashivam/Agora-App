import { Router } from "express";
import passport, { Passport } from "passport";
import * as postsController from "../controllers/postsController.js";

const postsRouter = Router();

postsRouter.post("/posts", passport.authenticate("jwt", {session: false}) ,postsController.validatePost, postsController.createPost);

postsRouter.get("/posts", passport.authenticate("jwt", {session: false}) ,postsController.postsList);
postsRouter.get("/posts/:postId", passport.authenticate("jwt", {session: false}) ,postsController.getPost);

postsRouter.post("/posts/:postId/comments", passport.authenticate("jwt", {session: false}) ,postsController.validateComment, postsController.createComment);
postsRouter.post("/posts/:postId/likes", passport.authenticate("jwt", {session: false}) ,postsController.toggleLikes);

export default postsRouter;