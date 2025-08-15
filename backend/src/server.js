import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { dbConnect } from "./libs/db.js";

dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

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