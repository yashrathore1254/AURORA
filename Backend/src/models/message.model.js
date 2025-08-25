import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model", "system"],
        default: "user"
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

export default Message;