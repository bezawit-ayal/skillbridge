const express = require("express")
const protect = require("../middleware/auth-middleware")
const { applyToJob } = require("../controllers/apply-job-controller")

const router = express.Router()

router.post("/:jobId", protect, applyToJob)

module.exports = router