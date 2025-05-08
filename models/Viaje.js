// models/Viaje.js
const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  paisOrigen: String,
  ciudadOrigen: String,
  paisDestino: String,
  ciudadDestino: String,
  fechaViaje: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Viaje', viajeSchema);
