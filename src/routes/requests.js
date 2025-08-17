const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");


const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];

        if(!allowedStatus.includes(status)){
            res.status(400).json({
                message:"Invalid status type",
                status,
            });
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message:"User Not Found",
            });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {toUserId,fromUserId},
                {toUserId:fromUserId,fromUserId:toUserId}
            ]
        })

        if(existingConnectionRequest){
            throw new Error("Already sent the request");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        const statusMessages = {
            interested: "is interested in the request of",
            ignored: "has ignored the request of"
        };

        res.json({
            message: `${req.user.firstName} ${statusMessages[status]} ${toUser.firstName}`,
            data
        });

    }
    catch(err){
        res.status(400).send("Somthing went wrong: " + err.message);
    }
    
    
})

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req, res)=>{
   try{

        const loggedInUser = req.user;
        const {status, requestId } = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus){
                return res.status(400).json({
                message:"Invalid status"
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            return res.status(404).json({
            message:"Connection request not found"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "connection request "+ status, data
        });
        
    }
    catch(err)
    {
        return res.status(404).send("Error: "+err.message);
    }
    
})

module.exports = requestRouter;