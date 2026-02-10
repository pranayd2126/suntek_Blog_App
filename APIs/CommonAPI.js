import exp from "express"
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticicalModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { authenticate, register } from "../services/authServices.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middlewares/verifyToken.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export  const commonRoute=exp.Router()






//login
commonRoute.post("/login",async(req,res)=>{
  let userCred=req.body;
    // authenticate users
    let {token ,user}= await authenticate(userCred)
    ;
    //save the token n httponly
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:'lax',
        secure:false
    })
    res.status(200).json({message:"user authenticated successfully",payload:{user}})
})
//lougout
commonRoute.get("/logout",async (req, res) => {
  //clear the token cookie
  res.clearCookie("token", {
    httpOnly: true, // must martch tr setting
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "user logged out successfully" });
});

//chnage password
commonRoute.put("/change-password",verifyToken,async(req,res)=>{
  //get current password and new password
   let{ email,oldPassword,newPassword}= req.body;
   let user =await UserTypeModel.findOne({email});
   if(!user){
     return res.status(404).send({message:"user not found"})
    }


  //chenck the current password is correct ot not 
  const isMatch=await bcrypt.compare(oldPassword,user.password);
  if(!isMatch){
    return res.status(401).send({message:"invalid current password"})
  }

  //replace currect with the new password
  newPassword=await bcrypt.hash(newPassword,10);

  let updated= await UserTypeModel.findOneAndUpdate(
    { email },{$set:{password:newPassword}},{new:true  })
    const newUserObj=updated.toObject();
    delete newUserObj.password;
    res.status(200).json({message:"password changed successfully",payload:newUserObj})
//send response

  
})


  
