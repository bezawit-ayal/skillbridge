const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { pool } = require("../config/db")

const register = async (req, res) => {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : ""
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : ""
        const { password } = req.body

        if (!name || !email || typeof password !== "string" || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            })
        }

        const [existingUsers] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        )

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        )

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name,
                email
            }
        })
    } catch (error) {
        console.error("Register error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


const login = async (req, res) => {
    try {
        const email = typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : ""
        const { password } = req.body

        if (!email || typeof password !== "string" || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const [users] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        )

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const user = users[0]

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("LOGIN ERROR:")
        console.error(error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


module.exports = {
    register,
    login
}