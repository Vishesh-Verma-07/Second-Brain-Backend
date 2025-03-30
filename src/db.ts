import mongoose, { Schema, Types } from "mongoose";


const User = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    }
})


const Tag = new Schema({
    title: { 
        type: String, 
        required: true
    }
})

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

const Link = new Schema({
    hash: {
        type: String, 
        required: true,
    },
    userId: {
        type: Types.ObjectId, 
        ref: 'users',
        required: true,
        unique: true
    }
})


const UserModel = mongoose.model('users', User)
const LinkModel = mongoose.model("links", Link)
const ContentModel = mongoose.model("contents", Content)
const TagModel = mongoose.model("Tags", Tag)

export {
    UserModel, 
    LinkModel, 
    ContentModel, 
    TagModel
}

