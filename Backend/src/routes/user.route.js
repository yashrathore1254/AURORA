import express from "express"
import { createUser, login } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/profile", authMiddleware, (req, res) => {
    req.user.password = undefined;
    return res.status(200).json({ user: req.user });
})

export default router;