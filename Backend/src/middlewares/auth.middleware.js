import jwt from "jsonwebtoken";
import User from "../models/user.model.js"


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Error in auth middleware:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
