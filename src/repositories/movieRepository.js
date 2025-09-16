const AppDataSource = require("@config/data-source");
const Movie = require("@entities/Movie");

class MovieRepository {
    constructor() {
        this.repo = AppDataSource.getRepository(Movie);
    }

    async findAll() {
        const movies = await this.repo.find({
            relations: ["genres"],
            order: { movieid: "DESC" }
        });

        return movies.map(m => ({
            movieid: m.movieid,
            title: m.title,
            description: m.description,
            duration: m.duration,
            year: m.year,
            poster: m.poster || null,
            accesslevel: m.accesslevel || null,
            trailerurl: m.trailerurl || null,
            videourl: m.videourl || null,
            playbackid: m.playbackid || null,
            ispremium: m.ispremium,
            genres: m.genres.map(g => ({
                id: g.genreid,
                name: g.name
            }))
        }));
    }

    async findById(id) {
        const m = await this.repo.findOne({
            where: { movieid: id },
            relations: ["genres"]
        });
        if (!m) return null;

        return {
            movieid: m.movieid,
            title: m.title,
            description: m.description,
            duration: m.duration,
            year: m.year,
            poster: m.poster || null,
            accesslevel: m.accesslevel || null,
            trailerurl: m.trailerurl || null,
            videourl: m.videourl || null,
            playbackid: m.playbackid || null,
            ispremium: m.ispremium,
            genres: m.genres.map(g => ({
                id: g.genreid,
                name: g.name
            }))
        };
    }

    async findByGenre(genreid) {
        const movies = await this.repo
            .createQueryBuilder("m")
            .innerJoinAndSelect("m.genres", "g")
            .where("g.genreid = :genreid", { genreid })
            .getMany();

        return movies.map(m => ({
            movieid: m.movieid,
            title: m.title,
            description: m.description,
            duration: m.duration,
            year: m.year,
            poster: m.poster || null,
            accesslevel: m.accesslevel || null,
            trailerurl: m.trailerurl || null,
            videourl: m.videourl || null,
            playbackid: m.playbackid || null,
            ispremium: m.ispremium,
            genres: m.genres.map(g => ({
                id: g.genreid,
                name: g.name
            }))
        }));
    }

}

module.exports = MovieRepository;
