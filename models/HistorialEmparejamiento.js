const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // quién hizo la solicitud
  tipo: { type: String, enum: ['remitente'], default: 'remitente' },
  ciudadOrigen: String,
  ciudadDestino: String,
  fechaEncomienda: Date,
  valorEncomienda: Number,
  viajesEvaluados: Number,
  viajesSugeridos: Number,
  fechaSolicitud: { type: Date, default: Date.now },
  resultado: { type: mongoose.Schema.Types.Mixed }, // puede ser lista o mensaje
});

module.exports = mongoose.model('HistorialEmparejamiento', historialSchema);
