import { Router } from "express";
import * as postsController from "../controllers/postsController.js";

const postsRouter = Router();

postsRouter.post("/posts", postsController.validatePost, postsController.createPost);
postsRouter.get("/posts", postsController.postsList);
postsRouter.get("/posts/:id", postsController.getPost);

postsRouter.post("/posts/:postId/comments", postsController.validateComment, postsController.createComment);
postsRouter.post("/posts/:postId/likes", postsController.toggleLikes);

export default postsRouter;