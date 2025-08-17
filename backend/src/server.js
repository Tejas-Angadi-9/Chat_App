import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { dbConnect } from "./libs/db.js";
import morgan from "morgan"
import cors from "cors"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server is live on ${PORT} port.`)
    dbConnect();
})

//* Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Running"
    })
})