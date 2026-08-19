import "dotenv/config";

import express from "express";
import cors from "cors";

import passport from "passport";
import jwt from "jsonwebtoken";
import "./config/passport.js";

import indexRouter from "./routes/indexRouter.js";
import authenticationRouter from "./routes/authenticationRouter.js";
import errorHandler from "./middleware/error.js";

const app = express();
app.use(cors());

app.use(passport.initialize());
app.use(express.json());

app.use("/", indexRouter);
app.use("/", authenticationRouter);
app.use(errorHandler);

app.listen(process.env.PORT, (error) =>{
    if(error){
        throw error;
    }
console.log("Listening on port: ", process.env.PORT);
})