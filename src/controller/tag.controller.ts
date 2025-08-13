import { Request, Response } from 'express';
import { TagModel } from '../models';
import { sendResponse } from '../utility/sendResponse';


// Create a new tag
export async function createTag(req: Request, res: Response): Promise<void> {
    try {
        const { name } = req.body;

        if(!name) {
            sendResponse(res, 400, {status: 'error', message: 'Name is required for tag' });
            return;
        }

        const existingTag = await TagModel.findOne({ name });
        if (existingTag) {
            sendResponse(res, 400, {status: 'error', message: 'Tag with this name already exists' });
            return;
        }

        const tag = new TagModel({ name });
        await tag.save();

        sendResponse(res, 201, {status: 'success', message: 'Tag created successfully', data: tag });
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, {status: 'error', message: error.message || 'Failed to create tag', error: error });
    }
}

// Get all tags
export async function getAllTags(req: Request, res: Response): Promise<void> {
    try {
        const tags = await TagModel.find().sort({ name: 1 });

        sendResponse(res, 200, {status: 'success', message: 'Tags fetched successfully', data: tags });
    } catch (error: any) {
        sendResponse(res, 500, {status: 'error', message: 'Failed to fetch tags', error: error.message });
        return;
    }
}

// Get single tag by ID
export async function getTagById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const tag = await TagModel.findById(id);
        if (!tag) {
            sendResponse(res, 404, {status: 'error', message: 'Tag not found' });
            return;
        }
        sendResponse(res, 200, {status: 'success', message: 'Tag fetched successfully', data: tag });
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, {status: 'error', message: error.message || 'Failed to fetch tag', error: error });
    }
}

// Update tag
export async function updateTag(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name) {
            sendResponse(res, 400, {status: 'error', message: 'Name is required for tag' });
            return;
        }
        
        // Check if another tag with the same name exists
        const duplicateTag = await TagModel.findOne({ name, _id: { $ne: id } });
        if (duplicateTag) {
            sendResponse(res, 400, {status: 'error', message: 'Tag with this name already exists' });
            return;
        }

        const updatedTag = await TagModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );
        
        if (!updatedTag) {
            sendResponse(res, 404, {status: 'error', message: 'Tag not found' });
            return;
        }

        sendResponse(res, 200, {status: 'success', message: 'Tag updated successfully', data: updatedTag });
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, {status: 'error', message: error.message || 'Failed to update tag', error: error });
    }
}

// Delete tag
export async function deleteTag(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const deletedTag = await TagModel.findByIdAndDelete(id);

        if (!deletedTag) {
            sendResponse(res, 404, {status: 'error', message: 'Tag not found' });
            return;
        }

        sendResponse(res, 200, {status: 'success', message: 'Tag deleted successfully', data: deletedTag });
    } catch (error: any) {
        sendResponse(res, error.statusCode || 500, {status: 'error', message: error.message || 'Failed to delete tag', error: error });
    }
}
       