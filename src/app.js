require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ thêm import
const app = express();

// ✅ Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL FE của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // nếu cần gửi cookie/token
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const genreRoutes = require('./routes/genreRoutes');
const movieRoutes = require('./routes/movieRoutes');
const movieGenreRoutes = require('./routes/movieGenreRoutes');
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const planRoutes = require("./routes/planRoutes");

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movie-genres', movieGenreRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/plans", planRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
