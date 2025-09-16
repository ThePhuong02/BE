const WatchHistoryRepository = require("@repositories/watchHistoryRepository");

class WatchHistoryService {
  constructor() {
    this.watchHistoryRepo = new WatchHistoryRepository();
  }

  async logWatchHistory(userid, movieid) {   // 🔹 đổi tên thành logWatchHistory
    return await this.watchHistoryRepo.logWatchHistory(userid, movieid);
  }

  async getHistory(userid) {
    return await this.watchHistoryRepo.findByUser(userid);
  }
}

module.exports = WatchHistoryService;
