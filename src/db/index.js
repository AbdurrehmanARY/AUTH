import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
 const connectDb=async()=>{
try{
    
    const connectionInstance=await mongoose.connect(
        `${process.env.MONGODB_URL}/${DB_NAME}`)
console.log(`mongodb connected successfully ${connectionInstance.connection.host}`)
// await mongoose.connect('mongodb://localhost:27017')
}
catch(error){
 console.log(  `mongoDB coonction failed ${error}`)   
}
 }
 export default connectDb