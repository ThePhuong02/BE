const AppDataSource = require("@config/data-source");
const User = require("@entities/User");

class UserRepository {
  constructor() {
    // ✅ dùng entity object
    this.repo = AppDataSource.getRepository(User);
  }

  async findByEmail(email) {
    return await this.repo.findOneBy({ email });
  }

  async createUser(userData) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findById(id) {
    return await this.repo.findOneBy({ userid: id });
  }
}

module.exports = new UserRepository();
