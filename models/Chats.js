const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  encomiendaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Encomienda',
    required: true
  },
  usuarios: [
    {
      type: String, // UID de Firebase
      required: true
    }
  ],
  estado: {
    type: String,
    enum: ['activo', 'cerrado'],
    default: 'activo'
  },
  fechaCierre: {
    type: Date
  }
}, {
  timestamps: true // opcional: guarda createdAt y updatedAt
});

module.exports = mongoose.model('Chat', chatSchema); // ← importante: 'Chat' singular
