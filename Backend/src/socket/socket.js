import { Server } from 'socket.io';
import { generateResponse, generateVector } from "../services/ai.service.js";
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cookie from 'cookie';
import { createVector, queryMemory } from "../services/vector.service.js";
import jwt from 'jsonwebtoken';



async function connectsocket(httpserver) {
    const io = new Server(httpserver, {
        cors: {
            origin: 'http://localhost:5174',
            methods: ['GET', 'POST'],
            credentials: true
        },
    });

    io.use(async (socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        if (!cookies.token) {
            return next(new Error("User not authenticated"));
        }
        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            socket.user = user
            next()

        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    })


    io.on("connection", (socket) => {

        console.log(`User connected: ${socket.user.email}`);
        socket.on("ai-message", async (messagePayload) => {


            const [message, vectors] = await Promise.all([
                Message.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                }),
                generateVector(messagePayload.content),
            ])


            await createVector({
                messageId: message._id,
                vectors: vectors,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })
            // console.log("Message and vectors created successfully.")


            const [memory, chatHistory] = await Promise.all([

                queryMemory({
                    queryVector: vectors,
                    limit: 3,
                    metadata: {
                        user: socket.user._id
                    }
                }),

                Message.find({
                    chat: messagePayload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().then(messages => messages.reverse())
            ])

            const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            })

            const ltm = [
                {
                    role: "user",
                    parts: [{
                        text: `

                        these are some previous messages from the chat, use them to generate a response

                        ${memory.map(item => item.metadata.text).join("\n")}

                        ` }]
                }
            ]


            const response = await generateResponse([...ltm, ...stm])




            socket.emit('ai-response', {
                content: response,
                chat: messagePayload.chat
            })

            const [responseMessage, responseVectors] = await Promise.all([
                Message.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                }),
                generateVector(response)
            ])

            await createVector({
                messageId: responseMessage._id,
                vectors: responseVectors,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })

        })

    })
}
export default connectsocket;