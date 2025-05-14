// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/VerificarToken');
const { manejarChat } = require('../controllers/chatbotController');

router.post('/', verificarToken, manejarChat);

module.exports = router;
