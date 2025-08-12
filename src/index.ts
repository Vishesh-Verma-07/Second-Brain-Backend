import express from 'express'
import dotenv from 'dotenv'
import { Router } from 'express'
import { userRouter } from './routes/user.routes'
import { contentRouter } from './routes/content.routes'
import { brainRouter } from './routes/brain.routes'
import { connectDb } from './db/connect'
import cookieParser from "cookie-parser";
import cors from 'cors'
import { HealthCheck } from './controller/healthCheck.controller'


dotenv.config()


const router = Router();

const app = express()
app.use(express.json())
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://secondbrain-vis.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.get("/", (req, res) => { 
    res.send("Welcome to the Second Brain API");
})

app.get("/api/v1/health", HealthCheck);
router.use('/api/v1/user', userRouter);
router.use('/api/v1/content', contentRouter);
router.use('/api/v1/brain', brainRouter);

app.use(router);


connectDb();
app.listen(3000)

