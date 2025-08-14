import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.log("Failed to connect to MongoDb: ", error)
        process.exit(1);
    }
}