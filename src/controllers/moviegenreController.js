const MovieService = require("@services/movieService");

class MovieGenreController {
    constructor() {
        this.movieService = new MovieService();
    }

    // Gán nhiều thể loại cho 1 phim
    assignGenresToMovie = async (req, res) => {
        try {
            // const movieid = Number(req.body.movieid);
            // const genreIds = req.body.genreIds.map(Number);

            // Tạm thời bỏ gọi service
            // await this.movieService.assignGenresToMovie(movieid, genreIds);

            res.json({ message: "👉 API assignGenresToMovie tạm thời chưa được implement." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    };


    // Thêm 1 thể loại vào phim
    addGenreToMovie = async (req, res) => {
        try {
            const movieid = Number(req.params.movieid);
            const genreid = Number(req.params.genreid);
            if (isNaN(movieid) || isNaN(genreid)) return res.status(400).json({ message: "Invalid ID" });

            await this.movieService.addGenreToMovie(movieid, genreid);
            res.json({ message: "Genre added to movie." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    };

    // Xóa 1 thể loại khỏi phim
    removeGenreFromMovie = async (req, res) => {
        try {
            const movieid = Number(req.params.movieid);
            const genreid = Number(req.params.genreid);
            if (isNaN(movieid) || isNaN(genreid)) return res.status(400).json({ message: "Invalid ID" });

            await this.movieService.removeGenreFromMovie(movieid, genreid);
            res.json({ message: "Genre removed from movie." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    };

    // Lấy danh sách thể loại của phim
    getGenresByMovie = async (req, res) => {
        try {
            const movieid = Number(req.params.movieid || req.params.id);
            if (isNaN(movieid)) return res.status(400).json({ message: "Invalid movie ID" });

            const genres = await this.movieService.getGenresByMovie(movieid);
            res.json(genres);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new MovieGenreController();
