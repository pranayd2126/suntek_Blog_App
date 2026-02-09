import { UserTypeModel } from "../models/UserModel.js";

export const checkAuthor=async (req,res,next)=>{
    //check for author in req body
    let aid=req.body?.author|| req.params?.authorId;
   
    
//check for author
    let author= await UserTypeModel.findById(aid);
    //id author not found
    if(!author){
        res.status(401).send({message:"authobhhhr not valid"});
    }
    // if author found but role is not author
    if(author.role!=="AUTHOR"){
        res.status(403).send({message:"user is not author"});
    }
    //if author is blocked
    if(author.isActive===false){
        res.status(403).send({message:"author is blocked"});
    }

    next();
}