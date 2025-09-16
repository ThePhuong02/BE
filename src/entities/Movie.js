const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Movie",
    tableName: "movies",
    columns: {
        movieid: { type: "int", primary: true, generated: "increment" },
        title: { type: "varchar", length: 255, nullable: false },
        description: { type: "text", nullable: true },
        duration: { type: "int", nullable: true },
        year: { type: "int", nullable: true },
        poster: { type: "varchar", length: 255, nullable: true },
        accesslevel: { type: "varchar", length: 10, nullable: true },
        trailerurl: { type: "varchar", length: 255, nullable: true },
        videourl: { type: "varchar", length: 255, nullable: true },
        playbackid: { type: "varchar", length: 255, nullable: true },
        ispremium: { type: "boolean", default: false } // thêm trường ispremium
    },
    relations: {
        genres: {
            target: "Genre",
            type: "many-to-many",
            joinTable: {
                name: "moviegenres",
                joinColumn: { name: "movieid", referencedColumnName: "movieid" },
                inverseJoinColumn: { name: "genreid", referencedColumnName: "genreid" },
            },
        },
    },
});
