import { Router } from "express";
import {logout,login,signup,check} from "../controllers/authController.js";
import dotenv from "dotenv";
dotenv.config();

const authRouter = Router();
authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.get("/check", check);

export default authRouter;