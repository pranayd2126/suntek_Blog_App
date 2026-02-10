import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {UserTypeModel} from '../models/UserModel.js';

//regisration function

// the request is sent from the api from api this function is calees

export const register =async (userObj)=>{
    //cretae the document 
    const userDoc= new UserTypeModel(userObj);
    //validete for empity
    await userDoc.validate()
    //hash and repace the password 
    userDoc.password = await bcrypt.hash(userDoc.password,10);
    //save
    const created=await userDoc.save();
    //conver doc to obj to removie passowrd
    const newUserObj=created.toObject();
    //remove password
    delete newUserObj.password;
    //return thr userObj WITH OUT PASSWORD
    return newUserObj;



}
//authenticate function

export const authenticate =async ({email,password})=>{
    //check user with email & role
    
    const user= await UserTypeModel.findOne({email});
    if(!user){
        const err=new Error("Invalid email");
        err.status=401;
        throw err;
    }
    //omapre Passwords
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err=new Error("Invalid password");
        err.status=401;
        throw err;
    }
    //genrate token
    const token=jwt.sign({userId:user._id,role:user.role,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"});
    const userObj=user.toObject();
    delete userObj.password;

    return {token,user:userObj};

};