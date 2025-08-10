const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accept","reject"],
            message: '{VALUE} is not a valid status'
        }
    }
    
},{
    timestamps: true,
})

connectionRequestSchema.index({toUserId: 1, fromUserId: 1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send a friend request to yourself");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema);
module.exports= ConnectionRequestModel;