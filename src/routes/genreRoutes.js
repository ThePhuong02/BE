const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// ==================== Public APIs ====================
router.get('/', genreController.getAllGenres);              // Lấy danh sách thể loại
router.get('/:id', genreController.getGenreById);           // Lấy thể loại theo ID
router.get('/:id/movies', genreController.getMoviesByGenre); // Lấy danh sách phim theo thể loại

// ==================== Admin APIs ====================
router.post('/', authenticateToken, isAdmin, genreController.addGenre);    // Thêm thể loại
router.put('/:id', authenticateToken, isAdmin, genreController.updateGenre); // Cập nhật thể loại
router.delete('/:id', authenticateToken, isAdmin, genreController.deleteGenre); // Xóa thể loại

module.exports = router;
