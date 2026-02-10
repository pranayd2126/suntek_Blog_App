import exp from "express"
import { authenticate, register } from "../services/authServices.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { ArticleModel } from "../models/ArticicalModel.js";

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

//read all active articical

userRoute.get("/users/articles", verifyToken, async (req, res) => {


    
    const articles= await ArticleModel.find();
     res.status(200).send({message:"all articles",payload:articles})


});

//comment on articical

 userRoute.post("/comments", verifyToken, async (req, res) => {
  //get article id,comment and user from req body
   const {articleId,comment,user}=req.body;
//check if article exist or not

   let article= await ArticleModel.findById(articleId);
//if article not exist send 404
   if(!article){
    return res.status(404).json({message:"article not found"})
   }
   //update the article by pushing the comment in comments
   let updated=await ArticleModel.findByIdAndUpdate(articleId,{$push:{comments:{comment,user}}},{new:true})
//send response
   res.status(200).json({message:"comment added successfully",payload:updated})
// 
});

