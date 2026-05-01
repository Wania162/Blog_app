require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const path       = require('path');
const connectDB  = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

// ✅ SSR Setup — EJS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://blogapp-frontend-2026.netlify.app'
  ],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SSR Route — HTML server pe banta hai
app.get('/ssr/posts', async (req, res) => {
  try {
    const Post  = require('./models/Post');
    const posts = await Post.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.render('posts', { posts }); // EJS template render karo
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// API Routes
app.use('/api/auth',  authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: '✅ Blog API chal raha hai!' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend: http://localhost:${PORT}`);
    console.log(`📄 SSR Page: http://localhost:${PORT}/ssr/posts`);
  });
});