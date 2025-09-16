const AppDataSource = require("@config/data-source");
const Genre = require("@entities/Genre");

class GenreRepository {
  constructor() {
    this.repo = AppDataSource.getRepository(Genre);
  }

  async findAll() {
    return await this.repo.find({ order: { genreid: "ASC" } });
  }

  async findById(id) {
    return await this.repo.findOneBy({ genreid: id });
  }

  async createGenre(data) {
    const genre = this.repo.create(data);
    return await this.repo.save(genre);
  }

  async updateGenre(id, data) {
    await this.repo.update({ genreid: id }, data);
    return await this.findById(id);
  }

  async deleteGenre(id) {
    return await this.repo.delete({ genreid: id });
  }
}

module.exports = new GenreRepository();
