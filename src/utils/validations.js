const validator = require("validator");


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

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "about",
        "profilePic",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every((fields)=>
         allowedEditFields.includes(fields)
    );
    return isEditAllowed;

}
    
module.exports = {
    validateSignUpData,
    validateEditProfileData
};
