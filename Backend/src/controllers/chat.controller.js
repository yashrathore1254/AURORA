import Chat from "../models/chat.model.js"
import Message from "../models/message.model.js";

export async function createChat(req, res) {

    const { title } = req.body;
    const user = req.user;

    const chat = await Chat.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });

}

export async function getChats(req, res) {
    const user = req.user;

    const chats = await Chat.find({ user: user._id });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))

    });
}

export async function getMessages(req, res) {

    const chatId = req.params.id;

    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages: messages
    })

}