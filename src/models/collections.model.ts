import mongoose, { Schema, Types } from "mongoose";


const collection = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true })

const collectionModel = mongoose.model('collections', collection)

export { collectionModel }
