import { Router } from "express";
import { ContentModel } from "../models";
import { auth } from "../middlewares/middleware";
import { createContent, deleteContent, getAllContent } from "../controller/content.controller";

const contentRouter = Router();


contentRouter.post("/content", auth, createContent)

contentRouter.delete("/content", auth, deleteContent)

contentRouter.get("/content", auth, getAllContent)


export {
    contentRouter
}