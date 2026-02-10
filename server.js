import exp from "express"
import {config} from 'dotenv'
import mongoose from 'mongoose';

import {userRoute} from './APIs/UserApi.js'
import {authorRoute} from './APIs/AuthorApi.js'
import {adminRoute} from './APIs/AdminApi.js'
import cookieParser from "cookie-parser";
import { commonRoute } from "./APIs/CommonAPI.js";

config();

const app=exp();
// add body parser middleware
app.use(exp.json())
app.use(cookieParser())

//mount routes

app.use('/users-api', userRoute)
app.use('/authors-api', authorRoute)
app.use('/admins-api', adminRoute)
app.use('/common-api', commonRoute)

//connect to db and start the server


const connectDB= async ()=>{
    try{
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log(" db connect")
        app.listen(process.env.PORT,()=>{
            console.log(`server is running on port ${process.env.PORT}`)
        })
    }

    catch(err){
        console.log(err ,"db not connected")
    }

}
connectDB();
//handle 404 
//route not found
app.use((req,res,next)=>{
    res.json({message:`${req.url} route not found`})
})

//error handling midddle ware

app.use((err,req,res,next)=>{
    console.log("err:", err)
  res.status(500).json({
    message: "error",
    reason: err.message,
  });
})


