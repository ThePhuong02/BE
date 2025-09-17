const MovieRepository = require("@repositories/movieRepository");
const AppDataSource = require("@config/data-source");
const WatchHistoryService = require("@services/watchHistoryService");

class MovieService {
    constructor() {
        this.movieRepository = new MovieRepository();
        this.subscriptionRepo = AppDataSource.getRepository("Subscription");
        this.watchHistoryService = new WatchHistoryService();
    }

    async getAllMovies() {
        return await this.movieRepository.findAll();
    }

    async getMovieById(movieid) {
        return await this.movieRepository.findById(movieid);
    }

    async searchMovies(query, page = 1, limit = 10) {
        return await this.movieRepository.search(query, page, limit);
    }

    async getMoviesByGenre(genreid, page = 1, limit = 10) {
        return await this.movieRepository.findByGenre(genreid, page, limit);
    }

    async createMovie(movieData) {
        const { genreIds, ...moviePayload } = movieData;

        // Tạo phim trước
        const movie = await this.movieRepository.create(moviePayload);

        // Nếu có genreIds thì gán
        if (genreIds && Array.isArray(genreIds) && genreIds.length > 0) {
            const genreRepo = AppDataSource.getRepository("Genre");
            const genres = await genreRepo.findByIds(genreIds);

            if (genres.length) {
                movie.genres = genres;
                await AppDataSource.getRepository("Movie").save(movie);
            }
        }

        return movie;
    }


    async updateMovie(movieid, movieData) {
        return await this.movieRepository.update(movieid, movieData);
    }


    async deleteMovie(movieid) {
        return await this.movieRepository.delete(movieid);
    }

    async getPlaybackLink(movieid, user) {
        const movie = await this.getMovieById(movieid);
        if (!movie) return { error: "Movie not found", status: 404 };

        if (!movie.ispremium) {
            if (user) await this.watchHistoryService.logWatchHistory(user.userid, movie.movieid);
            return {
                type: "bunny-embed",
                url: `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${movie.playbackid}?autoplay=true`
            };
        }

        if (!user) return { error: "Bạn cần đăng nhập để xem phim premium.", status: 401 };

        const subscription = await this.subscriptionRepo.findOne({
            where: { userid: user.userid, isactive: true },
            relations: ["plan"],
        });

        if (!subscription) return { error: "Bạn chưa mua gói premium.", status: 403 };
        if (!subscription.plan.grantspremiumaccess) return { error: "Gói hiện tại không có quyền xem phim premium.", status: 403 };

        await this.watchHistoryService.logWatchHistory(user.userid, movie.movieid);
        return {
            type: "bunny-embed",
            url: `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${movie.playbackid}?autoplay=true`
        };
    }

    async streamMovie(movieid, user, req, res) {
        const movie = await this.getMovieById(movieid);
        if (!movie) return res.status(404).json({ message: "Movie not found" });

        if (user) await this.watchHistoryService.logWatchHistory(user.userid, movie.movieid);

        // Đây là ví dụ stream file từ local hoặc Dropbox
        return this.movieRepository.streamVideo(movie, req, res);
    }
}

module.exports = MovieService;
