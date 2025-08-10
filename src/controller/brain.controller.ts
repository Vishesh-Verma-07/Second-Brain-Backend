// src/controllers/brain.controller.ts
import { Request, Response } from "express";
import { ContentModel, LinkModel } from "../models";
import { random } from "../utility/utils";
import { sendResponse } from "../utility/sendResponse";


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

        sendResponse(res, 411, {
            status: 'error',
            message: "This brain doesn't exist"
        });
        
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    }).populate("userId", '-password');

    if (content.length === 0) {
        sendResponse(res, 404, {
            status: 'error',
            message: "No content found for this brain"
        });
        return;
    }
    sendResponse(res, 200, {
        status: 'success',
        message: "Content fetched successfully",
        data: content
    });
};
