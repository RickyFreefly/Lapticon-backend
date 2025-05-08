//Viajerouter
const express = require('express');
const router = express.Router(); // ✔️ Express Router, no 'router' externo
const { crearViaje } = require('../controllers/viajeController');
const { verificarToken } = require('../services/firebaseService');
const Viaje = require('../models/Viaje'); // ✅ Importación necesaria

// Registrar nuevo viaje
router.post('/', verificarToken, crearViaje);

// Listar viajes del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    const viajes = await Viaje.find({ uid: req.user.uid }).sort({ fechaViaje: 1 });
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

// Buscar viajeros por país y ciudad (excluyendo al usuario actual)
router.get('/buscar', verificarToken, async (req, res) => {
  try {
    const { pais, ciudad } = req.query;

    if (!pais || !ciudad) {
      return res.status(400).json({ error: 'Faltan parámetros de búsqueda' });
    }

    const viajes = await Viaje.find({
      paisOrigen: pais,
      ciudadOrigen: ciudad,
      uid: { $ne: req.user.uid }
    }).sort({ fechaViaje: 1 });

    res.json(viajes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar viajeros' });
  }
});

module.exports = router;
