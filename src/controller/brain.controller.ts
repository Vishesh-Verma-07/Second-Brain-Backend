// src/controllers/brain.controller.ts
import { Request, Response } from "express";
import { ContentModel, LinkModel } from "../models";
import { random } from "../utility/utils";

export const brainShare = async (req: Request, res: Response) => {
    const share = req.body.share;
    console.log(share);
    
    if (share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        
        const hash = random(10);
        await LinkModel.create({
            userId: req.userId,
            hash
        });
        
        res.json({
            hash
        });
        return;
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });
        
        res.json({
            message: "link disabled succssfuly"
        });
        return;
    }
};

export const getBrainByShareLink = async (req: Request, res: Response) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "this brain doesnt exit"
        });
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    }).populate("userId", '-password');

    res.json({
        content
    });
};
