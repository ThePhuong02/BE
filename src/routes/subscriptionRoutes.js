const express = require("express");
const router = express.Router();
const subscriptionController = require("@controllers/subscriptionController");
const { authenticateToken } = require("@middlewares/authMiddleware");

router.get("/current", authenticateToken, subscriptionController.getCurrentSubscription);
router.post("/subscribe", authenticateToken, subscriptionController.createSubscription);
router.post("/cancel", authenticateToken, subscriptionController.cancelSubscription);

module.exports = router;
