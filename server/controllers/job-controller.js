const { pool } = require("../config/db")

const getJobs = async (req, res) => {
    try {
        const { search, location, job_type } = req.query

        let query = `
            SELECT *
            FROM jobs
            WHERE 1 = 1
        `

        const values = []

        if (search) {
            query += `
                AND (
                    title LIKE ?
                    OR company LIKE ?
                )
            `

            values.push(`%${search}%`, `%${search}%`)
        }

        if (location) {
            query += ` AND location LIKE ?`
            values.push(`%${location}%`)
        }

        if (job_type) {
            query += ` AND job_type = ?`
            values.push(job_type)
        }

        query += ` ORDER BY created_at DESC`

        const [jobs] = await pool.execute(query, values)

        res.json({
            success: true,
            jobs
        })
    } catch (error) {
        console.error("Get jobs error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id

        const [jobs] = await pool.execute(
            "SELECT * FROM jobs WHERE id = ?",
            [jobId]
        )

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        res.json({
            success: true,
            job: jobs[0]
        })
    } catch (error) {
        console.error("Get job error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


module.exports = {
    getJobs,
    getJobById
}