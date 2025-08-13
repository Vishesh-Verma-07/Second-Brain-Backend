import { Router } from "express";
import { ContentModel } from "../models";
import { auth } from "../middlewares/middleware";
import { createContent, deleteContent, getAllContent, getPostDetail } from "../controller/content.controller";

const contentRouter = Router();


contentRouter.post("/create", auth, createContent)

contentRouter.delete("/deleteContent/:id", auth, deleteContent)

contentRouter.get("/getAll", auth, getAllContent)

contentRouter.get('/getPostDetail/:id', auth, getPostDetail)


export {
    contentRouter
}