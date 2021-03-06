import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import OrderSchema from '../schema/Order';
import { isEmpty, unescapeSlashes } from '../utils';
import { checkToken } from '../middlewares/index';

export default () => {
  let api = Router();
  const Order = mongoose.model('Order', OrderSchema);
  const CreateOrderJoiSchema = Joi.object().keys({
    flavour: Joi.object().required(),
    size: Joi.object().required(),
    crust: Joi.object().required(),
    topping: Joi.object(),
    price: Joi.string().required(),
  });

  api.post('/', asyncHandler(async (req, res) => {
    const { name, flavour, size, crust, topping, price } = req.body;
    try {
      const result = await CreateOrderJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      // create new order
      const data = {
        name,
        flavour,
        size,
        crust,
        topping,
        price,
        is_active: true,
        created_at: new Date(),
        modified_at: new Date(),
      };
      const newOrder = await Order.create(data);
      return res.status(200).json({
        success: true,
        message: 'Create successful!',
        data: {
          order: newOrder,
          created_at: newOrder.created_at
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of single order
  api.get('/:orderid', checkToken, asyncHandler(async (req, res) => {
    const order_id = req.params.orderid;
    try {
      let response = await Order.find({ _id: order_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No order found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single order",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all order
  api.get('/', checkToken, asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Order.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No order found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get order list",
        data: response
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