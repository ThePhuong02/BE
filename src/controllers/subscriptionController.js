const subscriptionService = require("../services/subscriptionService");

// ================== Lấy gói hiện tại ==================
const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user?.userid; // giả sử middleware JWT đã gắn user vào req
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const sub = await subscriptionService.getCurrentSubscription(userId);
    return res.json(sub);
  } catch (error) {
    console.error("❌ Error getCurrentSubscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== Đăng ký gói mới ==================
const createSubscription = async (req, res) => {
  try {
    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { planId, paymentId } = req.body;
    if (!planId) return res.status(400).json({ message: "planId is required" });

    // giả sử FE gửi kèm durationDays, nếu không có thì mình lấy theo plans table
    const { durationDays } = req.body;

    const newSub = await subscriptionService.createSubscription(
      userId,
      planId,
      durationDays || 30,
      paymentId || null
    );

    res.status(201).json(newSub);
  } catch (error) {
    console.error("❌ Error createSubscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== Hủy gói ==================
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const canceled = await subscriptionService.cancelSubscription(userId);

    if (!canceled) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("❌ Error cancelSubscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
};
