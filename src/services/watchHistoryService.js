const pool = require('../config/db');

// ✅ Lưu lịch sử xem
const logWatchHistory = async (userId, movieId) => {
    const now = new Date();
    await pool.query(
        `INSERT INTO watch_history (user_id, movie_id, watched_at) 
         VALUES ($1, $2, $3)`,
        [userId, movieId, now]
    );
};

module.exports = {
    logWatchHistory
};
