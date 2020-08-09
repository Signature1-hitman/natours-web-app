const express = require('express');
const morgan = require('morgan');
const AppError=require('./utils/appError')
const ratelimit = require('express-rate-limit')
const helmet = require('helmet')

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler=require('./controllers/errorController');
const rateLimit = require('express-rate-limit');

const app = express();

// 1) MIDDLEWARES
app.use(helmet())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = ratelimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests from yhis IP,please try again in an hour'
})
app.use('/api',limiter)

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next)=>{
  // res.status(404).json({

  //   status:'fail',
  //   message:`can't find ${req.originalUrl} on this server`
  // })







  // const err=new Error(`Cant find ${req.originalUrl} on this server`);
  // err.status='fail'
  // err.statusCode=404
  
 
  next(new AppError(`Cant find ${req.originalUrl} on this server`,404))
})
app.use(globalErrorHandler)
module.exports = app;
