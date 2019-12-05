import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import CrustSchema from '../schema/Crust';
import { isEmpty, unescapeSlashes } from '../utils';

export default () => {
  let api = Router();
  const Crust = mongoose.model('Crust', CrustSchema);

  const CreateCrustJoiSchema = Joi.object().keys({
    crust: Joi.string().required(),
    price: Joi.number().required(),
  });

  api.post('/', asyncHandler(async (req, res) => {
    const { crust, price } = req.body;
    try {
      const result = await CreateCrustJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: unescapeSlashes(result.error.message),
        });
      }
      const crustFinded = await Crust.findOne({ crust, is_active: true }).lean().exec();
      if (!isEmpty(crustFinded)) {
        // crust already in db
        return res.status(409).json({
          success: false,
          message: 'Crust is already existed in system',
        });
      } else {
        // create new flavour
        const data = {
          crust,
          price,
          is_active: true,
          created_at: new Date(),
          modified_at: new Date(),
        };
        const newCrust = await Crust.create(data);
        return res.status(200).json({
          success: true,
          message: 'Create successful!',
          data: {
            crust: newCrust.crust,
            created_at: newCrust.price
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

  // get detail of single crust
  api.get('/:crustid', asyncHandler(async (req, res) => {
    const crust_id = req.params.crustid;
    try {
      let response = await Crust.find({ _id: crust_id, is_active: true }).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No crust found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get single crust",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // get detail of all crust
  api.get('/', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
      let response = await Crust.find({ is_active: true }).skip(offset).limit(limit).exec();
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No crust found",
          data: []
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success get crust list",
        data: response
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

  // inactive specific crust
  api.delete('/:crustid/inactive', asyncHandler(async (req, res) => {
    const crust_id = req.params.crustid;
    if (isEmpty(crust_id)) return res.status(400).json({
      success: false,
      message: "Must have crust id for update",
      data: []
    });
    try {
      let response = await Crust.findOneAndUpdate({ _id: crust_id }, { $set: { is_active: false, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No crust update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single crust",
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.toString(),
      });
    }
  }));

   // update detail of crust
   api.put('/:crustid', asyncHandler(async (req, res) => {
    const crust_id = req.params.crustid;
    if (isEmpty(crust_id)) return res.status(400).json({
      success: false,
      message: "Must have crust id for update",
      data: []
    });
    try {
      const CrustUpdateJoiSchema = Joi.object().keys({
        Crust: Joi.string().required(),
        price: Joi.string().required(),
      });
      const result = await CrustUpdateJoiSchema.validate(req.body);
      if (!isEmpty(result.error)) {
        return res.status(400).json({
          success: false,
          message: result.error.message,
        });
      }
      const { crust, price } = req.body;
      let response = await Crust.findOneAndUpdate({ _id: crust_id }, { $set: { crust: crust, price: price, modified_at: new Date() } });
      if (isEmpty(response)) {
        return res.status(204).json({
          success: true,
          message: "No crust update",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Success update single crust",
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