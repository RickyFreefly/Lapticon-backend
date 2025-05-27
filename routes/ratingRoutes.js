const express = require('express');
const router = express.Router();
const {
  crearCalificacion,
  obtenerCalificacionesPorUsuario
} = require('../controllers/ratingController');
const verificarToken = require('../middlewares/VerificarToken');

router.post('/', verificarToken, crearCalificacion);

router.get('/:uid', obtenerCalificacionesPorUsuario);

module.exports = router;
