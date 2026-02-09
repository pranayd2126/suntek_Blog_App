import exp from "express"
import {config} from 'dotenv'
import mongoose from 'mongoose';

import {userRoute} from './APIs/UserApi.js'
import {authorRoute} from './APIs/AuthorApi.js'
import {adminRoute} from './APIs/AdminApi.js'
import cookieParser from "cookie-parser";

config();

const app=exp();
// add body parser middleware
app.use(exp.json())
app.use(cookieParser())



app.use('/users-api', userRoute)
app.use('/authors-api', authorRoute)
app.use('/admins-api', adminRoute)


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

app.post('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly: true, // must martch tr setting 
        secure:false,
        sameSite:'lax'

    })
})

//error handling midddle ware

app.use((err,req,res,next)=>{
    console.log("err:", err)
  res.status(500).json({
    message: "error",
    reason: err.message,
  });
})


