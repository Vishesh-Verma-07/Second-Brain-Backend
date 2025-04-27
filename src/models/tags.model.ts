import mongoose, { Schema, Types } from "mongoose";




const Tag = new Schema({
    title: { 
        type: String, 
        required: true
    }
})


const TagModel = mongoose.model("Tags", Tag)

export { TagModel }