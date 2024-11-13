import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  postcode: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['company', 'individual'] 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);