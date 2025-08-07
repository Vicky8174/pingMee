const express = require("express");
const { userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");


const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){ 
        res.status(400).send("something went wrong: "+ err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid fields for edit");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) =>{loggedInUser[key] = req.body[key]});
        res.send("Profile updated successfully");
        await loggedInUser.save();

    }
    catch(err){
        return res.status(400).send(err.message);
    }

})
module.exports = profileRouter;