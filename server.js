require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

/* ---------------- CORS FIX (IMPORTANT) ---------------- */
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Preflight fix (VERY IMPORTANT)
app.use(cors());

/* ---------------- MIDDLEWARES ---------------- */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- VIEW ENGINE (SSR) ---------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------------- SSR ROUTE ---------------- */
app.get('/ssr/posts', async (req, res) => {
  try {
    const Post = require('./models/Post');

    const posts = await Post.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.render('posts', { posts: posts || [] });

  } catch (err) {
    console.log("SSR ERROR:", err);
    res.status(500).send("Server Error");
  }
});

/* ---------------- API ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

/* ---------------- HOME ROUTE ---------------- */
app.get('/', (req, res) => {
  res.json({ message: "🚀 Blog API is running" });
});

/* ---------------- ERROR HANDLING ---------------- */
app.use(notFound);
app.use(errorHandler);

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
    console.log(`📄 SSR: http://localhost:${PORT}/ssr/posts`);
  });
});