const AppDataSource = require("@config/data-source");
const Movie = require("@entities/Movie");
const fs = require("fs");
const path = require("path");

class MovieRepository {
    constructor() {
        this.repo = AppDataSource.getRepository(Movie);
    }

    // ================== GET ==================
    async findAll() {
        const movies = await this.repo.find({
            relations: ["genres"],
            order: { movieid: "DESC" }
        });
        return movies.map(this._mapMovie);
    }

    async findById(id) {
        const movie = await this.repo.findOne({
            where: { movieid: id },
            relations: ["genres"]
        });
        if (!movie) return null;
        return this._mapMovie(movie);
    }

    async findByGenre(genreid) {
        const movies = await this.repo
            .createQueryBuilder("m")
            .innerJoinAndSelect("m.genres", "g")
            .where("g.genreid = :genreid", { genreid })
            .getMany();
        return movies.map(this._mapMovie);
    }

    async search(query, page = 1, limit = 10) {
        const [movies, total] = await this.repo.findAndCount({
            where: { title: query },
            relations: ["genres"],
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            total,
            page,
            limit,
            movies: movies.map(this._mapMovie)
        };
    }

    // ================== CRUD ==================
    async create(movieData) {
        const movie = this.repo.create(movieData);
        await this.repo.save(movie);
        return this._mapMovie(movie);
    }

    async update(id, data) {
        const movie = await this.repo.findOne({
            where: { movieid: id },
            relations: ["genres"],
        });
        if (!movie) throw new Error("Movie not found");

        if (data.genres) {
            const genreRepo = AppDataSource.getRepository("Genre");
            const genres = await genreRepo.findByIds(data.genres);
            movie.genres = genres;
            delete data.genres;
        }

        this.repo.merge(movie, data);
        return await this.repo.save(movie);
    }



    async delete(id) {
        await this.repo.delete({ movieid: id });
    }

    // ================== STREAM ==================
    async streamVideo(movie, req, res) {
        // Ví dụ stream local video
        if (!movie.videourl) return res.status(404).json({ message: "Video not found" });

        const videoPath = path.resolve(__dirname, "../../uploads/videos", movie.videourl);
        if (!fs.existsSync(videoPath)) return res.status(404).json({ message: "Video file missing" });

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = end - start + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4"
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4"
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    }

    // ================== PRIVATE ==================
    _mapMovie(movie) {
        return {
            movieid: movie.movieid,
            title: movie.title,
            description: movie.description,
            duration: movie.duration,
            year: movie.year,
            poster: movie.poster || null,
            accesslevel: movie.accesslevel || null,
            trailerurl: movie.trailerurl || null,
            videourl: movie.videourl || null,
            playbackid: movie.playbackid || null,
            ispremium: movie.ispremium,
            genres: (movie.genres || []).map(g => ({
                id: g.genreid,
                name: g.name
            }))
        };
    }
}

module.exports = MovieRepository;
