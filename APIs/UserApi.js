import exp from "express"
import { authenticate, register } from "../services/authServices.js";

export  const userRoute=exp.Router()


//rigister user

userRoute.post("/users",async(req,res)=>{
    //get user obj from req body
    let userObj=req.body;
    //call registration service
    const newUserObj= await register({...userObj,role:"USER"});
//send response
    res.status(201).json({message:"user register successfully",payload:newUserObj})
    

})

//authenticate user
userRoute.post("/authenticate",async(req,res)=>{
    //get user creddentials from req body
     let userCred=req.body;
    // authenticate users
    let {token ,user}= await authenticate(userCred)
    
    //save the token n httponly
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:'lax',
        secure:false
    })
    res.status(200).json({message:"user authenticated successfully",payload:{user}})
})

//read all active articical
//comment on articical

