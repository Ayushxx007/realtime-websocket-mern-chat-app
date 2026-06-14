import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Correct format Email is required",
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: validator.isStrongPassword,
            message: "Please provide a Strong Password",
        }

    },
    profilePic:{
        type: String,
        default:"",

    }
},{ timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;