const movieService = require('../services/movieService');

const assignGenresToMovie = async (req, res) => {
    try {
        const movieId = Number(req.body.movieId);
        if (isNaN(movieId)) return res.status(400).json({ message: "Invalid movie ID" });

        const genreIds = req.body.genreIds.map(Number);
        if (genreIds.some(isNaN)) return res.status(400).json({ message: "Invalid genre IDs" });

        await movieService.assignGenresToMovie(movieId, genreIds);
        res.json({ message: "Genres assigned to movie successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const addGenreToMovie = async (req, res) => {
    try {
        const movieId = Number(req.params.movieId);
        const genreId = Number(req.params.genreId);
        if (isNaN(movieId) || isNaN(genreId)) return res.status(400).json({ message: "Invalid ID" });

        await movieService.addGenreToMovie(movieId, genreId);
        res.json({ message: "Genre added to movie." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeGenreFromMovie = async (req, res) => {
    try {
        const movieId = Number(req.params.movieId);
        const genreId = Number(req.params.genreId);
        if (isNaN(movieId) || isNaN(genreId)) return res.status(400).json({ message: "Invalid ID" });

        await movieService.removeGenreFromMovie(movieId, genreId);
        res.json({ message: "Genre removed from movie." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getGenresByMovie = async (req, res) => {
    try {
        const movieId = Number(req.params.movieId);
        if (isNaN(movieId)) return res.status(400).json({ message: "Invalid movie ID" });

        const genres = await movieService.getGenresByMovie(movieId);
        res.json(genres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    assignGenresToMovie,
    addGenreToMovie,
    removeGenreFromMovie,
    getGenresByMovie
};
