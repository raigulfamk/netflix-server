import express from 'express';  
import dotenv from 'dotenv';
import dbConnection from './utils/dbConnection.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';


dbConnection()

dotenv.config({
    path:'./config.env'
})

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests from the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies) to be sent
}))

//api 

app.use('/api/v1/user', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}  );