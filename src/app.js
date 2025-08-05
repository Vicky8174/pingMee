const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/users");
const { validateSignUpData } = require('./utils/validations');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares.js/auth")


const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res)=>{
    // console.log(req.body)
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

app.post("/login", async (req,res)=>{
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

app.get("/profile",userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){ 
        res.status(400).send("something went wrong: "+ err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    
    const user = req.user;
    res.send(user.firstName +" "+ user.lastName + " sent you a friend request");
})

connectDB()
    .then(()=>{
        console.log("connected to the database")
        app.listen(3000,()=>{
        console.log("hello from server");
})
    })
    .catch((err) => {
        console.error("Connection error:", err);
});

