import jwt, { decode } from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided."
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid Token. Please login."
            })
        }

        const user = await User.findById(decodedToken.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server error while updating the profile Pic."
        })
    }
}