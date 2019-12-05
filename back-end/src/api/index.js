import { Router } from 'express';
import 'babel-polyfill';

import auth from './auth';
import user from './user';
import flavours from './flavours';
import sizes from './size';
import crusts from './crust';
import toppings from './toppings';
import orders from './order';
import pizza from './pizza';

export default (redisClient) => {
  let api = Router();

  // expose API at the root
  api.get('/', (req, res) => {
    res.status(200).send('API route for Pizza Ordering System');
  });

  api.use('/auth', auth(redisClient));
  api.use('/flavours', flavours(redisClient));
  api.use('/crusts', crusts(redisClient));
  api.use('/toppings', toppings(redisClient));
  api.use('/pizzas', pizza(redisClient));
  api.use('/sizes', sizes(redisClient));
  api.use('/orders', orders(redisClient));
  api.use('/user', user());

  return api;
}