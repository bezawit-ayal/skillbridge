const { pool } = require("../config/db")

const parseJson = (value) => {
    if (typeof value !== "string") return value
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

const getProfile = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT profile_data FROM user_profiles WHERE user_id = ?",
            [req.user.userId]
        )
        res.json({ success: true, profile: parseJson(rows[0]?.profile_data) || null })
    } catch (error) {
        console.error("Get profile error:", error)
        res.status(500).json({ success: false, message: "Could not load profile" })
    }
}

const saveProfile = async (req, res) => {
    try {
        const profile = req.body
        if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
            return res.status(400).json({ success: false, message: "Profile data is required" })
        }

        await pool.execute(
            `INSERT INTO user_profiles (user_id, profile_data)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE profile_data = VALUES(profile_data), updated_at = CURRENT_TIMESTAMP`,
            [req.user.userId, JSON.stringify(profile)]
        )
        res.json({ success: true, profile })
    } catch (error) {
        console.error("Save profile error:", error)
        res.status(500).json({ success: false, message: "Could not save profile" })
    }
}

const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT settings_data FROM user_settings WHERE user_id = ?",
            [req.user.userId]
        )
        res.json({ success: true, settings: parseJson(rows[0]?.settings_data) || null })
    } catch (error) {
        console.error("Get settings error:", error)
        res.status(500).json({ success: false, message: "Could not load settings" })
    }
}

const saveSettings = async (req, res) => {
    try {
        const settings = req.body
        if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
            return res.status(400).json({ success: false, message: "Settings data is required" })
        }

        await pool.execute(
            `INSERT INTO user_settings (user_id, settings_data)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE settings_data = VALUES(settings_data), updated_at = CURRENT_TIMESTAMP`,
            [req.user.userId, JSON.stringify(settings)]
        )
        res.json({ success: true, settings })
    } catch (error) {
        console.error("Save settings error:", error)
        res.status(500).json({ success: false, message: "Could not save settings" })
    }
}

const getInterviews = async (req, res) => {
    try {
        const [interviews] = await pool.execute(
            `SELECT id, application_id, type, date, time, duration,
                    meeting_url, notes, status
             FROM interviews
             WHERE user_id = ?
             ORDER BY date ASC, time ASC`,
            [req.user.userId]
        )
        res.json({ success: true, interviews })
    } catch (error) {
        console.error("Get interviews error:", error)
        res.status(500).json({ success: false, message: "Could not load interviews" })
    }
}

const validateApplication = async (applicationId, userId) => {
    if (!applicationId) return true
    const [rows] = await pool.execute(
        "SELECT id FROM applications WHERE id = ? AND user_id = ?",
        [applicationId, userId]
    )
    return rows.length > 0
}

const saveInterview = async (req, res) => {
    try {
        const {
            application_id,
            type,
            date,
            time,
            duration,
            meeting_url,
            notes,
            status
        } = req.body

        if (!date || !time || !type) {
            return res.status(400).json({ success: false, message: "Type, date, and time are required" })
        }
        if (!(await validateApplication(application_id, req.user.userId))) {
            return res.status(400).json({ success: false, message: "Choose one of your applications" })
        }

        const [result] = await pool.execute(
            `INSERT INTO interviews
             (user_id, application_id, type, date, time, duration, meeting_url, notes, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.userId,
                application_id || null,
                type,
                date,
                time,
                Number(duration) || 60,
                meeting_url || null,
                notes || null,
                status || "Upcoming"
            ]
        )
        res.status(201).json({
            success: true,
            interview: { id: result.insertId, ...req.body }
        })
    } catch (error) {
        console.error("Save interview error:", error)
        res.status(500).json({ success: false, message: "Could not save interview" })
    }
}

const updateInterview = async (req, res) => {
    try {
        const {
            application_id,
            type,
            date,
            time,
            duration,
            meeting_url,
            notes,
            status
        } = req.body
        if (!date || !time || !type) {
            return res.status(400).json({ success: false, message: "Type, date, and time are required" })
        }
        if (!(await validateApplication(application_id, req.user.userId))) {
            return res.status(400).json({ success: false, message: "Choose one of your applications" })
        }

        const [existing] = await pool.execute(
            "SELECT id FROM interviews WHERE id = ? AND user_id = ?",
            [req.params.id, req.user.userId]
        )
        if (!existing.length) {
            return res.status(404).json({ success: false, message: "Interview not found" })
        }

        await pool.execute(
            `UPDATE interviews
             SET application_id = ?, type = ?, date = ?, time = ?, duration = ?,
                 meeting_url = ?, notes = ?, status = ?
             WHERE id = ? AND user_id = ?`,
            [
                application_id || null,
                type,
                date,
                time,
                Number(duration) || 60,
                meeting_url || null,
                notes || null,
                status || "Upcoming",
                req.params.id,
                req.user.userId
            ]
        )
        res.json({ success: true, message: "Interview updated successfully" })
    } catch (error) {
        console.error("Update interview error:", error)
        res.status(500).json({ success: false, message: "Could not update interview" })
    }
}

const deleteInterview = async (req, res) => {
    try {
        const [result] = await pool.execute(
            "DELETE FROM interviews WHERE id = ? AND user_id = ?",
            [req.params.id, req.user.userId]
        )
        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: "Interview not found" })
        }
        res.json({ success: true, message: "Interview deleted successfully" })
    } catch (error) {
        console.error("Delete interview error:", error)
        res.status(500).json({ success: false, message: "Could not delete interview" })
    }
}

module.exports = {
    getProfile,
    saveProfile,
    getSettings,
    saveSettings,
    getInterviews,
    saveInterview,
    updateInterview,
    deleteInterview
}