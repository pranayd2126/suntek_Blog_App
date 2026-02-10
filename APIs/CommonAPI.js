import exp from "express"
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticicalModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { authenticate, register } from "../services/authServices.js";
import cookieParser from "cookie-parser";
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