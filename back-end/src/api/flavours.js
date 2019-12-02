import { Router } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Joi from '@hapi/joi';
import _ from 'lodash';
import 'babel-polyfill';

import FlavourSchema from '../schema/Flavour';
import { isEmpty } from '../utils';

export default () => {
  let api = Router();
  const Flavour = mongoose.model('User', FlavourSchema);

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
    const flavour = req.query.flavour || '';
    try {
      let response = await Flavour.find({ $text: {$search: flavour} }).skip(offset).limit(limit).exec();
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

  // inactive specific user
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

  return api;
};