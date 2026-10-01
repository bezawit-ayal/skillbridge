const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const { connectDB } = require("./config/db")
const { pool } = require("./config/db")
const authRoutes = require("./routes/auth-routes")
const testRoutes = require("./routes/test-routes")
const applicationRoutes = require("./routes/application-routes")
const jobRoutes = require("./routes/job-routes")
const savedJobRoutes = require("./routes/saved-job-routes")
const applyJobRoutes = require("./routes/apply-job-routes")
const userDataRoutes = require("./routes/user-data-routes")

const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: "2mb" }))
app.use("/api/auth", authRoutes)
app.use("/api/test", testRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/saved-jobs", savedJobRoutes)
app.use("/api/apply", applyJobRoutes)
app.use("/api/user-data", userDataRoutes)


app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1")
        res.json({ success: true, message: "SkillBridge API is ready" })
    } catch {
        res.status(503).json({
            success: false,
            message: "Database is unavailable"
        })
    }
})

const PORT = Number(process.env.PORT) || 5000

async function startServer() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be configured")
    }
    await connectDB()
    app.listen(PORT, () => {
        console.log(`SkillBridge server running on port ${PORT}`)
    })
}

startServer().catch((error) => {
    console.error("SkillBridge startup failed:", error.message)
    process.exitCode = 1
})