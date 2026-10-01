const express = require("express")
const protect = require("../middleware/auth-middleware")
const {
    getProfile,
    saveProfile,
    getSettings,
    saveSettings,
    getInterviews,
    saveInterview,
    updateInterview,
    deleteInterview
} = require("../controllers/user-data-controller")

const router = express.Router()
router.use(protect)

router.get("/profile", getProfile)
router.put("/profile", saveProfile)
router.get("/settings", getSettings)
router.put("/settings", saveSettings)
router.get("/interviews", getInterviews)
router.post("/interviews", saveInterview)
router.put("/interviews/:id", updateInterview)
router.delete("/interviews/:id", deleteInterview)

module.exports = router