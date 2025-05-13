const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

// Evita múltiples inicializaciones
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Middleware para verificar el token JWT
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer abc.def.ghi' => 'abc.def.ghi'

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.usuario = decoded; // <-- usar siempre `req.usuario` en controladores
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
