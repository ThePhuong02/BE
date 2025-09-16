const express = require("express");
const router = express.Router();
const planController = require("@controllers/planController");

// GET: danh sách tất cả gói
router.get("/", planController.getAllPlans);

// GET: chi tiết 1 gói theo ID
router.get("/:id", planController.getPlanById);

module.exports = router;
