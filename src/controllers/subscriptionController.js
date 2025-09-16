const subscriptionService = require("@services/subscriptionService");

// ================== Lấy gói hiện tại ==================
const getCurrentSubscription = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sub = await subscriptionService.getCurrentSubscription(userid);
    return res.json({ success: true, data: sub });
  } catch (error) {
    console.error("❌ Error getCurrentSubscription:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================== Đăng ký gói mới ==================
const createSubscription = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { planId, paymentId, durationDays } = req.body;
    if (!planId) return res.status(400).json({ success: false, message: "planId is required" });

    const newSub = await subscriptionService.createSubscription(
      userid,
      planId,
      durationDays || null, // để service tự lấy từ bảng plans nếu null
      paymentId || null
    );

    res.status(201).json({ success: true, data: newSub });
  } catch (error) {
    console.error("❌ Error createSubscription:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================== Hủy gói ==================
const cancelSubscription = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ success: false, message: "Unauthorized" });

    const canceled = await subscriptionService.cancelSubscription(userid);

    if (!canceled) {
      return res.status(404).json({ success: false, message: "No active subscription found" });
    }

    res.json({ success: true, message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("❌ Error cancelSubscription:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
};
