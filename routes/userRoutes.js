const express = require('express');
const router = express.Router();
const { registerUser, updateUser } = require('../controllers/userController');
const verificarToken = require('../middlewares/VerificarToken');

// Registrar nuevo usuario (protegido)
router.post('/register', verificarToken, registerUser);

// Actualizar usuario (protegido)
router.put('/:uid', verificarToken, updateUser);

module.exports = router;
