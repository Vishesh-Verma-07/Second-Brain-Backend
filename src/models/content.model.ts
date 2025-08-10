import mongoose, { Schema, Types } from "mongoose"


const Content = new Schema({
    title: String, 
    link: {
        type: String, 
    },
    tags: [{
        type: Types.ObjectId,
        ref: 'Tags'
    }],
    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    }, 
    content: {
        type: String,
        required: true
    },
    summary: String,


}, { timestamps: true })


const ContentModel = mongoose.model("contents", Content)

export { ContentModel }
