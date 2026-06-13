import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './lib/db.js';
import authRouter from "./routes/authRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;


const server = app.listen(port, async() => {
        await connectDB();
    console.log(`Server started on port ${port}`);
});

app.use("/api/auth", authRouter);