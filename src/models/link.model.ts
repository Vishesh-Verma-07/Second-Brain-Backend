import mongoose, { Schema, Types } from "mongoose";


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


const LinkModel = mongoose.model("links", Link)

export {
    LinkModel, 

}

