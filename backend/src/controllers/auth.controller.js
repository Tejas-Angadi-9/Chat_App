import cloudinary from "../libs/cloudinary.js";
import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fill all fields"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        })
    }

    try {
        const user = await User.findOne({ email });
        // Exisiting user?
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please login."
            })
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })


        const { password: _password, ...userWithoutPassword } = newUser.toObject();
        if (newUser) {
            // generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                message: "User created Successfully!",
                data: userWithoutPassword
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Invalid user data"
            })
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server while creating a new user"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fill all fields"
        })
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        await generateToken(user._id, res);
        const { password: _password, createdAt, updatedAt, ...userWithoutPassword } = user.toObject();
        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            data: userWithoutPassword
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server while logging in."
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")

        res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server while logging out."
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile pic is required."
            })
        }
        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "Chat-App"
        });
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        res.status(200).json({
            success: true,
            message: "Successfully updated the user's profile pic.",
            data: updatedUser
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            data: "Internal server error while updating the profile pic."
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User is authenticated and authorized",
            data: req.user
        })
    }
    catch (error) {
        console.error("Error in check auth controller: ", error.message);
        res.status(500).json({
            success: false,
            message: err.message,
            data: "Internal server error while checking the authication and authorization access for the user"
        })
    }
}