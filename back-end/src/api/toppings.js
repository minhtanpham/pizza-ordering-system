import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import ToppingSchema from '../schema/Toppings';
import { isEmpty, unescapeSlashes } from '../utils';
import { checkToken } from '../middlewares/index';

export default () => {
  let api = Router();
  const Topping = mongoose.model('Topping', ToppingSchema);
  const CreateToppingJoiSchema = Joi.object().keys({
    topping: Joi.string().required(),
    price: Joi.number().required(),
  });

  api.post('/', checkToken, asyncHandler(async (req, res) => {
    const { topping, price } = req.body;
    try {
      const result = await CreateToppingJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      const sizeFinded = await Topping.findOne({ topping, is_active: true }).lean().exec();
      if (!isEmpty(sizeFinded)) {
        // size already in db
        return res.status(409).json({
          success: false,
          message: 'Topping is already existed in system',
        });
      } else {
        // create new topping
        const data = {
          topping,
          price,
          is_active: true,
          created_at: new Date(),
          modified_at: new Date(),
        };
        const newtopping = await Topping.create(data);
        return res.status(200).json({
          success: true,
          message: 'Create successful!',
          data: {
            topping: newtopping.topping,
            created_at: newtopping.price
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

  // get detail of single topping
  api.get('/:toppingid', checkToken, asyncHandler(async (req, res) => {
    const topping_id = req.params.toppingid;
    try {
      let response = await Topping.find({ _id: topping_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No topping found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single topping",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all topping
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Topping.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No topping found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get topping list",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // inactive specific topping
  api.delete('/:toppingid/inactive', checkToken, asyncHandler(async (req, res) => {
    const topping_id = req.params.toppingid;
    if (isEmpty(topping_id)) return res.status(400).json({
      success: false,
      message: "Must have topping id for update",
      data: []
    });
    try {
      let response = await Topping.findOneAndUpdate({ _id: topping_id }, { $set: { is_active: false, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No topping update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single topping",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

   // update detail of topping
   api.put('/:toppingid', checkToken, asyncHandler(async (req, res) => {
    const topping_id = req.params.toppingid;
    if (isEmpty(topping_id)) return res.status(400).json({
      success: false,
      message: "Must have topping id for update",
      data: []
    });
    try {
      const ToppingUpdateJoiSchema = Joi.object().keys({
        Topping: Joi.string().required(),
        price: Joi.string().required(),
      });
      const result = await ToppingUpdateJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: result.error.message,
        });
      }
      const { topping, price } = req.body;
      let response = await Topping.findOneAndUpdate({ _id: topping_id }, { $set: { topping: topping, price: price, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No topping update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single topping",
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