const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  displayName: String,
  phoneNumber: String,
  photoURL: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);