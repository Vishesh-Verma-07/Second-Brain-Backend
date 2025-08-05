// src/controllers/content.controller.ts
import { Request, Response } from "express";
import { ContentModel } from "../models";

export const createContent = async (req: Request, res: Response) => {
    const { link, type } = req.body;
    const userId = req.userId;

    try {
        const content = await ContentModel.create({
            link,
            userId,
            type
        });

        if (content) {
            res.json(content);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Couldn't create content"
        });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    const userId = req.userId;
    const contentId = req.body.contentId;
    
    try {
        const content = await ContentModel.deleteOne({
            userId,
            contentId
        });
        
        res.json({
            message: "content deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "couldn't delete"
        });
    }
};

export const getAllContent = async (req: Request, res: Response) => {
    const userId = req.userId;
    
    try {
        const content = await ContentModel.find({
            userId,
        }).populate("userId", "-password");
        
        res.json(content);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "couldn't find entry"
        });
    }
};
