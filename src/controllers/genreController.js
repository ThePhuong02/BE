const pool = require('../config/db');
const GenreDTO = require('../dto/GenreDTO');

const getAllGenres = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM genres ORDER BY genreid ASC');
        const genres = result.rows.map(g => new GenreDTO(g));
        res.json(genres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM genres WHERE genreid=$1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        res.json(new GenreDTO(result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMoviesByGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT m.* FROM movies m
            JOIN moviegenres mg ON m.movieid = mg.movieid
            WHERE mg.genreid = $1
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows); // bạn có thể wrap bằng MovieDTO nếu đã làm model
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const addGenre = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Genre name must not be null or empty' });
        }
        if (name.length > 100) {
            return res.status(400).json({ message: 'Genre name must be less than 100 characters' });
        }

        const insert = await pool.query(
            'INSERT INTO genres(name) VALUES($1) RETURNING *',
            [name]
        );

        res.json(new GenreDTO(insert.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const update = await pool.query(
            'UPDATE genres SET name=$1 WHERE genreid=$2 RETURNING *',
            [name, id]
        );

        if (update.rows.length === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        res.json(new GenreDTO(update.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;

        const del = await pool.query(
            'DELETE FROM genres WHERE genreid=$1 RETURNING *',
            [id]
        );

        if (del.rows.length === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        res.json({ message: `Deleted genre with ID: ${id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    getAllGenres,
    getGenreById,
    getMoviesByGenre,
    addGenre,
    updateGenre,
    deleteGenre
};
