const MovieService = require("@services/movieService");

class MovieController {
    constructor() {
        this.movieService = new MovieService();
    }

    getAllMovies = async (req, res) => {
        try {
            const movies = await this.movieService.getAllMovies();
            res.json(movies);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };


    getMovieById = async (req, res) => {
        try {
            const movieid = Number(req.params.id);
            if (isNaN(movieid)) {
                return res.status(400).json({ message: "Invalid movie ID" });
            }

            const movie = await this.movieService.getMovieById(movieid);
            if (!movie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            res.json(movie);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    searchMovies = async (req, res) => {
        try {
            const { query, page = 1, limit = 10 } = req.query;
            if (!query || query.trim() === "") {
                return res.status(400).json({ message: "Query parameter is required" });
            }

            const result = await this.movieService.searchMovies(query, parseInt(page), parseInt(limit));
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    getMoviesByGenre = async (req, res) => {
        try {
            const genreid = Number(req.params.genreid);
            if (isNaN(genreid)) {
                return res.status(400).json({ message: "Invalid genre ID" });
            }

            const { page = 1, limit = 10 } = req.query;
            const result = await this.movieService.getMoviesByGenre(genreid, parseInt(page), parseInt(limit));
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    getPlaybackLink = async (req, res) => {
        try {
            const movieid = Number(req.params.id);
            if (isNaN(movieid)) {
                return res.status(400).json({ message: "Invalid movie ID" });
            }

            const result = await this.movieService.getPlaybackLink(movieid, req.user);

            if (result.error) {
                return res.status(result.status || 403).json({ message: result.error });
            }

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };
}

module.exports = new MovieController();
