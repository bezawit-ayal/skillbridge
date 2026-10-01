const express = require("express")
const protect = require("../middleware/auth-middleware")

const router = express.Router()

router.get("/protected", protect, (req, res) => {
    res.json({
        success: true,
        message: "You can access this protected route",
        user: req.user
    })
})

module.exports = router