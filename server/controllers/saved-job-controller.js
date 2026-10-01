const { pool } = require("../config/db")

const saveJob = async (req, res) => {
    try {
        const userId = req.user.userId
        const jobId = req.params.jobId

        const [jobs] = await pool.execute(
            "SELECT id FROM jobs WHERE id = ?",
            [jobId]
        )

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        const [existingSavedJob] = await pool.execute(
            `SELECT id
             FROM saved_jobs
             WHERE user_id = ? AND job_id = ?`,
            [userId, jobId]
        )

        if (existingSavedJob.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Job is already saved"
            })
        }

        await pool.execute(
            `INSERT INTO saved_jobs (user_id, job_id)
             VALUES (?, ?)`,
            [userId, jobId]
        )

        res.status(201).json({
            success: true,
            message: "Job saved successfully"
        })
    } catch (error) {
        console.error("Save job error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


const unsaveJob = async (req, res) => {
    try {
        const userId = req.user.userId
        const jobId = req.params.jobId

        const [result] = await pool.execute(
            `DELETE FROM saved_jobs
             WHERE user_id = ? AND job_id = ?`,
            [userId, jobId]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found"
            })
        }

        res.json({
            success: true,
            message: "Job removed from saved jobs"
        })
    } catch (error) {
        console.error("Unsave job error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.userId

        const [jobs] = await pool.execute(
            `SELECT
                jobs.*,
                saved_jobs.created_at AS saved_at
             FROM saved_jobs
             INNER JOIN jobs
                ON saved_jobs.job_id = jobs.id
             WHERE saved_jobs.user_id = ?
             ORDER BY saved_jobs.created_at DESC`,
            [userId]
        )

        res.json({
            success: true,
            jobs
        })
    } catch (error) {
        console.error("Get saved jobs error:", error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


module.exports = {
    saveJob,
    unsaveJob,
    getSavedJobs
}