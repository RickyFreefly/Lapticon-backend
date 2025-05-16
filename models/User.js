const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  nombre: String,
  apellido: String,
  telefono: String,
  fechaNacimiento: Date,
  nacionalidad: String,
  correo: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
