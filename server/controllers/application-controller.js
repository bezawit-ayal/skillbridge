const { pool } = require("../config/db")

const createApplication = async (req, res) => {
    try {
        const userId = req.user.userId
        const {
            company,
            position,
            status,
            location,
            salary,
            job_type,
            job_url,
            notes,
            applied_date
        } = req.body

        if (!company || !position) {
            return res.status(400).json({
                success: false,
                message: "Company and position are required"
            })
        }

        const [result] = await pool.execute(
            `INSERT INTO applications
            (user_id, company, position, status, location, salary, job_type, job_url, notes, applied_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                company,
                position,
                status || "Applied",
                location || null,
                salary || null,
                job_type || null,
                job_url || null,
                notes || null,
                applied_date || null
            ]
        )

        res.status(201).json({
            success: true,
            message: "Application created successfully",
            application: {
                id: result.insertId,
                user_id: userId,
                company,
                position,
                status: status || "Applied",
                location,
                salary,
                job_type,
                job_url,
                notes,
                applied_date
            }
        })
    } catch (error) {
        console.error("Create application error:", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const getApplications = async (req, res) => {
    try {
        const [applications] = await pool.execute(
            `SELECT *
             FROM applications
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.userId]
        )

        res.json({ success: true, applications })
    } catch (error) {
        console.error("Get applications error:", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const updateApplication = async (req, res) => {
    try {
        const userId = req.user.userId
        const applicationId = req.params.id
        const {
            company,
            position,
            status,
            location,
            salary,
            job_type,
            job_url,
            notes,
            applied_date
        } = req.body

        const [existingApplications] = await pool.execute(
            `SELECT id
             FROM applications
             WHERE id = ? AND user_id = ?`,
            [applicationId, userId]
        )

        if (existingApplications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        await pool.execute(
            `UPDATE applications
             SET company = ?,
                 position = ?,
                 status = ?,
                 location = ?,
                 salary = ?,
                 job_type = ?,
                 job_url = ?,
                 notes = ?,
                 applied_date = ?
             WHERE id = ? AND user_id = ?`,
            [
                company,
                position,
                status,
                location || null,
                salary || null,
                job_type || null,
                job_url || null,
                notes || null,
                applied_date || null,
                applicationId,
                userId
            ]
        )

        res.json({
            success: true,
            message: "Application updated successfully"
        })
    } catch (error) {
        console.error("Update application error:", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const deleteApplication = async (req, res) => {
    try {
        const [result] = await pool.execute(
            `DELETE FROM applications
             WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.userId]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        res.json({
            success: true,
            message: "Application deleted successfully"
        })
    } catch (error) {
        console.error("Delete application error:", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

module.exports = {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
}