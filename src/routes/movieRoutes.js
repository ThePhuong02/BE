const express = require("express");
const router = express.Router();
const movieController = require("@controllers/movieController");
const { authenticateToken, isAdmin } = require("@middlewares/authMiddleware");

// Public
router.get("/", movieController.getAllMovies);
router.get("/search", movieController.searchMovies);
router.get("/by-genre/:genreid", movieController.getMoviesByGenre);
router.get("/:id", movieController.getMovieById);

// Protected (cần login)
router.get("/:id/play", authenticateToken, movieController.getPlaybackLink);
router.get("/:id/stream", authenticateToken, movieController.streamMovie);

// Admin only
router.post("/", authenticateToken, isAdmin, movieController.createMovie);
router.put("/:id", authenticateToken, isAdmin, movieController.updateMovie);
router.delete("/:id", authenticateToken, isAdmin, movieController.deleteMovie);

module.exports = router;
