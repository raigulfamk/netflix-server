import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path:'./config.env'
});
console.log("MONGO_URI value:", process.env.MONGO_URI);

const dbConnection = async () => {  
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB connected successfully");
    }).catch((error) => {
        console.log("MongoDB connection failed", error);
    } )
}
export default dbConnection;