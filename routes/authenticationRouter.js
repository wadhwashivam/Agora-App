import { Router } from "express";
import * as authenticationController from "../controllers/authenticationController.js";

const authenticationRouter = Router();

authenticationRouter.post("/signup", authenticationController.validateSignUp, authenticationController.postSignUp);
authenticationRouter.post("/login", authenticationController.validateLogin, authenticationController.postLogin);

export default authenticationRouter;