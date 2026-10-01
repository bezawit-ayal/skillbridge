const express = require("express")

const protect = require("../middleware/auth-middleware")

const {
    saveJob,
    unsaveJob,
    getSavedJobs
} = require("../controllers/saved-job-controller")

const router = express.Router()

router.post("/:jobId", protect, saveJob)

router.delete("/:jobId", protect, unsaveJob)

router.get("/", protect, getSavedJobs)

module.exports = router