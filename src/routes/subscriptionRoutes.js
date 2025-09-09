const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// GET: gói hiện tại của user
router.get("/current", subscriptionController.getCurrentSubscription);

// POST: đăng ký gói mới
router.post("/subscribe", subscriptionController.createSubscription);

// POST: hủy gói
router.post("/cancel", subscriptionController.cancelSubscription);

module.exports = router;
