const axios = require('axios');
const ChatMensaje = require('../models/ChatMensaje');
const config = require('../config'); // Asegúrate de que la ruta sea correcta

const manejarChat = async (req, res) => {
  const { mensajeUsuario } = req.body;

  // ✅ Usa el uid real si está autenticado, o un valor de prueba en local
  const uid = req.usuario?.uid || 'usuario-test';

  if (!mensajeUsuario || mensajeUsuario.trim() === '') {
    return res.status(400).json({ error: 'Mensaje vacío' });
  }

  try {
    // Guardar mensaje del usuario
    await ChatMensaje.create({ uid, role: 'user', mensaje: mensajeUsuario });

    // Validación de clave
    if (!config.openrouterApiKey) {
      console.error('❌ La clave OPENROUTER_API_KEY no está definida.');
      return res.status(500).json({ error: 'Clave de OpenRouter no definida en el servidor' });
    }

    console.log('🔑 OPENROUTER_API_KEY:', config.openrouterApiKey.slice(0, 10) + '...');

    // Enviar mensaje a OpenRouter
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
          Authorization: `Bearer ${config.openrouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lapticon.app',
          'X-Title': 'Lapticon Assistant'
        },
      }
    );

    const respuesta = response.data.choices[0].message.content.trim();

    // Guardar respuesta del bot
    await ChatMensaje.create({ uid, role: 'bot', mensaje: respuesta });

    res.json({ respuesta });
  } catch (error) {
    console.error('❌ Error OpenRouter:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error al generar respuesta con OpenRouter',
      detalle: error.response?.data || error.message,
    });
  }
};

module.exports = { manejarChat };
