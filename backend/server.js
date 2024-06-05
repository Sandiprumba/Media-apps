import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; //to upload the pictures

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware is a function it run between req and response
//THIS IS A BUILT IN MIDDLEWARE.. it allow to parse incoming data from the req object..req.body
app.use(express.json());
//TO PARSE FORM DATA FROM REQ.BODY EVEN IT THE REQ BODY HAS NESTED OBJECT ITS GONNA PARSE IT WITHOUT ANY PROBLEMS ..
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
