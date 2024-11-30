import dotenv from 'dotenv';
import connectDb from './db/index.js';
import app from './app.js';
import express from 'express'
import cookieParser from 'cookie-parser';
import { User } from './models/user.model.js';
import { name } from 'ejs';
import jwt, { decode } from 'jsonwebtoken'
import bcrypt from "bcrypt";
dotenv.config();
app.use(express.urlencoded({extended:true }))
app.use(cookieParser())
app.set('view engine','ejs')


 //   connect to db
connectDb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
//          end of connection 

app.get('/',(req,res)=>{
    res.render('login')

})
// console.log(req.user)


//  register route


app.get('/register',(req,res)=>{
    res.render('register')
}
)
app.post('/register',async(req,res)=>{
 const {name,email,password}=req.body
 const hashedPassword=await bcrypt.hash(password,10)
const user =await User.create({
    name, 
    email,
     password:hashedPassword,
 })
 const cookie=jwt.sign({_id:user._id},'ARYOoossa')    
res.cookie('token',cookie)
res.redirect('/login')    

// create jwt token for cookie
//  const cookie=jwt.sign({_id:user._id},'ARYOoossa')    
//      const cook=res.cookie('token',cookie)

    })

    // end of register functionality



///  is Auth functionality

const isAuth=async(req,res,next)=>{
    const {token}=req.cookies
    if(token){
    // decode jwt cookie
    const decoded = jwt.verify(token,'ARYOoossa');
req.user = await User.findById(decoded._id);
console.log(req.user)
        next()
    
    }
    else{ return res.redirect('/login')}
}

//  login route
app.post('/login',isAuth,async(req,res)=>{
    const {email,password}=req.body
    const currentUser=await User.findOne({email})
console.log(req.user)

    const isMatch=bcrypt.compare(currentUser.password,password)
    if(!isMatch){
  return   res.redirect('/login')
    }
    else{
        return   res.render('logout')
    }
    })
    app.get('/login',(req,res)=>{
        res.render('login')   

    })
    //login end


app.get('/logout',(req,res)=>{
   
    console.log("logout",req.user)
res.cookie('token',null,{
    expires:new Date(Date.now())
})
    res.redirect('/register')    
})



