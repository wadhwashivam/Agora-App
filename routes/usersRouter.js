import { Router } from "express";
import passport from "passport";
import * as usersController from "../controllers/usersController.js";
import requireOwnership from "../middleware/requireOwnership.js";

const usersRouter = Router();

usersRouter.get("/users", passport.authenticate("jwt", { session: false }), usersController.getUsers);
usersRouter.get("/users/:id", passport.authenticate("jwt", { session: false }), usersController.userProfile);

usersRouter.patch("/users/:id", passport.authenticate("jwt", { session: false }), requireOwnership ,usersController.editProfile);

usersRouter.post("/users/:id/follow", passport.authenticate("jwt", { session: false }), usersController.toggleFollow);

export default usersRouter;