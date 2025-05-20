const express = require('express');
const router = express.Router();
const Encomienda = require('../models/Encomiendas');
const verificarToken = require('../middlewares/VerificarToken');
const User = require('../models/User');
const axios = require('axios');
const config = require('../config');

// 🔁 Función para actualizar encomiendas vencidas
async function actualizarEncomiendasVencidas() {
  const hoy = new Date();
  try {
    await Encomienda.updateMany(
      { estado: 'disponible', fechaVencimiento: { $lt: hoy } },
      { $set: { estado: 'vencida' } }
    );
  } catch (error) {
    console.error('❌ Error al actualizar encomiendas vencidas:', error);
  }
}

// ✅ Ruta para crear una encomienda
router.post('/', verificarToken, async (req, res) => {
  try {
    const {
      ciudadOrigen,
      ciudadDestino,
      observaciones,
      moneda,
      valor
    } = req.body;

    const fechaCreacion = new Date();
    const fechaVencimiento = new Date(fechaCreacion);
    fechaVencimiento.setMonth(fechaCreacion.getMonth() + 1);

    const nuevaEncomienda = new Encomienda({
      uid: req.user.uid,
      ciudadOrigen,
      ciudadDestino,
      observaciones,
      moneda,
      valor,
      fechaCreacion,
      fechaVencimiento
    });

    const guardada = await nuevaEncomienda.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error('❌ Error al guardar encomienda:', error);
    res.status(500).json({ error: 'Error al guardar la encomienda' });
  }
});

// ✅ Ruta para obtener encomiendas disponibles filtradas por origen y destino
router.get('/disponibles', verificarToken, async (req, res) => {
  const { origen, destino } = req.query;

  if (!origen || !destino) {
    return res.status(400).json({ error: 'Origen y destino son requeridos' });
  }

  try {
    await actualizarEncomiendasVencidas();

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
        fechaCreacion: e.fechaCreacion,
        fechaVencimiento: e.fechaVencimiento
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error('❌ Error al obtener encomiendas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas' });
  }
});

router.get('/disponibles2', verificarToken, async (req, res) => {
  const { ciudadOrigen, ciudadDestino } = req.query;
  const filtro = {
    estado: 'disponible',
    ...(ciudadOrigen && { ciudadOrigen }),
    ...(ciudadDestino && { ciudadDestino }),
  };

  try {
    const encomiendas = await Encomienda.find(filtro);
    res.json(encomiendas);
  } catch (error) {
    console.error('❌ Error al obtener encomiendas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas' });
  }
});

