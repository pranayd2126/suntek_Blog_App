import jwt from "jsonwebtoken";
export const verifyToken=(req,res,next)=>{
    //get token from cookie request
    let token=req.cookies.token;
   // console.log("token:", token)
    if(token===undefined){
        return res.status(400).json({message:"token not found plz login"})
    }
    let decoded=jwt.verify(token,process.env.SECRET_KEY);
    next();

    //verify the validity of token (decding the toekn)

    //forward the request to next  route

}