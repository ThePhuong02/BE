const WatchHistoryService = require("@services/watchHistoryService");
const watchHistoryService = new WatchHistoryService();

// ✅ Ghi lịch sử xem
const logWatch = async (req, res) => {
  try {
    const userid = req.user?.userid;
    const { movieid } = req.body;
    if (!userid || !movieid) {
      return res.status(400).json({ message: "userid and movieid are required" });
    }

    const record = await watchHistoryService.logWatch(userid, movieid);
    res.status(201).json(record);
  } catch (error) {
    console.error("❌ Error logWatch:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Lấy lịch sử xem
const getHistory = async (req, res) => {
  try {
    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ message: "Unauthorized" });

    const history = await watchHistoryService.getHistory(userid);
    res.json(history);
  } catch (error) {
    console.error("❌ Error getHistory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { logWatch, getHistory };
