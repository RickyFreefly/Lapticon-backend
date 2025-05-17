// config.js
require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const config = {
  env: ENV,

  // Puerto del servidor Express
  port: process.env.PORT || 3000,

  // Conexión a MongoDB Atlas
  mongoUri: process.env.MONGO_URI,

  // Configuración Firebase Admin SDK
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Importante: convertir \n en saltos reales
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },

  // Claves API
  openaiApiKey: process.env.OPENAI_API_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,

  // URL del microservicio IA
  matchingApiUrl:
    ENV === 'production'
      ? process.env.MATCHING_API_URL_PROD
      : process.env.MATCHING_API_URL_DEV,
};

module.exports = config;
