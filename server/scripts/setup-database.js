const fs = require("node:fs")
const path = require("node:path")
const dotenv = require("dotenv")

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const { pool } = require("../config/db")

async function setupDatabase() {
    const [existingTables] = await pool.query(
        `SELECT TABLE_NAME
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE()`
    )
    const [applicationColumns] = await pool.query(
        `SELECT COLUMN_NAME
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'applications'`
    )
        const [keyColumns] = await pool.query(
                `SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE()
                     AND ((TABLE_NAME = 'users' AND COLUMN_NAME = 'id')
                         OR (TABLE_NAME = 'applications' AND COLUMN_NAME IN ('id', 'user_id'))
                         OR (TABLE_NAME = 'jobs' AND COLUMN_NAME = 'id'))`
        )

    if (process.argv.includes("--check")) {
        console.log(JSON.stringify({
            tables: existingTables.map((row) => row.TABLE_NAME),
            applicationColumns: applicationColumns.map((row) => row.COLUMN_NAME),
            keyColumns
        }, null, 2))
        return
    }

    const schema = fs.readFileSync(
        path.resolve(__dirname, "../database/schema.sql"),
        "utf8"
    )

    for (const statement of schema.split(";").map((item) => item.trim()).filter(Boolean)) {
        await pool.query(statement)
    }

    const [jobTypeColumn] = await pool.query(
        `SELECT COLUMN_NAME
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'applications'
           AND COLUMN_NAME = 'job_type'`
    )

    if (!jobTypeColumn.length) {
        await pool.query(
            "ALTER TABLE applications ADD COLUMN job_type VARCHAR(100) NULL AFTER salary"
        )
    }

    console.log("SkillBridge database schema is ready.")
}

setupDatabase()
    .catch((error) => {
        console.error("Database setup failed:", error.message)
        process.exitCode = 1
    })
    .finally(() => pool.end())