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

    async getPlaybackLink(movieid, user) {
        const movie = await this.getMovieById(movieid);
        if (!movie) {
            return { error: "Movie not found", status: 404 };
        }

        // FREE movie
        if (!movie.ispremium) {
            if (user) {
                await this.watchHistoryService.logWatchHistory(user.userid, movie.movieid);
            }
            return {
                type: "bunny-embed", 
                url: `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${movie.playbackid}?autoplay=true`
            };
        }

        // PREMIUM movie → check login
        if (!user) {
            return { error: "Bạn cần đăng nhập để xem phim premium.", status: 401 };
        }

        const subscription = await this.subscriptionRepo.findOne({
            where: { userid: user.userid, isactive: true },
            relations: ["plan"],
        });

        if (!subscription) {
            return { error: "Bạn chưa mua gói premium.", status: 403 };
        }

        if (!subscription.plan.grantspremiumaccess) {
            return { error: "Gói hiện tại không có quyền xem phim premium.", status: 403 };
        }

        // OK → log lịch sử + trả link
        await this.watchHistoryService.logWatchHistory(user.userid, movie.movieid);

        return {
            type: "bunny-embed",
            url: `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${movie.playbackid}?autoplay=true`
        };
    }

}

module.exports = MovieService;
