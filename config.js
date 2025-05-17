// config.js
require('dotenv').config();

// Debug opcional para verificar carga de variables
console.log('📦 Cargando config...');
console.log('🔐 OPENROUTER_API_KEY (desde config):', process.env.OPENROUTER_API_KEY?.slice(0, 10) + '...');

const ENV = process.env.NODE_ENV || 'development';

const config = {
  env: ENV,

  // Puerto del servidor
  port: process.env.PORT || 3000,

  // Conexión a MongoDB Atlas
  mongoUri: process.env.MONGO_URI,

  // Firebase Admin SDK
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },

  // Claves API
  openaiApiKey: process.env.OPENAI_API_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,

  // URL del microservicio de matching IA
  matchingApiUrl:
    ENV === 'production'
      ? process.env.MATCHING_API_URL_PROD
      : process.env.MATCHING_API_URL_DEV,
};

module.exports = config;
