const { pool } = require("../config/db")

const applyToJob = async (req, res) => {
    try {
        const userId = req.user.userId
        const jobId = req.params.jobId

        // Check if the job exists
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

        const job = jobs[0]

        // Check if the user already applied
        const [existingApplication] = await pool.execute(
            `SELECT id
             FROM applications
             WHERE user_id = ? AND job_id = ?`,
            [userId, jobId]
        )

        if (existingApplication.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already applied to this job"
            })
        }

        // Create the application
        const [result] = await pool.execute(
            `INSERT INTO applications
            (
                user_id,
                job_id,
                company,
                position,
                status,
                location,
                salary,
                job_url,
                applied_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
            [
                userId,
                jobId,
                job.company,
                job.title,
                "Applied",
                job.location,
                job.salary,
                job.job_url
            ]
        )

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            applicationId: result.insertId
        })
    } catch (error) {
        console.error("Apply to job error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

module.exports = {
    applyToJob
}