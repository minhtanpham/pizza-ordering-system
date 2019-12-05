import { Router } from 'express';
import 'babel-polyfill';
import { checkToken } from '../middlewares/index';

import auth from './auth';
import user from './user';
import flavours from './flavours';
import sizes from './size';
import crusts from './crust';
import toppings from './toppings';

export default (redisClient) => {
  let api = Router();

  // expose API at the root
  api.get('/', (req, res) => {
    res.status(200).send('API route for Pizza Ordering System');
  });

  api.use('/auth', auth(redisClient));
  api.use('/flavours', checkToken, flavours(redisClient));
  api.use('/crusts', checkToken, crusts(redisClient));
  api.use('/toppings', checkToken, toppings(redisClient));
  api.use('/sizes', checkToken, sizes(redisClient));
  api.use('/user', user());

  return api;
}