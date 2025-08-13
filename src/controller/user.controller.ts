// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index';
import { apiResponse, sendResponse } from "../utility/sendResponse";

export const signup = async (req: Request, res: Response) => {

    // console.log(req.body);
    const requriedBody = z.object({
        username: z.string().min(3, {message: "username is too small"}).max(100, {message: "username is too long"}),
        email: z.string().email().min(3, {message: "email is too small"}).max(100, {message: "email is too long"}),
        password: z.string().min(8,{message: "password must be of minimum 8 chars"}).max(100, {message: "too long password"})
    });

    const parsedDataWithSafe = requriedBody.safeParse(req.body);

    // console.log("parsedDataWithSafe", parsedDataWithSafe);

    if(!parsedDataWithSafe.success){
        res.status(403).json({
            message: "incorrect formate",
            error: parsedDataWithSafe.error
        });
        return;
    }

    const {username, password, email} = parsedDataWithSafe.data;

    try {

        const existingUser = await UserModel.findOne({
            email
        });

        if(existingUser){
            res.status(403).json({
                message: "user already exists"
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 5);


        const user = await UserModel.create({
            username, 
            email,
            password: hashedPassword
        });
        
        sendResponse(res, 201, {
            status: "success",
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            message: "something went wrong during db entry"
        });
    }
};

export const signin = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await UserModel.findOne({
        email
    });

    if(!user){
        res.status(403).json({
            message: "User does not exist"
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        res.status(403).json({
            message: "Password is incorrect"
        });
        return;
    }
    
    if (!process.env.JWT_SECRETE) {
        res.status(500).json({
            message: "JWT secret is not defined"
        });
        return;
    }
    
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRETE);


    const options = {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'none' as const, // Using type assertion to specify literal type
        // maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    res.status(200).cookie('token', token, options).json(new apiResponse(200, {
        user: {
            id: user._id,
            email: user.email
        }
    }));
    return;
};


export const getUser = async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        res.status(400).json({
            message: "User ID is required"
        });
        return;
    }

    try {
        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching the user"
        });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { username, email } = req.body;

    if (!userId) {
        res.status(400).json({
            message: "User ID is required"
        });
        return;
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while updating the user"
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        res.status(400).json({
            message: "User ID is required"
        });
        return;
    }

    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        res.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while deleting the user"
        });
    }
};
