const admin = require('firebase-admin');

async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // ✅ ahora tu ruta funcionará como espera
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verificarToken;

