const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    userid: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: { type: "varchar", length: 100, nullable: true }, // DB cho phép NULL
    email: { type: "varchar", length: 100, nullable: false },
    password: { type: "varchar", length: 255, nullable: false },
    phone: { type: "varchar", length: 20, nullable: true },
    avatar: { type: "varchar", length: 255, nullable: true }, // DB default NULL
    role: { type: "varchar", length: 10, default: "USER" },
  },
});

module.exports = User;
