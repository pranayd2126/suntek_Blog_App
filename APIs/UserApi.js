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
userRoute.get("/users/articles", verifyToken, async (req, res) => {


    
    const articles= await ArticleModel.find();
     res.status(200).send({message:"all articles",payload:articles})


});
//comment on articical

 userRoute.post("/users/comments", verifyToken, async (req, res) => {
//     //get articaleid froms parama
    
//     let{  articleId,userId,comment} = req.body;
//     //check the role of the userd
//     let article= await ArticleModel.findById(articleId)

//     if(!article){
//         res.status(404).send({message:"article nor found "})
//     }
//     await ArticleModel.findByIdAndUpdate(articleId, {$push:{"comment":{comment}}},{new:true})
//     res.status(200).send({message:"comment added successfully"})
     
    
//     //verrfriy aritials existes 
//     //
      const { articleId, comment } = req.body;

      // user id from token (set inside verifyToken)
      const userId = req.user.id;

      // check article exists
      const article = await ArticleModel.findById(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // add comment
      await ArticleModel.findByIdAndUpdate(articleId, {
        $push: {
          comments: {
            userId,
            comment,
          },
        },
      });

      res.status(200).json({ message: "Comment added successfully" });

});

