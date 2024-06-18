import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPost, getUserPost } from "../controllers/postController.js";
import protectRoute from "../Middleware/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
