const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // ❌ Prod thì nên false, Dev thì true cho nhanh
  logging: false,
  entities: [__dirname + "/../entities/*.js"],
});

module.exports = AppDataSource;
