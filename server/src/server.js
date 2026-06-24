import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3001;


const server = app.listen(port, async() => {
        await connectDB();
    console.log(`Server started on port ${port}`);
});

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);