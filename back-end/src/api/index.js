import { Router } from 'express';
import 'babel-polyfill';

import auth from './auth';
import user from './user';

export default (redisClient) => {
  let api = Router();

  // expose API at the root
  api.get('/', (req, res) => {
    res.status(200).send('API route for Minimal PM');
  });

  api.use('/auth', auth(redisClient));
  api.use('/user', user());

  return api;
}