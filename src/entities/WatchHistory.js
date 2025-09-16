const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WatchHistory",
  tableName: "watchhistory",
  columns: {
    watchid: { type: Number, primary: true, generated: true },
    userid: { type: Number },
    movieid: { type: Number },
    watchedat: { type: Date, createDate: true }, // auto set thời gian khi insert
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userid" },
      onDelete: "CASCADE",
    },
    movie: {
      target: "Movie",
      type: "many-to-one",
      joinColumn: { name: "movieid" },
      onDelete: "CASCADE",
    },
  },
});
