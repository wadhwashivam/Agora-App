import { Router } from "express";
import * as usersController from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/users", usersController.getUsers);
usersRouter.get("/users/:id", usersController.userProfile);
usersRouter.post("/users/:id/follow", usersController.toggleFollow);

export default usersRouter;