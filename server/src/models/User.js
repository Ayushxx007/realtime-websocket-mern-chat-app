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
        required: function () {
            return this.authProvider === "local";
        },
        minlength: 6,
        validate: {
            validator: validator.isStrongPassword,
            message: "Please provide a Strong Password",
        }

    },
    profilePic:{
        type: String,
        default:"",

    },
    googleId: {
        type: String
    },

    authProvider: {
        type: String,
        default: "local"
    }

},{ timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;