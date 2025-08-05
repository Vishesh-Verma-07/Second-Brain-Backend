// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index';

export const signup = async (req: Request, res: Response) => {

    console.log(req.body);
    const requriedBody = z.object({
        username: z.string().min(3, {message: "username is too small"}).max(100, {message: "username is too long"}),
        email: z.string().email().min(3, {message: "email is too small"}).max(100, {message: "email is too long"}),
        password: z.string().min(8,{message: "password must be of minimum 8 chars"}).max(100, {message: "too long password"})
    });

    const parsedDataWithSafe = requriedBody.safeParse(req.body);

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


        await UserModel.create({
            username, 
            email,
            password: hashedPassword
        });
        
        res.status(201).json({
            message: "user signed up successfully"
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
            message: "user not found"
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        res.status(403).json({
            message: "invalid credentials"
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

    // Set token in an HTTP-only cookie for better security
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict'
    });

    res.json({
        message: "Login successful",
        // token 
    });
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
