import express from "express"
import authRoutes from "./routes/auth.route.js"

const app = express();
app.use(express.json())
app.use("/api/auth", authRoutes)

app.listen(5001, () => {
    console.log("Server is live on 5001 port.")
})

//* Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Running"
    })
})