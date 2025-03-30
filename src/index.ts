import express from 'express'
import z from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ContentModel, LinkModel, UserModel } from './db'
import mongoose from 'mongoose'
const JWT_SECRETE = "jasdklfjawofnwaeoign"
import { auth } from './middleware'
import { random } from './utils'

const app = express()
app.use(express.json())


app.post("/api/v1/signup", async (req, res) => {

    const requriedBody = z.object({
        username: z.string().min(3, {message: "username is too small"}).max(100, {message: "username is too long"}),
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

    const {username, password} = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 5);
        console.log(hashedPassword)
        await UserModel.create({
            username, 
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

app.post("/api/v1/signin", async (req, res) =>{
    const {username, password} = req.body;

    const user = await UserModel.findOne({
        username
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
        const token = jwt.sign({userId: user._id}, JWT_SECRETE);

        res.json({
            token
        })
    }
})


app.post("/api/v1/content", auth, async (req, res) =>{
    const {link, type } = req.body;
    const userId = req.userId;

    const content = await ContentModel.create({
        link,
        userId,
        type
    })

    if(content){
        res.json(content)
    }
})

app.delete("/api/v1/content", auth, async (req, res) =>{
    const userId= req.userId;
    const contentId = req.body.contentId;
    try {
        const content = await ContentModel.deleteOne({
            userId,
            contentId
        })
        res.json({
            message: "content"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "coudnt delete"
            
        })
    }

 
})

app.get("/api/v1/content", auth, async (req, res) =>{
    const userId= req.userId;
    try {
        const content = await ContentModel.find({
            userId,
        }).populate("userId", "-password")
        res.json(content)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "coudnt find entry"
            
        })
    }

 
})


app.post("/api/v1/brain/share", auth, async (req, res) =>{
    const share = req.body.share
    console.log(share)
    if(share){

        const existingLink = await LinkModel.findOne({
            userId: req.userId
        })

        if(existingLink){
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            userId: req.userId,
            hash
        })
        res.json({
           hash
        })
        return;
    }
    else{
        await LinkModel.deleteOne({
            userId: req.userId
        })
        res.json({
            message: "link disabled succssfuly"
        })
        return;
    }

})
app.get("/api/v1/brain/:shareLink", async (req, res) =>{
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    })

    if(!link){
        res.status(411).json({
            message: "this brain doesnt exit"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    }).populate("userId", '-password');

    res.json({
        content
    })



})



async function connectDb() {
    await mongoose.connect("mongodb+srv://vishesh:vishesh123@cluster0.o1khkyo.mongodb.net/secondBrain");
    app.listen(3000)
    console.log("listening on port 3000")
}

connectDb();
