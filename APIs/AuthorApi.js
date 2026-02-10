import exp from "express"
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticicalModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { authenticate, register } from "../services/authServices.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export  const authorRoute=exp.Router()


//rigister author(public route)
authorRoute.post("/users",async(req,res)=>{
    //get user obj from req body
    let userObj=req.body;
    //call registration service
    const newUserObj= await register({...userObj,role:"AUTHOR"});
//send response
    res.status(201).json({message:"author register successfully",payload:newUserObj})
    

})

//create article by author (protected route)
authorRoute.post('/articles' ,verifyToken, checkAuthor, async(req,res)=>{
    //get article data from req body
    const article=req.body;

    //check for author
    // let author= await UserTypeModel.findById(article.author);
    // if(!author|| author.role!=="AUTHOR"){
    //     res.status(401).send({message:"author not valid"});
    // }
    //create article document
    let  newArticle= new ArticleModel(article);
    //validate
  
    //save
    let created= await newArticle.save();

    //send response
    res.status(201).json({message:"article created successfully",payload:created})


})

//view  read articical by author(protected route)
authorRoute.get('/articles/:authorId',verifyToken, checkAuthor, async(req,res)=>{
    //get autherid
     const aid = req.params.authorId;

     // check author
    //  const author = await UserTypeModel.findById(aid);
    //  if (!author || author.role !== "AUTHOR") {
    //    return res.status(401).send({ message: "author not valid" });
    //  }

     // read articles by this author
    const articles = await ArticleModel.find({
      author: aid,
      isArticleActive: true,
    }).populate("author", "firstName lastName email");
     // send response
     return res.status(200).send({
       message: "articles found",
       payload: articles,
     });


});
//edit articical(protected route)
authorRoute.put('/articles',verifyToken, checkAuthor, async(req,res)=>{
 //   get mdefied data from body
 const { title, content, articleId, author,category } = req.body;
// console.log("articel:", req.body)
    //get article id from params
    //const articleId=articleId;
    //find aritical
    const isExist=await ArticleModel.findOne({_id:articleId,author:author});
    if(!isExist){
        res.status(404).send({message:"article not found"})
    }
    //check the aritcail is published by authie receved from cleint or not


 //update the articical
 const updated=await ArticleModel.findByIdAndUpdate(articleId,{$set:{title,content,category}},{new:true})
 //send response
 res.status(200).json({message:"article updated successfully",payload:updated})
})

//delete  (soft)articical(protected route)
authorRoute.delete('/articles/:articleId',verifyToken, checkAuthor, async(req,res)=>{
    //get article id from params
    const articleId=req.params.articleId;
    //find article
    const isExist=await ArticleModel.findById(articleId);
    if(!isExist){
        res.status(404).send({message:"article not found"});
    }
    //delete article (soft delete)
    const deleted=await ArticleModel.findByIdAndUpdate(articleId,{$set:{isArticleActive:false}},{new:true})
    //send response
    res.status(200).json({message:"article deleted successfully",payload:deleted})
})

//undo the soft deleted articical(protected route)
