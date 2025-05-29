const express = require('express');
const router = express.Router();
const { registerUser, updateUser,getUserProfile  } = require('../controllers/userController');
const verificarToken = require('../middlewares/VerificarToken');

// Registrar nuevo usuario (protegido)
router.post('/register', verificarToken, registerUser);

// Actualizar usuario (protegido)
router.put('/:uid', verificarToken, updateUser);

// ✅ Nueva ruta para obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, getUserProfile);

module.exports = router;
