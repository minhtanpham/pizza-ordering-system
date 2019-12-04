import http from 'http';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import redis from 'redis';
import bluebird from 'bluebird';
import cors from 'cors';

import api from './api';
import { BODYLIMIT, REDIS_DB_URL, REDIS_DB_PORT } from './constant';
import config from './config';

const MONGO_DB_URL = process.env.NODE_ENV == 'develop' ? config.MONGO_DB_URL : 'mongodb://localhost:27017/admin';
const PORT = config.PORT || 5000;
const ENV = process.env.NODE_ENV;

// connection MongoDB database
mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection;
mongoose.set('useFindAndModify', false);

// connection to Redis database
bluebird.promisifyAll(redis);
const redisClient = redis.createClient(REDIS_DB_URL, REDIS_DB_PORT);
redisClient.on('connect', function () {
  console.log('Redis client connected');
});
redisClient.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const app = express();
app.server = http.createServer(app);

// logger
app.use(morgan(ENV));
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

// set maxsize of body when send the request, avoid spamming with huge size
app.use(bodyParser.json({ limit: BODYLIMIT }));

try {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to server Back-End');
  });

  app.use('/api', api(redisClient));

  app.server.listen(PORT, () => {
    console.log(`Server API has stared on ${app.server.address().port}`);
  });
} catch (error) {
  console.log(`Has an error when started the server ${error}`);
}