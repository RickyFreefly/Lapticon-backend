const admin = require('firebase-admin');

// Inicialización segura con variables de entorno
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Middleware para verificar el token JWT
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.usuario = decoded; // Acceso al UID, email, etc.
    next();
  } catch (error) {
    console.error('❌ Error al verificar el token:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = {
  admin,
  verificarToken,
};
