// services/firebaseService.js

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

// Evita múltiples inicializaciones
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Middleware para verificar el token JWT enviado desde el frontend
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Error al verificar el token:', error);
    return res.status(403).send('Token inválido');
  }
};

module.exports = {
  admin,
  verificarToken,
};
