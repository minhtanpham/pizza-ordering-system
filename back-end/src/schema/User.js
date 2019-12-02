import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: true, default: '' },
  last_name: { type: String, required: true, default: '' },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'member' },
  is_active: { type: Boolean, default: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  created_at: { type: Date, required: true },
  modified_at: { type: Date, default: null },
});

UserSchema.index({ first_name: 'text', 'last_name': 'text' });

export default UserSchema;