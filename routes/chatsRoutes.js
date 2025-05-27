const express = require('express');
const router = express.Router();
const Chat = require('../models/Chats'); // modelo de chat
const verificarToken = require('../middlewares/VerificarToken');

// ✅ GET /chats/estado/:chatId
router.get('/estado/:chatId', verificarToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId }); // _id si usas ObjectId directo

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    res.json({
      estado: chat.estado,
      fechaCierre: chat.fechaCierre,
    });
  } catch (error) {
    console.error('❌ Error al obtener estado del chat:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
