import { Router } from "express";
import { z } from "zod";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/index'

const userRouter = Router();

userRouter.post("/api/v1/signup", async (req, res) => {

    const requriedBody = z.object({
        username: z.string().min(3, {message: "username is too small"}).max(100, {message: "username is too long"}),
        email: z.string().email().min(3, {message: "email is too small"}).max(100, {message: "email is too long"}),
        password: z.string().min(8,{message: "password must be of minimum 8 chars"}).max(100, {message: "too long password"})
    })



    const parsedDataWithSafe = requriedBody.safeParse(req.body)

    if(!parsedDataWithSafe.success){
        res.status(403).json({
            message: "incorrect formate",
            error: parsedDataWithSafe.error
        })
        return
    }

    const {username, password, email} = parsedDataWithSafe.data;

    try {

        const hashedPassword = await bcrypt.hash(password, 5);

        await UserModel.create({
            username, 
            email,
            password: hashedPassword
        })
    } catch (error) {
        res.status(500).json({
            message: "something went wrong during db entry"
        })
        return;
    }


    res.status(201).json({
        message: "user signed up successfully"
    })

})

userRouter.post("/api/v1/signin", async (req, res) =>{
    const {email, password} = req.body;

    const user = await UserModel.findOne({
        email
    })


    if(!user){
        res.status(403).json({
            message: "user not found"
        })
        return
    }


    const passwordMath = await bcrypt.compare(password, user.password);

    if(!passwordMath){
        res.status(403).json({
            message: "invalid credentials"
        })
        return
    }
    else{
        if (!process.env.JWT_SECRETE) {
            res.status(500).json({
                message: "JWT secret is not defined"
            });
            return;
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRETE);

        res.json({
            token
        })
    }
})


export {
    userRouter
}