import { Router } from "express";
import { brainShare, getBrainByShareLink } from "../controller/brain.controller";

const brainRouter = Router();


brainRouter.post("/brain/share", brainShare)
brainRouter.get("/brain/:shareLink", getBrainByShareLink)

export {
    brainRouter
}