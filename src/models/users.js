const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    emailId:{
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+ value);
            }
        }
       
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("try a strong password"+ value);
            }
        }
    },
    age:{
        type: Number,
        min: 18,
       
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
    },
    about:{
        type: String,
        default:"this is default about message",
    },
    profilePic:{
        type: String,
        default: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL"+ value);
            }
        }
    },
    skills:{
        type: [String],
    }
},{
    timestamps: true,
})

userSchema.methods.getJWT = async function () {
    const user  = this;
    const token = await jwt.sign({_id:user._id}, "21BCS$3217",
    {expiresIn:"60d"})

    return token;
}

userSchema.methods.isPasswordValid = async function (passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;