// ✅ Ruta para que un viajero tome una encomienda
router.put('/tomar/:id', verificarToken, async (req, res) => {
  const encomiendaId = req.params.id;
  const uidViajero = req.user.uid;

  try {
    const encomienda = await Encomienda.findById(encomiendaId);

    if (!encomienda) {
      return res.status(404).json({ error: 'Encomienda no encontrada' });
    }

    if (encomienda.estado !== 'disponible') {
      return res.status(400).json({ error: 'Esta encomienda ya fue tomada o vencida' });
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

// ✅ Ruta combinada: devuelve encomiendas disponibles y tomadas por el viajero
router.get('/buscar', verificarToken, async (req, res) => {
  const { origen, destino } = req.query;
  const uidViajero = req.user.uid;

  if (!origen || !destino) {
    return res.status(400).json({ error: 'Origen y destino son requeridos' });
  }

  try {
    await actualizarEncomiendasVencidas();

    const [disponibles, tomadas, remitentes] = await Promise.all([
      Encomienda.find({ ciudadOrigen: origen, ciudadDestino: destino, estado: 'disponible' }),
      Encomienda.find({ ciudadOrigen: origen, ciudadDestino: destino, estado: 'tomada', viajeroId: uidViajero }),
      User.find({})
    ]);

    const withNombre = (lista) => lista.map(e => {
      const remitente = remitentes.find(u => u.uid === e.uid);
      return {
        ...e.toObject(),
        remitenteNombre: remitente?.nombre || 'Desconocido',
        fechaCreacion: e.fechaCreacion,
        fechaVencimiento: e.fechaVencimiento
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

// ✅ Ruta para ver todas las encomiendas vencidas
router.get('/vencidas', verificarToken, async (req, res) => {
  try {
    const vencidas = await Encomienda.find({ estado: 'vencida' });
    const remitenteUIDs = vencidas.map(e => e.uid);
    const remitentes = await User.find({ uid: { $in: remitenteUIDs } });

    const respuesta = vencidas.map(e => {
      const remitente = remitentes.find(r => r.uid === e.uid);
      return {
        _id: e._id,
        ciudadOrigen: e.ciudadOrigen,
        ciudadDestino: e.ciudadDestino,
        observaciones: e.observaciones,
        valor: e.valor,
        moneda: e.moneda,
        estado: e.estado,
        fechaCreacion: e.fechaCreacion,
        fechaVencimiento: e.fechaVencimiento,
        remitenteNombre: remitente?.nombre || 'Desconocido'
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error('❌ Error al obtener encomiendas vencidas:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas vencidas' });
  }
});

// ✅ Ruta para obtener TODAS las encomiendas del remitente autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    await actualizarEncomiendasVencidas();

    const uid = req.user.uid;

    const encomiendas = await Encomienda.find({ uid }).sort({ fechaCreacion: -1 });

    res.json(encomiendas); // devuelve la lista completa
  } catch (error) {
    console.error('❌ Error al obtener encomiendas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas del usuario' });
  }
});

router.post('/actualizar-vencidas', async (req, res) => {
  try {
    await actualizarEncomiendasVencidas();
    res.json({ mensaje: 'Encomiendas vencidas actualizadas' });
  } catch (error) {
    console.error('❌ Error al actualizar vencidas:', error);
    res.status(500).json({ error: 'Error en la tarea programada' });
  }
});

// ✅ Ruta para consultar si un emparejamiento es ideal
router.post('/evaluar-emparejamiento', verificarToken, async (req, res) => {
  const {
    origen_match,
    destino_match,
    dias_diferencia,
    valor_encomienda,
    reputacion_viajero,
  } = req.body;

  try {
    const respuesta = await axios.post(`${config.matchingApiUrl}/predict`, {
      origen_match,
      destino_match,
      dias_diferencia,
      valor_encomienda,
      reputacion_viajero,
    });

    res.json({ match: respuesta.data.match });
  } catch (error) {
    console.error('❌ Error al consultar motor IA:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al consultar motor de emparejamiento' });
  }
});

router.get('/disponibles', verificarToken, async (req, res) => {
  const { ciudadOrigen, ciudadDestino } = req.query;
  const filtro = {
    estado: 'disponible',
    ...(ciudadOrigen && { ciudadOrigen }),
    ...(ciudadDestino && { ciudadDestino }),
  };

  try {
    const encomiendas = await Encomienda.find(filtro);
    res.json(encomiendas);
  } catch (error) {
    console.error('❌ Error al obtener encomiendas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener encomiendas' });
  }
});

router.get('/mis-encomiendas', verificarToken, async (req, res) => {
  try {
    await actualizarEncomiendasVencidas();

    const uid = req.user.uid;

    const disponibles = await Encomienda.find({ uid, estado: 'disponible' });

    res.json({ disponibles });
  } catch (error) {
    console.error('❌ Error al obtener mis encomiendas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener mis encomiendas disponibles' });
  }
});

// ✅ Ruta para emparejar viajes con IA (remitente)
router.post('/emparejar-viajes', verificarToken, async (req, res) => {
  const { ciudadOrigen, ciudadDestino, fechaEncomienda, valorEncomienda } = req.body;

  try {
    const viajes = await require('../models/Viaje').find({
      ciudadOrigen,
      ciudadDestino,
      estado: 'disponible',
      uid: { $ne: req.user.uid } // excluye los del remitente
    });

    if (!viajes.length) {
      return res.status(200).json([]);
    }

    const { obtenerViajesSugeridos } = require('../services/iaRemitenteService');

    const sugerencias = await obtenerViajesSugeridos(
      { ciudadOrigen, ciudadDestino, fechaEncomienda, valorEncomienda },
      viajes
    );

    res.json(sugerencias);
  } catch (error) {
    console.error('❌ Error al emparejar viajes:', error);
    res.status(500).json({ error: 'Error interno al emparejar viajes' });
  }
});


module.exports = router;
