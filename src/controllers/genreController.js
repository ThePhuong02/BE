const genreService = require("@services/genreService");

class GenreController {
  async getAllGenres(req, res) {
    try {
      const genres = await genreService.getAllGenres();
      res.json(genres);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  async getGenreById(req, res) {
    try {
      const { id } = req.params;
      const genre = await genreService.getGenreById(id);

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }
      res.json(genre);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  async addGenre(req, res) {
    try {
      const { name } = req.body;
      if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Genre name must not be empty" });
      }

      const genre = await genreService.addGenre({ name });
      res.json(genre);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  async updateGenre(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updated = await genreService.updateGenre(id, { name });
      if (!updated) {
        return res.status(404).json({ message: "Genre not found" });
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  async deleteGenre(req, res) {
    try {
      const { id } = req.params;
      const result = await genreService.deleteGenre(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: "Genre not found" });
      }

      res.json({ message: `Deleted genre with ID: ${id}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}

module.exports = new GenreController();
