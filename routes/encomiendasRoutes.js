const express = require('express');
const router = express.Router();
const Encomienda = require('../models/Encomiendas');
const verificarToken = require('../middlewares/VerificarToken'); // si ya tienes el middleware
const User = require('../models/User'); 

// Ruta para crear una encomienda
router.post('/', verificarToken, async (req, res) => {
  try {
    const {
      ciudadOrigen,
      ciudadDestino,
      observaciones,
      moneda,
      valor
    } = req.body;

    const nuevaEncomienda = new Encomienda({
      uid: req.usuario.uid, // obtenido del token Firebase
      ciudadOrigen,
      ciudadDestino,
      observaciones,
      moneda,
      valor
    });

    const guardada = await nuevaEncomienda.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('❌ Error al guardar encomienda:', error);
    res.status(500).json({ error: 'Error al guardar la encomienda' });
  }
});

// Ruta para obtener encomiendas disponibles filtradas por origen y destino
router.get('/disponibles', verificarToken, async (req, res) => {
  const { origen, destino } = req.query;

  if (!origen || !destino) {
    return res.status(400).json({ error: 'Origen y destino son requeridos' });
  }

  try {
    const encomiendas = await Encomienda.find({
      ciudadOrigen: origen,
      ciudadDestino: destino,
      estado: 'disponible',
    });

    const remitenteUIDs = encomiendas.map(e => e.uid);
    const remitentes = await User.find({ uid: { $in: remitenteUIDs } });

    const respuesta = encomiendas.map(e => {
      const remitente = remitentes.find(r => r.uid === e.uid);
      return {
        _id: e._id,
        ciudadOrigen: e.ciudadOrigen,
        ciudadDestino: e.ciudadDestino,
        observaciones: e.observaciones,
        valor: e.valor,
        moneda: e.moneda,
        estado: e.estado,
        remitenteNombre: remitente?.nombre || 'Desconocido',
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error('❌ Error al obtener encomiendas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas' });
  }
});

// Ruta para que un viajero tome una encomienda
router.put('/tomar/:id', verificarToken, async (req, res) => {
  const encomiendaId = req.params.id;
  const uidViajero = req.usuario.uid; // Se obtiene desde el token

  try {
    const encomienda = await Encomienda.findById(encomiendaId);

    if (!encomienda) {
      return res.status(404).json({ error: 'Encomienda no encontrada' });
    }

    if (encomienda.estado !== 'disponible') {
      return res.status(400).json({ error: 'Esta encomienda ya fue tomada' });
    }

    encomienda.estado = 'tomada';
    encomienda.viajeroId = uidViajero;

    await encomienda.save();

    res.json({ mensaje: 'Encomienda tomada exitosamente' });
  } catch (error) {
    console.error('❌ Error al tomar encomienda:', error);
    res.status(500).json({ error: 'Error al tomar la encomienda' });
  }
});

// Ruta combinada: devuelve encomiendas disponibles y tomadas por el viajero
router.get('/buscar', verificarToken, async (req, res) => {
  const { origen, destino } = req.query;
  const uidViajero = req.usuario.uid;

  if (!origen || !destino) {
    return res.status(400).json({ error: 'Origen y destino son requeridos' });
  }

  try {
    const [disponibles, tomadas, remitentes] = await Promise.all([
      Encomienda.find({ ciudadOrigen: origen, ciudadDestino: destino, estado: 'disponible' }),
      Encomienda.find({ ciudadOrigen: origen, ciudadDestino: destino, estado: 'tomada', viajeroId: uidViajero }),
      User.find({})
    ]);

    const withNombre = (lista) => lista.map(e => {
      const remitente = remitentes.find(u => u.uid === e.uid);
      return {
        ...e.toObject(),
        remitenteNombre: remitente?.nombre || 'Desconocido'
      };
    });

    res.json({
      disponibles: withNombre(disponibles),
      tomadas: withNombre(tomadas)
    });
  } catch (err) {
    console.error('❌ Error al buscar encomiendas:', err);
    res.status(500).json({ error: 'Error al buscar encomiendas' });
  }
});



module.exports = router;
