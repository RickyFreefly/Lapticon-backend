const mongoose = require('mongoose');

const encomiendaSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Remitente
  ciudadOrigen: String,
  ciudadDestino: String,
  observaciones: String,
  moneda: String,
  valor: Number,
  estado: { type: String, default: 'disponible' },
  viajeroId: { type: String, default: null },
  fechaCreacion: { type: Date, default: Date.now },
  fechaVencimiento: { type: Date } // <-- Añadido correctamente
});

module.exports = mongoose.model('Encomienda', encomiendaSchema);