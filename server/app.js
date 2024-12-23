import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morganMiddleware from './src/middlewares/morgan.middleware.js'

import v1Routes from './src/routes/v1/index.js'
import globalErrorMiddleware from './src/middlewares/error.middleware.js';
import CONFIG from './src/config/config.js';

const app = express();

app.use(CONFIG.STATIC_PATH, express.static('uploads'));


var whitelist = [CONFIG.REACT_BASE_URL]

// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

var corsOptions = {
    origin: '*', // Allow all origins temporarily
};

// body parser middleware
app.use(express.json())

// cors setup
 app.use(cors(corsOptions))

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