import express from "express";
import protectRoute from "../Middleware/protectRoute.js";
import { getConversations, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
