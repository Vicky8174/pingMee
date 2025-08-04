const validator = require("validator")

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter a valid name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email Id is not valid");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Try a strong password");
    }

    
};
module.exports = {validateSignUpData};
