import { Router } from 'express';
import 'babel-polyfill';
import mongoose from 'mongoose';
import Bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import UserSchema from '../schema/User';
import { isEmpty, unescapeSlashes } from '../utils';
import { PASSWORD_REGEX } from '../constant';
import { checkToken } from '../middlewares/index';
import config from '../config';

export default (redisClient) => {
  let api = Router();
  const User = mongoose.model('User', UserSchema);
  const UserRegisterJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(PASSWORD_REGEX).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
  });

  api.post('/register', asyncHandler(async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
      const result = await UserRegisterJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      const userFinded = await User.findOne({ email }).lean().exec();
      if (!isEmpty(userFinded)) {
        // user already in db
        return res.status(409).json({
          success: false,
          message: 'User is already existed in system',
        });
      } else {
        // create new user
        const data = {
          email,
          password: Bcrypt.hashSync(password, 10),
          created_at: new Date(),
          modified_at: new Date(),
          first_name,
          last_name,
        };
        const newUser = await User.create(data);
        return res.status(200).json({
          success: true,
          message: 'Register successful!',
          data: {
            user: newUser.email,
            created_at: newUser.created_at
          }
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  api.post('/login', asyncHandler(async (req, res) => {
    const UserLoginJoiSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().regex(PASSWORD_REGEX).required(),
    });
    try {
      const result = await UserLoginJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      } else {
        const { email, password } = req.body;
        var user = await User.findOne({ email: email }).lean().exec();
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "The email does not exist",
          });
        }
        if (!Bcrypt.compareSync(password, user.password)) {
          return res.status(400).json({
            success: false,
            message: "The password is invalid",
          });
        }
        // start create token and refresh token
        const token = jwt.sign({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        }, config.JWT_SECRET || 'minimalpm@secretl0ngtext', { expiresIn: config.JWT_TOKEN_LIFE || '1h' });
        const refreshToken = jwt.sign({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        }, config.JWT_REFRESH_TOKEN_SECRET || 'minimalpm@r3freshtok3ntexxt',
          { expiresIn: config.JWT_REFRESH_TOKEN_LIFE || '2h' }
        );
        const response = {
          success: true,
          data: {
            token,
            refreshToken,
          },
          message: 'Login successful!',
        };
        // key key pair value for token
        await redisClient.set(token, refreshToken, 'EX', 1800);
        res.status(200).json(response);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  api.post('/token', checkToken, asyncHandler(async (req, res) => {
    // refresh the damn token
    const { refreshToken } = req.body;
    const token = _.get(req, 'token', '');
    console.log("TCL: refreshToken", refreshToken)
    const { email: tokenEmail, first_name, last_name, role } = req.decoded;
    let storeRefreshToken = await redisClient.getAsync(token);
    console.log("TCL: storeToken", storeRefreshToken)
    // if have refresh token and refresh token exists in Redis
    if ((refreshToken) && (refreshToken === storeRefreshToken)) {
      const user = {
        "email": tokenEmail,
        first_name,
        last_name,
        role,
      };
      const newToken = jwt.sign(user, config.JWT_SECRET || 'minimalpm@secretl0ngtext', { expiresIn: config.JWT_TOKEN_LIFE || '1h' });
      const newRefreshToken = jwt.sign({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      }, config.JWT_REFRESH_TOKEN_SECRET || 'minimalpm@r3freshtok3ntexxt',
        { expiresIn: config.JWT_REFRESH_TOKEN_LIFE || '2h' }
      );
      const response = {
        success: true,
        message: 'Successful',
        data: {
          "token": newToken,
          "refresh_token": newRefreshToken,
        }
      }
      // update the token in the Redis
      redisClient.del(token);
      redisClient.set(newToken, newRefreshToken, 'EX', 1800);
      res.status(200).json(response);
    } else {
      res.status(404).send('Invalid request');
    }
  }));

  api.post('/logout', checkToken, asyncHandler(async (req, res) => {
    // refresh the damn token
    try {
      const token = _.get(req, 'token', '');
      let storeToken = await redisClient.getAsync(token);
      if (storeToken) {
        redisClient.del(token);
        return res.status(200).json({
          success: true,
          message: 'Logout successful'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Logout failed',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  return api;
};