import express from 'express'
import dotenv from 'dotenv'
import { Router } from 'express'
import { userRouter } from './routes/user.routes'
import { contentRouter } from './routes/content.routes'
import { brainRouter } from './routes/brain.routes'
import { connectDb } from './db/connect'
import cors from 'cors'


dotenv.config()


const router = Router();

const app = express()
app.use(express.json())

app.use(cors({
    origin: "*"
}))

app.get("/", (req, res) => { 
    res.send("Welcome to the Second Brain API");
})
router.use('/api/v1/user', userRouter);
router.use('/api/v1/content', contentRouter);
router.use('/api/v1/brain', brainRouter);

app.use(router);


connectDb();
app.listen(3000)

