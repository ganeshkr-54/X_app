import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morganMiddleware from './src/middlewares/morgan.middleware.js'

import v1Routes from './src/routes/v1/index.js'
import globalErrorMiddleware from './src/middlewares/error.middleware.js';
import CONFIG from './src/config/config.js';

const app = express();

app.use(CONFIG.STATIC_PATH, express.static('uploads'));


var corsOptions = {
    origin: '*',  // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allow all HTTP methods
    allowedHeaders: 'Content-Type,Authorization',  // Allow headers for requests
    credentials: true,  // Allow credentials (cookies, HTTP authentication, etc.)
};

// cors setup
app.use(cors(corsOptions))

// body parser middleware
app.use(express.json())


// cookier parser middleware
app.use(cookieParser())

// logger middleware
app.use(morganMiddleware)

app.get('/', (req, res) => {
    res.status(200).send("THS_X Server is up")
})

app.use('/api/v1', v1Routes)

// global Error Middleware
app.use(globalErrorMiddleware)

export { app }