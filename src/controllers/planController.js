const planService = require("../services/planService");

// Lấy danh sách tất cả gói
const getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    res.json(plans);
  } catch (error) {
    console.error("❌ Error getAllPlans:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy chi tiết gói theo ID
const getPlanById = async (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    if (isNaN(planId)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    const plan = await planService.getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error("❌ Error getPlanById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
};
