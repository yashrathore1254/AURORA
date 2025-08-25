import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChat, getChats, getMessages } from "../controllers/chat.controller.js";
import express from "express"
const router = express.Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);
router.get("/messages/:id", authMiddleware, getMessages);

export default router;