import mongoose from "mongoose";

async function connection() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");

    } catch (error) {
        console.log(error)
    }
}

export default connection;
