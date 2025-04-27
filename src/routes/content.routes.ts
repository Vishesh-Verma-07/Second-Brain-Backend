import { Router } from "express";
import { ContentModel } from "../models";
import { auth } from "../middlewares/middleware";

const contentRouter = Router();


contentRouter.post("/api/v1/content", auth, async (req, res) =>{
    const {link, type } = req.body;
    const userId = req.userId;

    const content = await ContentModel.create({
        link,
        userId,
        type
    })

    if(content){
        res.json(content)
    }
})

contentRouter.delete("/api/v1/content", auth, async (req, res) =>{
    const userId= req.userId;
    const contentId = req.body.contentId;
    try {
        const content = await ContentModel.deleteOne({
            userId,
            contentId
        })
        res.json({
            message: "content"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "coudnt delete"
            
        })
    }

 
})

contentRouter.get("/api/v1/content", auth, async (req, res) =>{
    const userId= req.userId;
    try {
        const content = await ContentModel.find({
            userId,
        }).populate("userId", "-password")
        res.json(content)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "coudnt find entry"
            
        })
    }

 
})


export {
    contentRouter
}