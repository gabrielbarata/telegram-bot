// const path = require('path');
import express from 'express';
import morgan from 'morgan';

// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const compression = require('compression');
// const cors = require('cors');s

// import './pdf_reader.js'
// import {bot} from'./telegram'
const {bot} = require('./telegram.js')





const app = express();
app.use(morgan('dev'));
app.enable('trust proxy');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  // console.log(req.requestTime)
  next();
});

app.post(`/secret-path`, (req, res) => {
  console.log(req.body)
  return bot.handleUpdate(req.body, res)
})


app.get('*', (req, res, next) => {
  res.json({ a: 1 }).end()
});


app.get('/lala', (req, res, next) => {
  res.json({ a: 1 }).end()
});

module.exports = app;