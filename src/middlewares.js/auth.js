const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req,res,next)=>{

   try{ 
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid Token!!!!!!");
        }

        const decodeObj = await jwt.verify(token,"21BCS$3217");
        const{_id} = decodeObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }
        
        req.user = user;
        next();
    }
    catch(err){ 
        res.status(400).send("something went wrong: "+ err.message);
    }

}


module.exports = {userAuth}