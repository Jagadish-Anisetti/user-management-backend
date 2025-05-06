const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  status: { type: String, enum: ['active', 'inactive'] }
});

module.exports = mongoose.model('User', UserSchema);
