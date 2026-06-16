import {Router} from "express";
import {protectRoute} from "../middleware/authMiddleware.js";
import {getUsersforSideBar,getMessages,sendMessage} from "../controllers/messageController.js";
import Message from "../models/message.js";


const messageRouter = Router();


messageRouter.get("/users", protectRoute,getUsersforSideBar);
messageRouter.get("/:id", protectRoute,getMessages);
messageRouter.post("/send/:id", protectRoute,sendMessage);











export default messageRouter;