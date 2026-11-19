const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get(
    "/admin",
    authenticate,
    authorize("Admin"),
    (req, res) => {
        res.json({
            message: "Admin access granted",
            user: req.user
        });
    }
);

module.exports = router;