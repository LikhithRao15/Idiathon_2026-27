const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const participantRoutes = require('./routes/participantRoutes');
const teamRoutes = require('./routes/teamRoutes');
const round1Routes = require('./routes/round1Routes');
const round2Routes = require('./routes/round2Routes');
const panelistRoutes = require('./routes/panelistRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const themeRoutes = require('./routes/themeRoutes');
const adminController = require('./controllers/adminController');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ideathon Management System API is healthy and operational.',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.get(`${env.API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ideathon Management System API is healthy and operational.',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use(`${env.API_PREFIX}/auth`, authLimiter, authRoutes);
app.use(`${env.API_PREFIX}/participants`, participantRoutes);
app.use(`${env.API_PREFIX}/teams`, teamRoutes);
app.use(`${env.API_PREFIX}/round1`, round1Routes);
app.use(`${env.API_PREFIX}/round2`, round2Routes);
app.use(`${env.API_PREFIX}/panelists`, panelistRoutes);
app.use(`${env.API_PREFIX}/evaluations`, evaluationRoutes);
app.use(`${env.API_PREFIX}/admin`, adminRoutes);
app.use(`${env.API_PREFIX}/notifications`, notificationRoutes);
app.use(`${env.API_PREFIX}/themes`, themeRoutes);

// Direct Finalists endpoint support: GET /api/finalists/:teamId
app.get(`${env.API_PREFIX}/finalists/:teamId`, requireAuth, adminController.getFinalistDetails);

// Catch 404
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
