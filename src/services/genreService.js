const genreRepository = require("@repositories/genreRepository");

class GenreService {
  async getAllGenres() {
    return await genreRepository.findAll();
  }

  async getGenreById(id) {
    return await genreRepository.findById(id);
  }

  async addGenre(data) {
    return await genreRepository.createGenre(data);
  }

  async updateGenre(id, data) {
    return await genreRepository.updateGenre(id, data);
  }

  async deleteGenre(id) {
    return await genreRepository.deleteGenre(id);
  }
}

module.exports = new GenreService();
