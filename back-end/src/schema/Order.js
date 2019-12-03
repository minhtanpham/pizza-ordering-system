import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  name: { type: String, required: false },
  flavours: { type: Object, required: true },
  size: { type: Object, required: true },
  crust: { type: Object, required: true },
  topping: { type: Object, required: false },
  price: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
});

OrderSchema.index({ name: 'text' });

export default OrderSchema;