require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');  // 👈 thêm cái này để join đường dẫn
const AppDataSource = require("@config/data-source");
const app = express();

// ✅ Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', require('@routes/authRoutes'));
app.use('/api/genres', require('@routes/genreRoutes'));
app.use('/api/movies', require('@routes/movieRoutes'));
app.use('/api/movie-genres', require('@routes/movieGenreRoutes'));
app.use("/api/subscriptions", require('@routes/subscriptionRoutes'));
app.use("/api/plans", require('@routes/planRoutes'));
app.use("/api/watch-history", require('@routes/watchHistoryRoutes'));

const PORT = process.env.PORT || 5000;

// ✅ Nếu bạn muốn serve client build luôn
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

// ✅ Kết nối DB rồi chạy server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });
