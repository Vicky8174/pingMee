
const bcrypt = require("bcrypt");
const User = require("../models/users");
const { validateSignUpData } = require("../utils/validations");
const authRouter = require('express').Router();


authRouter.post("/signup", async (req,res)=>{
    
    try{
    validateSignUpData(req);

    //encrypt the password 
    const {firstName, lastName, emailId, password} = req.body;
    const hashPassword =await bcrypt.hash(password,10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashPassword,

    });

    await user.save();
    res.send("user added successfully");
    }
    catch(err)
    {
        res.status(400).send("something went wrong: "+ err.message);
    }

});

authRouter.post("/login", async (req,res)=>{
    try{
        const{emailId,password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.isPasswordValid(password);
        if(isPasswordValid){
            
            const token = await user.getJWT();
            res.cookie("token",token);
            res.send("Login successfully");

        }
        else{
            throw new Error("Invalid credentials");
        }

    }catch(err){ 
        res.status(400).send("something went wrong: "+ err.message);
    }
   
})

authRouter.post("/logout",async (req,res)=>{
    try{
        res.clearCookie("token")
        .send("logout successfully");
    }
    catch(err){
        res.status(400).send("something went wrong: "+ err.message)
    }
})

    

module.exports = authRouter;