import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;


const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

