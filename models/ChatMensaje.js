const mongoose = require('mongoose');

const chatMensajeSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // ← nuevo campo
  uid: { type: String, required: true },
  role: { type: String, enum: ['user', 'bot'], required: true },
  mensaje: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMensaje', chatMensajeSchema);
