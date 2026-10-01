const mysql = require("mysql2/promise")

const requiredDatabaseConfig = ["DB_HOST", "DB_USER", "DB_NAME"]
const missingDatabaseConfig = requiredDatabaseConfig.filter(
    (key) => !process.env[key]
)

if (missingDatabaseConfig.length) {
    throw new Error(`Missing database configuration: ${missingDatabaseConfig.join(", ")}`)
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const connectDB = async () => {
    try {
        const connection = await pool.getConnection()

        console.log("MySQL connected successfully")

        connection.release()
    } catch (error) {
        console.error("MySQL connection failed:", error.message)
        throw error
    }
}

module.exports = {
    pool,
    connectDB
}