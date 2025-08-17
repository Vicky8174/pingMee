const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName profilePic age gender about skills";


const userRouter = express.Router();

userRouter.get("/user/connections/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA);

        res.json({
            message:"data fetched successfully",
            data: connectionRequests
        })


    }
    catch(err){
        res.status(400).send("Error! " + err.message);
    }
})

userRouter.get("/user/connections",userAuth, async (req,res)=>{
    
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]  
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const connections = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }   
            return row.fromUserId}
        
        );

        res.json({data: connections});
    }
    catch(err){
        res.status(400).send("ERROR! "+ err.message);
    }
})

module.exports = userRouter;

