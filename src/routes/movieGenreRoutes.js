const express = require('express');
const router = express.Router();
const movieGenreController = require('@controllers/movieGenreController');
const { authenticateToken, isAdmin } = require('@middlewares/authMiddleware');

// Gán nhiều thể loại cho 1 phim
router.post('/assign', authenticateToken, isAdmin, movieGenreController.assignGenresToMovie);

// Thêm 1 thể loại vào phim
router.post('/:movieid/add-genre/:genreid', authenticateToken, isAdmin, movieGenreController.addGenreToMovie);

// Xóa 1 thể loại khỏi phim
router.delete('/:movieid/remove-genre/:genreid', authenticateToken, isAdmin, movieGenreController.removeGenreFromMovie);

// Lấy danh sách thể loại của 1 phim
router.get('/:movieid/genres', movieGenreController.getGenresByMovie);

module.exports = router;
