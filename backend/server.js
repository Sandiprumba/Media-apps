import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; //to upload the pictures
import { app, server } from "./socket/socket.js";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import job from "./cron/cron.js";

dotenv.config();
connectDB();
job.start();

const PORT = process.env.PORT || 3006;
const __dirname = path.resolve();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware is a function it run between req and response
//THIS IS A BUILT IN MIDDLEWARE.. it allow to parse incoming data from the req object..req.body
app.use(express.json({ limit: "50mb" }));
//TO PARSE FORM DATA FROM REQ.BODY EVEN IT THE REQ BODY HAS NESTED OBJECT ITS GONNA PARSE IT WITHOUT ANY PROBLEMS ..
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

//http://localhost:3006 => backend ..make both in one server
//http://localhost:3000 => frontend
//if same url wouldnt have cors issue

//CONVERT BACKEND AND FRONTEND SAME URL
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
