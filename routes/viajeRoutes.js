const express = require('express');
const router = express.Router();
const { crearViaje } = require('../controllers/viajeController');
const { verificarToken } = require('../services/firebaseService');
const Viaje = require('../models/Viaje');

// ✅ Registrar nuevo viaje
router.post('/', verificarToken, crearViaje);

// ✅ Listar todos los viajes del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    const viajes = await Viaje.find({ uid: req.user.uid }).sort({ fechaViaje: 1 });
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

// 🔍 Obtener el viaje disponible del usuario (solo si no ha vencido)
router.get('/disponible', verificarToken, async (req, res) => {
  try {
    await actualizarViajesCompletados(req.user.uid); // 🟡 Asegura que no tenga viajes vencidos como "disponibles"

    const hoy = new Date();
    const viaje = await Viaje.findOne({
      uid: req.user.uid,
      estado: 'disponible',
      fechaViaje: { $gte: hoy } // solo futuro o actual
    });

    if (!viaje) {
      return res.status(404).json({ mensaje: 'No hay viajes disponibles' });
    }

    res.json(viaje);
  } catch (error) {
    console.error('❌ Error al buscar viaje disponible:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;

// ✅ Buscar viajeros por ciudad de origen (excluyendo al usuario actual)
router.get('/buscar', verificarToken, async (req, res) => {
  try {
    const { ciudad } = req.query;

    if (!ciudad) {
      return res.status(400).json({ error: 'Falta el parámetro ciudad' });
    }

    await actualizarViajesCompletados(); // 🟡 Limpia viajes vencidos de todos

    const viajes = await Viaje.find({
      ciudadOrigen: ciudad,
      uid: { $ne: req.user.uid },
      estado: 'disponible' // solo mostrar viajes válidos
    }).sort({ fechaViaje: 1 });

    res.json(viajes);
  } catch (err) {
    console.error('❌ Error al buscar viajeros:', err);
    res.status(500).json({ error: 'Error al buscar viajeros' });
  }
});

// ✅ Cambiar estado de un viaje específico (completado, cancelado, etc.)
router.patch('/:id/estado', verificarToken, async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    if (!['disponible', 'completado', 'cancelado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const viaje = await Viaje.findOneAndUpdate(
      { _id: id, uid: req.user.uid },
      { estado },
      { new: true }
    );

    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado o no autorizado' });
    }

    res.json({ message: 'Estado actualizado', viaje });
  } catch (err) {
    console.error('❌ Error al actualizar estado del viaje:', err);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

// 🔁 Actualizar viajes con fecha pasada a 'completado'
// Si se pasa un uid, solo actualiza de ese usuario; si no, actualiza globalmente
async function actualizarViajesCompletados(uid = null) {
  const hoy = new Date();
  const filtro = {
    estado: 'disponible',
    fechaViaje: { $lt: hoy }
  };

  if (uid) filtro.uid = uid;

  try {
    const resultado = await Viaje.updateMany(
      filtro,
      { $set: { estado: 'completado' } }
    );
    console.log(`🟡 ${resultado.modifiedCount} viajes marcados como completados`);
  } catch (error) {
    console.error('❌ Error al actualizar viajes completados:', error);
  }
}

// ✅ Listar todos los viajes del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    await actualizarViajesCompletados(req.user.uid); // 🟡 Actualiza viajes vencidos

    const viajes = await Viaje.find({ uid: req.user.uid }).sort({ fechaViaje: 1 });
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});



module.exports = router;
