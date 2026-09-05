const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Ensure the MongoDB connection is ready before any route handler runs a
// query. On a warm serverless invocation connectDB() resolves immediately
// (connection already open) - this adds no meaningful latency. On a cold
// start it awaits the real connection instead of letting queries fail or
// hang, and it never creates a second connection per request.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({ message: 'Database unavailable, please try again shortly.' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    // Debug Middleware: Log all requests (dev only - keep prod request path lean)
    app.use((req, res, next) => {
        console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
        next();
    });
}

// Static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Content routes
const homeRoutes = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
app.use('/api/content', homeRoutes);
app.use('/api/content', aboutRoutes);

app.use('/api/education', require('./routes/educationRoutes'));
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/skills', require('./routes/skillsRoutes'));
app.use('/api/projects', require('./routes/projectsRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// 404 Handler (Page not found)
app.use((req, res, next) => {
    console.log(`[404] Route not found: ${req.originalUrl}`);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Test URL: http://localhost:${PORT}/api/content/home`);
    });
}

module.exports = app;
