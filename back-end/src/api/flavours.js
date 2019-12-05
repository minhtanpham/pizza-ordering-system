import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import FlavourSchema from '../schema/Flavour';
import { isEmpty, unescapeSlashes } from '../utils';

export default () => {
  let api = Router();
  const Flavour = mongoose.model('Flavour', FlavourSchema);
  const CreateFlavourJoiSchema = Joi.object().keys({
    flavour: Joi.string().required(),
    price: Joi.number().required(),
  });

  api.post('/', asyncHandler(async (req, res) => {
    const { flavour, price } = req.body;
    try {
      const result = await CreateFlavourJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      const flavourFinded = await Flavour.findOne({ flavour, is_active: true }).lean().exec();
      if (!isEmpty(flavourFinded)) {
        // flavour already in db
        return res.status(409).json({
          success: false,
          message: 'Flavour is already existed in system',
        });
      } else {
        // create new flavour
        const data = {
          flavour,
          price,
          is_active: true,
          created_at: new Date(),
          modified_at: new Date(),
        };
        const newFlavour = await Flavour.create(data);
        return res.status(200).json({
          success: true,
          message: 'Create successful!',
          data: {
            user: newFlavour.flavour,
            created_at: newFlavour.price
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

  // get detail of single flavour
  api.get('/:flavourid', asyncHandler(async (req, res) => {
    const flavour_id = req.params.flavourid;
    try {
      let response = await Flavour.find({ _id: flavour_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No flavour found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single flavour",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all flavours
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Flavour.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No flavour found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get flavour list",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // inactive specific flavour
  api.delete('/:flavourid/inactive', asyncHandler(async (req, res) => {
    const flavour_id = req.params.flavourid;
    if (isEmpty(flavour_id)) return res.status(400).json({
      success: false,
      message: "Must have flavour id for update",
      data: []
    });
    try {
      let response = await Flavour.findOneAndUpdate({ _id: flavour_id }, { $set: { is_active: false, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No flavour update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single flavour",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

   // update detail of flavours
   api.put('/:flavourid', asyncHandler(async (req, res) => {
    const flavour_id = req.params.flavourid;
    if (isEmpty(flavour_id)) return res.status(400).json({
      success: false,
      message: "Must have flavour id for update",
      data: []
    });
    try {
      const FlavourUpdateJoiSchema = Joi.object().keys({
        flavour: Joi.string().required(),
        price: Joi.string().required(),
      });
      const result = await FlavourUpdateJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: result.error.message,
        });
      }
      const { flavour, price } = req.body;
      let response = await Flavour.findOneAndUpdate({ _id: flavour_id }, { $set: { flavour: flavour, price: price, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No flavour update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single flavour",
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