const express = require("express")

const protect = require("../middleware/auth-middleware")

const {
    createApplication,
    getApplications,
    updateApplication,
    deleteApplication
} = require("../controllers/application-controller")

const router = express.Router()

router.post("/", protect, createApplication)

router.get("/", protect, getApplications)

router.put("/:id", protect, updateApplication)

router.delete("/:id", protect, deleteApplication)

module.exports = router