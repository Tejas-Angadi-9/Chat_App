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

        if (newUser) {

        }
        else {
            res.status(400).json({
                success: false,
                message: "Invalid user data"
            })
        }
    }
    catch (error) {

    }

}

export const login = (req, res) => {
    res.send("Login route");
}

export const logout = (req, res) => {
    res.send("Logout route");
}