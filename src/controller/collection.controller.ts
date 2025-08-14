import { Request, Response } from "express";
import { collectionModel } from "../models/collections.model";
import { UserModel } from "../models";
import { sendResponse } from "../utility/sendResponse";


export const createCollection = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.userId;
        const newCollection = await collectionModel.create({ name, user: userId });
        if(!newCollection) {
            return sendResponse(res, 400, {
                status: 'error',
                message: "Failed to create collection"
            });
        }

        sendResponse(res, 201, {
            status: 'success', 
            message: "Collection created successfully",
            data: newCollection
        });
    } catch (error: any) {
        sendResponse(res, 500, {
            status: 'error',
            message: error.message
        });
    }
};

export const getCollections = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).populate('collections');
        if (!user) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'User not found'
            });
            return
        }
        sendResponse(res, 200, {
            status: 'success',
            message: 'Collections retrieved successfully',
            data: user.collections
        });
    } catch (error: any) {
        sendResponse(res, 500, {
            status: 'error',
            message: error.message
        });
    }
};

export const getCollectionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const user = await UserModel.findById(userId).populate('collections');
        if (!user) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'User not found'
            });
            return;
        }
        const collection = user.collections.id(id);
        if (!collection) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'Collection not found'
            });
            return;
        }
        sendResponse(res, 200, {
            status: 'success',
            message: 'Collection retrieved successfully',
            data: collection
        });
    } catch (error: any) {
        sendResponse(res, 500, {
            status: 'error',
            message: error.message
        });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { name } = req.body;
        const user = await UserModel.findById(userId).populate('collections');
        if (!user) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'User not found'
            });
            return;
        }
        const updatedCollection = await collectionModel.findOneAndUpdate(
            { _id: id, user: userId },
            { name },
            { new: true }
        );
        
        if (!updatedCollection) {
            sendResponse(res, 404, {
            status: 'error',
            message: 'Collection not found'
            });
            return;
        }
        
        const collection = updatedCollection;

        sendResponse(res, 200, {
            status: 'success',
            message: 'Collection updated successfully',
            data: collection
        });
    } catch (error: any) {
        sendResponse(res, 500, {
            status: 'error',
            message: error.message
        });
    }
}

export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const user = await UserModel.findById(userId).populate('collections');
        if (!user) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'User not found'
            });
            return;
        }
        const deletedCollection = await collectionModel.findOneAndDelete({ _id: id, user: userId });
        if (!deletedCollection) {
            sendResponse(res, 404, {
                status: 'error',
                message: 'Collection not found'
            });
            return;
        }
        
        await UserModel.findByIdAndUpdate(userId, { $pull: { collections: id } });

        sendResponse(res, 200, {
            status: 'success',
            message: 'Collection deleted successfully',
            data: deletedCollection
        });
    } catch (error: any) {
        sendResponse(res, 500, {
            status: 'error',
            message: error.message
        });
    }
};