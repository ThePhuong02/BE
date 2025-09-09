const express = require('express');
const router = express.Router();
const movieGenreController = require('../controllers/moviegenreController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Gán nhiều thể loại cho 1 phim
router.post('/assign', authenticateToken, isAdmin, movieGenreController.assignGenresToMovie);

// Thêm 1 thể loại vào phim
router.post('/:movieId/add-genre/:genreId', authenticateToken, isAdmin, movieGenreController.addGenreToMovie);

// Xóa 1 thể loại khỏi phim
router.delete('/:movieId/remove-genre/:genreId', authenticateToken, isAdmin, movieGenreController.removeGenreFromMovie);

// Lấy danh sách thể loại của phim
router.get('/:movieId/genres', movieGenreController.getGenresByMovie);

// Lấy genres theo movieId
router.get("/:id/genres", movieGenreController.getGenresByMovie);

module.exports = router;
