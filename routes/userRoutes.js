const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const verificarToken = require('../middlewares/VerificarToken');

// Ruta protegida: requiere idToken válido en el header Authorization
router.post('/register', verificarToken, registerUser);

module.exports = router;
