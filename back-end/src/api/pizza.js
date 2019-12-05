import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import PizzaSchema from '../schema/Pizza';
import { isEmpty, unescapeSlashes } from '../utils';

export default () => {
  let api = Router();
  const Pizza = mongoose.model('Pizza', PizzaSchema);
  const CreatePizzaJoiSchema = Joi.object().keys({
    thumbnail: Joi.string().required(),
    flavour: Joi.object().required(),
    size: Joi.object().required(),
    crust: Joi.object().required(),
    topping: Joi.object(),
    price: Joi.string().required(),
  });

  api.post('/', asyncHandler(async (req, res) => {
    const { thumbnail, flavour, size, crust, topping, price } = req.body;
    try {
      const result = await CreatePizzaJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      // create new flavour
      const data = {
        thumbnail,
        flavour,
        size,
        crust,
        topping,
        price,
        is_active: true,
        created_at: new Date(),
        modified_at: new Date(),
      };
      const newPizza = await Pizza.create(data);
      return res.status(200).json({
        success: true,
        message: 'Create successful!',
        data: {
          pizza: newPizza,
          created_at: newPizza.created_at
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of single pizza
  api.get('/:pizzaid', asyncHandler(async (req, res) => {
    const pizza_id = req.params.pizzaid;
    try {
      let response = await Pizza.find({ _id: pizza_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No pizza found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single pizza",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all pizza
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Pizza.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No pizza found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get pizza list",
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