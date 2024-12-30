import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morganMiddleware from './src/middlewares/morgan.middleware.js';

import v1Routes from './src/routes/v1/index.js';
import globalErrorMiddleware from './src/middlewares/error.middleware.js';
import CONFIG from './src/config/config.js';

const app = express();

// Serve static files
app.use(CONFIG.STATIC_PATH, express.static('uploads'));

// CORS setup to allow only the frontend
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only the frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
    credentials: true, // Allow credentials (cookies, HTTP authentication, etc.)
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Body parser middleware
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Logger middleware
app.use(morganMiddleware);

// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).send('THS_X Server is up');
});

// API routes
app.use('/api/v1', v1Routes);

// Global error middleware
app.use(globalErrorMiddleware);

export { app };
