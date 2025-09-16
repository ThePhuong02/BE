const express = require("express");
const router = express.Router();
const genreController = require("@controllers/genreController");
const { authenticateToken, isAdmin } = require("@middlewares/authMiddleware");

// Public APIs
router.get("/", (req, res) => genreController.getAllGenres(req, res));
router.get("/:id", (req, res) => genreController.getGenreById(req, res));

// Admin APIs
router.post("/", authenticateToken, isAdmin, (req, res) => genreController.addGenre(req, res));
router.put("/:id", authenticateToken, isAdmin, (req, res) => genreController.updateGenre(req, res));
router.delete("/:id", authenticateToken, isAdmin, (req, res) => genreController.deleteGenre(req, res));

module.exports = router;
