import validator from "validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import {generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from "google-auth-library";



export const login=async(req,res)=>{
try{
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const user= await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"Invalid credentials",
        })
    }

    const isPasswordCorrect=await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
        return res.status(401).send({
            message:"Invalid credentials",
        })
    }

    generateToken(user._id,res);

    return res.status(200).send({
        message:"Successfully logged in",
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    });

}catch(err){
    console.log("error in login route",err);
    return res.status(500).send({
        message:"Internal Server ERROR",
    })
}



}

export const signup=async(req,res)=>{


    try{

        const {fullName,email,password} = req.body;

        if (!fullName?.trim()) {
            return res.status(400).json({
                message: "Full name is required",
            });
        }


        if(!password){
            return res.status(400).send({message:"password is required"});
        }
        if(!email){
            return res.status(400).send({message:"email is required"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).send({message:"Invalid email format"});
        }
        if(!validator.isStrongPassword(password)){
            return res.status(400).send({message:"Password is not strong enough"});
        }

        const user=await User.findOne({email});


        if(user){
            return res.status(400).send({message:"Email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
         const newUser= new User({password:hashedPassword,email:email,fullName:fullName});

         if(newUser) {
             await newUser.save();
             generateToken(newUser._id,res);

             return res.status(201).json({
                 message:"successfully Signed up",
                 _id:newUser._id,
                 fullName:newUser.fullName,
                 email:newUser.email,
                 profilePic:newUser.profilePic,
             });

         }else{
             return res.status(400).send({message:"Invalid user data"});
         }

    }catch(err){
        console.log("error in signup route",err);
        return res.status(500).send({message:"Internal Server Error"});
    }


}

export const logout=async(req,res)=>{

    try{

        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
        });
      return  res.status(200).json({message:"Successfully logged out"});
    }catch(err){
        console.log("error in logout route",err);
        return res.status(500).send({message:"Internal Server Error"});
    }


}

export const check=async(req,res,next)=>{

    try{
        const user=req.user;
        return res.status(200).json({user:user});



    }catch{
        console.log("Error in checkAuth Controller");
        return res.status(500).send({"internal server error":"Server Error"});

    }

    try{
        res.send({message:"check"});
    }catch(err){
        console.log("error in check route",err);
    }

}


export const updateProfile=async(req,res)=>{

    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).send({message:"ProfilePic is required"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");



        return res.status(200).json(updatedUser);

    }catch(err){
        console.log("error in updatePorfile route",err);
        return res.status(500).send({message:"Internal Server Error"});
    }

}



const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {

    try {

        const { credential } = req.body;

        const ticket =
            await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });

        const payload = ticket.getPayload();

        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;

        let user =
            await User.findOne({ email });

        if (!user) {

            user = await User.create({
                fullName:name,
                email,
                googleId,
                authProvider: "google"
            });

        }

        generateToken(user._id,res);


        return res.json({
            success: true,
            user
        });

    } catch (err) {

        console.error("Google Login Error:", err);

        return res.status(401).json({
            success: false,
            message: err.message
        });

    }
};
