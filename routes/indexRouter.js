import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req,res) => {
    res.json({ message: "Agora app API is running "});
})

export default indexRouter;