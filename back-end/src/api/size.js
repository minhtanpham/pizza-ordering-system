import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import SizeSchema from '../schema/Size';
import { isEmpty, unescapeSlashes } from '../utils';

export default () => {
  let api = Router();
  const Size = mongoose.model('Size', SizeSchema);
  const CreateSizeJoiSchema = Joi.object().keys({
    size: Joi.string().required(),
    price: Joi.number().required(),
  });

  api.post('/', asyncHandler(async (req, res) => {
    const { size, price } = req.body;
    try {
      const result = await CreateSizeJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      const sizeFinded = await Size.findOne({ size, is_active: true }).lean().exec();
      if (!isEmpty(sizeFinded)) {
        // size already in db
        return res.status(409).json({
          success: false,
          message: 'Size is already existed in system',
        });
      } else {
        // create new flavour
        const data = {
          size,
          price,
          is_active: true,
          created_at: new Date(),
          modified_at: new Date(),
        };
        const newSize = await Size.create(data);
        return res.status(200).json({
          success: true,
          message: 'Create successful!',
          data: {
            size: newSize.size,
            created_at: newSize.price
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

  // get detail of single size
  api.get('/:sizeid', asyncHandler(async (req, res) => {
    const size_id = req.params.sizeid;
    try {
      let response = await Size.find({ _id: size_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No size found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single size",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all size
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Size.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No size found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get size list",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // inactive specific size
  api.delete('/:sizeid/inactive', asyncHandler(async (req, res) => {
    const size_id = req.params.sizeid;
    if (isEmpty(size_id)) return res.status(400).json({
      success: false,
      message: "Must have size id for update",
      data: []
    });
    try {
      let response = await Size.findOneAndUpdate({ _id: size_id }, { $set: { is_active: false, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No size update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single size",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

   // update detail of size
   api.put('/:sizeid', asyncHandler(async (req, res) => {
    const size_id = req.params.sizeid;
    if (isEmpty(size_id)) return res.status(400).json({
      success: false,
      message: "Must have size id for update",
      data: []
    });
    try {
      const SizeUpdateJoiSchema = Joi.object().keys({
        size: Joi.string().required(),
        price: Joi.string().required(),
      });
      const result = await SizeUpdateJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: result.error.message,
        });
      }
      const { size, price } = req.body;
      let response = await Size.findOneAndUpdate({ _id: size_id }, { $set: { size: size, price: price, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No size update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single size",
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