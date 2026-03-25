const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/dashboard", dashboardController.renderDashboard);

router.get("/profile", authMiddleware, dashboardController.getProfile);

router.put("/update-charity", authMiddleware, dashboardController.updateCharity);

router.get("/winnings-data", authMiddleware, dashboardController.getWinnings);

module.exports = router;