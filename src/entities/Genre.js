const { EntitySchema } = require("typeorm");

const Genre = new EntitySchema({
  name: "Genre",
  tableName: "genres",
  columns: {
    genreid: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      length: 100,
      nullable: false,
    },
  },
});

module.exports = Genre;
