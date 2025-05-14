const express = require('express');
const router = express.Router();
const axios = require('axios');
const ChatMensaje = require('../models/ChatMensaje');
const { verificarToken } = require('../middlewares/VerificarToken');

router.post('/', verificarToken, async (req, res) => {
  const { mensajeUsuario } = req.body;
  const uid = req.usuario.uid;

  if (!mensajeUsuario || mensajeUsuario.trim() === '') {
    return res.status(400).json({ error: 'Mensaje vacío' });
  }

  try {
    // 🔹 Guardar mensaje del usuario
    await ChatMensaje.create({
      uid,
      role: 'user',
      mensaje: mensajeUsuario,
    });

    // 🔹 Llamar a OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
        messages: [
          { role: 'system', content: 'Eres un asistente que ayuda a registrar encomiendas en Lapticon.' },
          { role: 'user', content: mensajeUsuario },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lapticon.app',
          'X-Title': 'Lapticon Assistant'
        },
      }
    );

    const respuesta = response.data.choices[0].message.content.trim();

    // 🔹 Guardar mensaje del bot
    await ChatMensaje.create({
      uid,
      role: 'bot',
      mensaje: respuesta,
    });

    res.json({ respuesta });
  } catch (error) {
    console.error('❌ Error OpenRouter:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error al generar respuesta con OpenRouter',
      detalle: error.response?.data || error.message,
    });
  }
});

module.exports = router;
