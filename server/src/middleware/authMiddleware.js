import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protectRoute=async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).send({
                error: 'No token provided',
            })

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).send({
                error: 'Invalid token',
            })
        }

        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).send({
                error: 'user not found',
            })
        }
        req.user=user;
        next();



    }catch(err){

        res.status(401).send({message:"Unauthorized"});
    }


}