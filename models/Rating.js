const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  usuarioOrigen: { type: String, required: true }, // uid Firebase del que califica
  usuarioDestino: { type: String, required: true }, // uid Firebase del evaluado
  rolDestino: { type: String, enum: ['viajero', 'remitente'], required: true },
  calificacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
