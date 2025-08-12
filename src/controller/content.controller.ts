// src/controllers/content.controller.ts
import { Request, Response } from "express";
import { ContentModel, TagModel } from "../models";

import { sendResponse } from "../utility/sendResponse";

export const createContent = async (req: Request, res: Response) => {
    const { title, content, link, tags } = req.body;
    const userId = req.userId;

    try {
        // Ensure tags is an array
        const tagsArray = Array.isArray(tags) ? tags : tags ? [tags] : [];

        
        const tagIds = [];
        for (const tagTitle of tagsArray) {
            let tagDoc = await TagModel.findOne({ title: tagTitle });

            // If tag doesn't exist, create it
            if (!tagDoc) {
                tagDoc = await TagModel.create({ title: tagTitle });
            }

            tagIds.push(tagDoc._id);
        }

        const newContent = await ContentModel.create({
            title,
            content,
            link,
            tags: tagIds,
            userId,
        });

        console.log("New content created:", newContent);

        if (newContent) {
            sendResponse(res, 201, {
                status: 'success',
                message: 'Content created successfully',
                data: newContent
            });
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, {
            status: 'error',
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
        
        if (content.deletedCount === 0) {
            res.status(404).json({
                message: "Content not found"
            });
            return;
        }
        sendResponse(res, 200, {
            status: 'success',
            message: 'Content deleted successfully'
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, {
            status: 'error',
            message: "couldn't delete"
        });
    }
};

export const getAllContent = async (req: Request, res: Response) => {
    const userId = req.userId;
    
    try {
        const content = await ContentModel.find({
            userId,
        }).populate("userId", "-password").populate("tags", "title");

        if (!content || content.length === 0) {
            res.status(404).json({
                message: "No content found"
            });
            return;
        }

        sendResponse(res, 200, {
            status: 'success',
            message: 'Content fetched successfully',
            data: content
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, {
            status: 'error',
            message: "couldn't find entry"
        });
    }
};

export const getPostDetail = async(req: Request, res: Response) => {
    const userId = req.userId;
    const postId = req.params.id;

    try {
        const post = await ContentModel.findOne({
            _id: postId,
            userId
        }).populate("userId", "-password").populate("tags", "title");

        if (!post) {
            res.status(404).json({
                message: "Post not found"
            });
            return;
        }

        sendResponse(res, 200, {
            status: 'success',
            message: 'Post fetched successfully',
            data: post
        });
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, {
            status: 'error',
            message: "couldn't find entry"
        });
    }
}