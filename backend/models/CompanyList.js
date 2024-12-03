// models/CompanyList.js
import mongoose from 'mongoose';

const CompanyListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CompanyList', CompanyListSchema);
