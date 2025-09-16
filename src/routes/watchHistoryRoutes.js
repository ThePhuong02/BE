const express = require("express");
const router = express.Router();
const watchHistoryController = require("@controllers/watchHistoryController");
const { authenticateToken } = require("@middlewares/authMiddleware");

router.post("/log", authenticateToken, watchHistoryController.logWatch);
router.get("/my-history", authenticateToken, watchHistoryController.getHistory);

module.exports = router;
