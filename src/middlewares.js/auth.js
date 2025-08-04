const adminAuth = (req,res,next)=>{
    console.log("admin is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xxyz";

    if(!isAdminAuthorized){
        res.status(401).send("admin is unauthorized");
    }else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    console.log("user is getting checked");
    const token = "abc";
    const isUserAuthorized = token === "abc";

    if(!isUserAuthorized){
        res.status(401).send("user is unauthorized");
    }else{
        next();
    }
}

module.exports = {adminAuth,userAuth}