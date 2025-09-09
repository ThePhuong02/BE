class GenreDTO {
    constructor(genre) {
        this.genreId = genre.genreid;   // cột trong DB là genreid (chữ thường)
        this.name = genre.name;
    }
}

module.exports = GenreDTO;
