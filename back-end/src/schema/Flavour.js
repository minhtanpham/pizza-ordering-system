import mongoose from 'mongoose';

const { Schema } = mongoose;

const FlavourSchema = new Schema({
  flavour: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
});

FlavourSchema.index({ flavour: 'text' });

export default FlavourSchema;