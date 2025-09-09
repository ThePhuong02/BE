const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// ================== Public APIs ==================
router.get("/", movieController.getAllMovies);             // Lấy danh sách phim
router.get("/search", movieController.searchMovies);       // Tìm kiếm phim
router.get("/by-genre/:genreId", movieController.getMoviesByGenre); // Lọc theo thể loại
router.get("/:id", movieController.getMovieById);          // Lấy chi tiết phim
router.get("/:id/genres", movieController.getGenresByMovie); // Lấy danh sách thể loại của 1 phim

// ================== Yêu cầu login ==================
router.get("/:id/play", authenticateToken, movieController.getPlaybackLink); // Lấy link phát phim
router.get("/:id/stream", authenticateToken, movieController.streamMovie);   // Stream phim trực tiếp

module.exports = router;
