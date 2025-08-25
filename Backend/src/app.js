import express from "express";
import dotenv from "dotenv";
import connection from "./db/connection.js"
import cookieParser from "cookie-parser";
import userrouter from "./routes/user.route.js";
import chatrouter from "./routes/chat.route.js"
import cors from "cors"
const app = express();

// Configurations
dotenv.config();
connection()


// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())



// Routes
app.use("/users", userrouter);
app.use("/chats", chatrouter);


// Default Route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;