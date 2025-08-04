const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/users");
const { validateSignUpData } = require('./utils/validations');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


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

app.get("/profile", async(req,res)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            throw new Error("Invalid Token! Please SignIn again.")
        }
        const decodedMessage = await jwt.verify(token,"21BCS$3217");
        const {_id} = decodedMessage;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }

        res.send(user);
    }
    catch(err){ 
        res.status(400).send("something went wrong: "+ err.message);
    }
})

app.post("/login", async (req,res)=>{
    try{


        const{emailId,password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){

            const token = await jwt.sign({_id:user._id}, "21BCS$3217")
            

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

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({})
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong")
    }  
})

app.delete("/users", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.body.id);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.send(deletedUser);
    } 
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.patch("/users", async (req, res) => {
    const { emailId, ...data } = req.body;

    try {
    const ALLOWED_UPDATES = ["firstName", "photoUrl", "about", "gender", "age", "skills"]; 

    const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));

    if (!isUpdateAllowed) {
        return res.status(400).send("Update not allowed");
    }
    if(data.skills.length > 10){
        throw new Error("skills cannot be more than 10")
    }

    const updateUser = await User.findOneAndUpdate(
        { emailId },
        data,
        {
            new: true, 
            runValidators: true
        }
        );

        if (!updateUser) {
            return res.status(404).send("User not found");
        }

        res.send(updateUser);
    } catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message);
    }
});


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

