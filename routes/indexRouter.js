import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req,res) => {
    res.json({ message: "Messaging API is running "});
})

export default indexRouter;