// src/routes/movieRoutes.js
const express = require("express");
const router = express.Router();
const movieController = require("@controllers/movieController");
const { authenticateToken } = require("@middlewares/authMiddleware");

// Public
router.get("/", movieController.getAllMovies);
router.get("/search", movieController.searchMovies);
router.get("/by-genre/:genreid", movieController.getMoviesByGenre);

// Protected (cần login)
router.get("/:id/play", authenticateToken, movieController.getPlaybackLink);

// Public (cái này để cuối cùng)
router.get("/:id", movieController.getMovieById);


module.exports = router;
