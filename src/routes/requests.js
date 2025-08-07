const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    
    const user = req.user;
    res.send(user.firstName +" "+ user.lastName + " sent you a friend request");
    
})

module.exports = requestRouter;