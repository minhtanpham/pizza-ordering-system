import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import UserSchema from '../schema/User';
import { isEmpty } from '../utils';

export default () => {
  let api = Router();
  const User = mongoose.model('User', UserSchema);

  // get detail of single user
  api.get('/:userid', asyncHandler(async (req, res) => {
    const user_id = req.params.userid;
    try {
      let response = await User.find({ _id: user_id }, { password: 0 }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No user found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single user",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all users
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const name = req.query.name || '';
    try {
      let response = await User.find({ $text: {$search: name} }, { password: 0 }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No user found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get user list",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // update detail of user
  api.put('/:userid', asyncHandler(async (req, res) => {
    const user_id = req.params.userid;
    if (isEmpty(user_id)) return res.status(400).json({
      success: false,
      message: "Must have user id for update",
      data: []
    });
    try {
      const UserUpdateJoiSchema = Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
      });
      const result = await UserUpdateJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: result.error.message,
        });
      }
      const { first_name, last_name } = req.body;
      let response = await User.findOneAndUpdate({ _id: user_id }, { $set: { first_name: first_name, last_name: last_name, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No user update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single user",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // inactive specific user
  api.delete('/:userid/inactive', asyncHandler(async (req, res) => {
    const user_id = req.params.userid;
    if (isEmpty(user_id)) return res.status(400).json({
      success: false,
      message: "Must have user id for update",
      data: []
    });
    try {
      let response = await User.findOneAndUpdate({ _id: user_id }, { $set: { is_active: false, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No user update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single user",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // active specific user
  api.put('/:userid/active', asyncHandler(async (req, res) => {
    const user_id = req.params.userid;
    if (isEmpty(user_id)) return res.status(400).json({
      success: false,
      message: "Must have user id for update",
      data: []
    });
    try {
      let response = await User.findOneAndUpdate({ _id: user_id }, { $set: { is_active: true, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No user update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single user",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  return api;
};