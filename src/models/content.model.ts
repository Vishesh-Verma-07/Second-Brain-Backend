import mongoose, { Schema, Types } from "mongoose"


const contentTypes = ['image', 'video', 'article', 'audio']

const Content = new Schema({
    link: {
        type: String, 
        unique: true
    },
    type: {
        type: String, 
        enum: contentTypes, 
        requried: true
    },
    title: String, 
    tags: [{
        type: Types.ObjectId,
        ref: 'Tags'
    }],
    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    }

})


const ContentModel = mongoose.model("contents", Content)

export { ContentModel }
