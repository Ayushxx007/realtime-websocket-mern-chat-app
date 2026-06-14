import { Router } from "express";
import {logout,login,signup,check,updateProfile} from "../controllers/authController.js";
import {protectRoute} from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const authRouter = Router();
authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.get("/check", check);
authRouter.post("/updateProfile",protectRoute,updateProfile);

export default authRouter;