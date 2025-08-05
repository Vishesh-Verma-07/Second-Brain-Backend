import { Router } from "express";
import { signin, signup } from "../controller/user.controller";

const userRouter = Router();
userRouter.get("/", (req, res) => {
    res.send("User route is working");
});

userRouter.post("/signup", signup)

userRouter.post("/signin", signin)


export {
    userRouter
}