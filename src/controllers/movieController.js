const movieService = require("../services/movieService");
const watchHistoryService = require("../services/watchHistoryService");

// ================== Lấy tất cả phim ==================
const getAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  } catch (err) {
    console.error("getAllMovies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Lấy chi tiết phim ==================
const getMovieById = async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await movieService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("getMovieById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Lấy playback link ==================
const getPlaybackLink = async (req, res) => {
  try {
    const userId = req.user?.userid || null;
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const playback = await movieService.getPlaybackLink(movieId, userId);
    if (!playback) {
      return res.status(404).json({ message: "Playback link not found" });
    }

    if (playback.error) {
      return res.status(403).json({ message: playback.error });
    }

    if (userId) {
      await watchHistoryService.logWatchHistory(userId, movieId);
    }

    res.json(playback);
  } catch (err) {
    console.error("getPlaybackLink error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Stream phim trực tiếp ==================
const streamMovie = async (req, res) => {
  try {
    const userId = req.user?.userid || null;
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    if (userId) {
      await watchHistoryService.logWatchHistory(userId, movieId);
    }

    const streamed = await movieService.streamVideo(movieId, userId, req, res);
    if (!streamed) {
      return res.status(404).json({ message: "Movie stream not found" });
    }
  } catch (err) {
    console.error("streamMovie error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Tìm kiếm phim ==================
const searchMovies = async (req, res) => {
  try {
    let { query, page = 1, limit = 10 } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);

    const result = await movieService.searchMovies(query, page, limit);
    res.json(result);
  } catch (err) {
    console.error("searchMovies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Lấy danh sách thể loại theo movieId ==================
const getGenresByMovie = async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const genres = await movieService.getGenresByMovie(movieId);
    res.json(genres);
  } catch (error) {
    console.error("getGenresByMovie error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================== Lọc phim theo genreId ==================
const getMoviesByGenre = async (req, res) => {
  try {
    const genreId = Number(req.params.genreId);
    if (isNaN(genreId)) {
      return res.status(400).json({ message: "Invalid genre ID" });
    }

    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const result = await movieService.getMoviesByGenre(genreId, page, limit);
    res.json(result);
  } catch (err) {
    console.error("getMoviesByGenre error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getPlaybackLink,
  streamMovie,
  searchMovies,
  getGenresByMovie,
  getMoviesByGenre,
};
