// models/Viaje.js
const mongoose = require('mongoose');

const viajeSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  numeroVuelo: { type: String, required: true },
  ciudadOrigen: { type: String, required: true },
  ciudadDestino: { type: String, required: true },
  fechaViaje: { type: Date, required: true },
  estado: { type: String, default: 'disponible' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Viaje', viajeSchema);
