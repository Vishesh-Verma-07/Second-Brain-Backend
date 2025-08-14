import mongoose, { Schema, Types } from "mongoose";


const User = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    }, 
    content: [{
        type: Types.ObjectId,
        ref: 'contents'
    }], 
    collections: [{
        type: Types.ObjectId,
        ref: 'collections'
    }]
}, { timestamps: true })


const UserModel = mongoose.model('users', User)

export { UserModel }
