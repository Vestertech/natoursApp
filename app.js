const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Railway/Heroku terminate TLS at a proxy — needed for correct req.ip,
// req.protocol and rate limiting in production
app.set('trust proxy', 1);

// app.use(
//   cors({
//     origin: ['http://127.0.0.1:3000', 'https://checkout.paystack.com'],
//     credentials: true
//   })
// );
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL Middleware
// Serving static Files.
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
// CSP whitelists the external resources the views use: Google Fonts and Mapbox GL
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://api.mapbox.com'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://api.mapbox.com',
          'https://fonts.googleapis.com'
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com'
        ],
        workerSrc: ["'self'", 'blob:'],
        // Would force https on assets — breaks local http development
        upgradeInsecureRequests:
          process.env.NODE_ENV === 'production' ? [] : null
      }
    }
  })
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip. Please, try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// Serving static files
// app.use(express.static(`${__dirname}/public`));

// Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find the ${req.originalUrl} on this server!`
  // });
  // const err = new Error(`can't find the ${req.originalUrl} on this server!`);
  // err.statusCode = 404;

  next(new AppError(`can't find the ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
