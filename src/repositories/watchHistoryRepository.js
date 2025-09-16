const AppDataSource = require("@config/data-source");
const WatchHistory = require("@entities/WatchHistory");

class WatchHistoryRepository {
  constructor() {
    this.repo = AppDataSource.getRepository(WatchHistory);
  }

  // ✅ Lưu lịch sử xem
  async logWatchHistory(userid, movieid) {
    const record = this.repo.create({
      userid: userid,
      movieid: movieid,
      watchedat: new Date(),
    });
    return await this.repo.save(record);
  }

  // ✅ Lấy lịch sử xem của 1 user
  async findByUser(userid) {
    return await this.repo.find({
      where: { userid: userid },
      relations: ["movie"],
      order: { watchedat: "DESC" },
    });
  }
}

module.exports = WatchHistoryRepository;
