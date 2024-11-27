import dotenv from 'dotenv';
import connectDb from './db/index.js';
import app from './app.js';
import express from 'express'
import cookieParser from 'cookie-parser';
import { User } from './models/user.model.js';
import { name } from 'ejs';


dotenv.config();


app.use(express.urlencoded({extended:true }))
app.use(cookieParser())
connectDb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
app.set('view engine','ejs')

const isAuth=(req,res,next)=>{
    const {token}=req.cookies
   

    if(token){next()}
    else{res.render('login')}
}

app.get('/',isAuth,(req,res)=>{
res.render("logout")
})


// login functionality 
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
   const user =await User.create({
        email,
        password,
    })
    
    res.cookie('token',user._id)
    console.log(user._id)
    // console.log(req.cookies)

res.redirect('/')    
    })

// logout functionality 

    app.get('/logout',(req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now())
    })

        res.redirect('/')    

    })
   


    