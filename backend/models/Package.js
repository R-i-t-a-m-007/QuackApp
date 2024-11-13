const mongoose = require('mongoose');
const PackageSchema = new mongoose.Schema({
  title: String,
  price: String,
  features: [String],
});

module.exports = mongoose.model('Package', PackageSchema);
