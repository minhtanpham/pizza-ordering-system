import mongoose from 'mongoose';

const { Schema } = mongoose;

const CrustSchema = new Schema({
  crust: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, required: true },
});

CrustSchema.index({ crust: 'text' });

export default CrustSchema;