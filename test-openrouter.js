require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
        messages: [{ role: 'user', content: 'Hola, ¿quién eres?' }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lapticon.app',
          'X-Title': 'Lapticon Assistant'
        },
      }
    );
    console.log('✅ Respuesta OpenRouter:', response.data);
  } catch (err) {
    console.error('❌ Error al llamar a OpenRouter:', err.response?.data || err.message);
  }
})();
