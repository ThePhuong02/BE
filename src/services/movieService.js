const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// Load Bunny config từ .env
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME;
const BUNNY_EMBED_BASE = process.env.BUNNY_EMBED_BASE;

// ================== Lấy tất cả phim ==================
const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movies ORDER BY movieid DESC");
  return result.rows;
};

// ================== Lấy chi tiết phim ==================
const getMovieById = async (id) => {
  const result = await pool.query("SELECT * FROM movies WHERE movieid = $1", [id]);
  return result.rows[0] || null;
};

// ================== Tìm kiếm phim ==================
const searchMovies = async (query, page, limit) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${query}%`;

  const result = await pool.query(
    `SELECT m.*
     FROM movies m
     LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
     LEFT JOIN genres g ON g.genreid = mg.genreid
     WHERE LOWER(m.title) LIKE LOWER($1)
        OR LOWER(m.description) LIKE LOWER($1)
        OR LOWER(g.name) LIKE LOWER($1)
     GROUP BY m.movieid
     ORDER BY m.year DESC
     LIMIT $2 OFFSET $3`,
    [searchTerm, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT m.movieid) AS total
     FROM movies m
     LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
     LEFT JOIN genres g ON g.genreid = mg.genreid
     WHERE LOWER(m.title) LIKE LOWER($1)
        OR LOWER(m.description) LIKE LOWER($1)
        OR LOWER(g.name) LIKE LOWER($1)`,
    [searchTerm]
  );

  return {
    movies: result.rows,
    total: parseInt(countResult.rows[0].total, 10),
    page,
    limit,
  };
};

// ================== Kiểm tra quyền user ==================
const checkUserAccess = async (userId, movie) => {
  if (!movie.ispremium) return true; // phim free thì ai cũng xem được
  if (!userId) return false; // chưa login thì chặn

  const result = await pool.query(
    `SELECT s.*, p.grantspremiumaccess
     FROM subscriptions s
     JOIN plans p ON s.planid = p.planid
     WHERE s.userid = $1 AND s.isactive = true AND s.enddate > NOW()
     ORDER BY s.enddate DESC LIMIT 1`,
    [userId]
  );

  const sub = result.rows[0];
  if (!sub) return false;

  return sub.grantspremiumaccess === true;
};

// ================== Lấy playback link ==================
const getPlaybackLink = async (movieId, userId) => {
  const movie = await getMovieById(movieId);
  if (!movie) return null;

  const hasAccess = await checkUserAccess(userId, movie);
  if (!hasAccess) {
    return { error: "Bạn cần gói PREMIUM để xem phim này" };
  }

  // Ưu tiên trả Bunny Embed nếu có playbackid
  if (movie.playbackid) {
    return {
      type: "bunny-embed",
      url: `${BUNNY_EMBED_BASE}/${BUNNY_LIBRARY_ID}/${movie.playbackid}`,
    };
  }

  // Nếu muốn trả direct link từ Bunny CDN
  if (movie.playbackid) {
    return {
      type: "direct",
      url: `https://${BUNNY_CDN_HOSTNAME}/${movie.playbackid}/play.mp4`,
    };
  }

  // Nếu chỉ có local file
  if (movie.videourl) {
    return {
      type: "direct",
      url: movie.videourl,
    };
  }

  return null;
};

// ================== Stream video trực tiếp (local) ==================
const streamVideo = async (movieId, userId, req, res) => {
  const movie = await getMovieById(movieId);
  if (!movie || !movie.videourl) return false;

  const hasAccess = await checkUserAccess(userId, movie);
  if (!hasAccess) {
    res.status(403).json({ message: "Bạn cần gói PREMIUM để xem phim này" });
    return false;
  }

  const videoPath = path.resolve(movie.videourl);
  if (!fs.existsSync(videoPath)) return false;

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send("Requested range not satisfiable");
      return false;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
    return true;
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
    return true;
  }
};

// ================== Lấy danh sách thể loại theo movieId ==================
const getGenresByMovie = async (movieId) => {
  const result = await pool.query(
    `SELECT g.*
     FROM genres g
     JOIN moviegenres mg ON g.genreid = mg.genreid
     WHERE mg.movieid = $1`,
    [movieId]
  );
  return result.rows;
};

// ================== Lấy danh sách phim theo genreId (có phân trang) ==================
const getMoviesByGenre = async (genreId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT m.*
     FROM movies m
     JOIN moviegenres mg ON m.movieid = mg.movieid
     WHERE mg.genreid = $1
     ORDER BY m.year DESC
     LIMIT $2 OFFSET $3`,
    [genreId, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM movies m
     JOIN moviegenres mg ON m.movieid = mg.movieid
     WHERE mg.genreid = $1`,
    [genreId]
  );

  return {
    movies: result.rows,
    total: parseInt(countResult.rows[0].total, 10),
    page,
    limit,
  };
};

module.exports = {
  getAllMovies,
  getMovieById,
  searchMovies,
  getPlaybackLink,
  streamVideo,
  getGenresByMovie,
  getMoviesByGenre,
};
