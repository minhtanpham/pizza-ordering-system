import mongoose from 'mongoose';

const { Schema } = mongoose;

const ToppingSchema = new Schema({
  topping: { type: String, required: true },
  price: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
});

ToppingSchema.index({ topping: 'text' });

export default ToppingSchema;