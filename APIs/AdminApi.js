import exp from "express"
import { ArticleModel } from "../models/ArticicalModel.js"
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserTypeModel } from "../models/UserModel.js";

export  const adminRoute=exp.Router()


// write middile a=were to check admin role



//read all aritical
adminRoute.get('/articles',async (req,res)=>{
    let articles=await ArticleModel.find();
    res.status(200).send({message:"getting all articles",payload:articles});
})
//block uasr
adminRoute.put('/block-user/:userId', verifyToken, async(req,res)=>{


    //get user from the paras,m
    let {userId} = req.params;
    //find the find users and verifiy
    let user= await UserTypeModel.findById(userId)
    if(!user){
        res.status(404).send({message:
            "user not found"
        })
    }
    if(user.isActive== true){
    let updated= await UserTypeModel.findByIdAndUpdate(userId,{ $set:{"isActive":false}} ,{new:true})
    }
    else{
        res.status(400).send({message:"user is already blocked"})
    }
    res.status(200).send({message:"userd b;ocked"});
    // updates the the users
})


//unblock users

adminRoute.put('/unblock-user/:userId' ,verifyToken, async(req,res)=>{
    //get usedid from params
    let {userId} = req.params;
     let user= await UserTypeModel.findById(userId)
     if(!user){
        res.status(404).send({ message: "user not found" });
     }
     if(user.isActive== false){
     let updated= await UserTypeModel.findByIdAndUpdate(userId,{$set:{"isActive":true}},{new:true})
     }
     else{
        res.status(400).send({message:"user is already unblocked"})
     }
     res.status(200).send({message:"userd unb;ocked"});
})


