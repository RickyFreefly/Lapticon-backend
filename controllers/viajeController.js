const Viaje = require('../models/Viaje');

const crearViaje = async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Verifica si el usuario ya tiene un viaje disponible
    const viajeExistente = await Viaje.findOne({ uid, estado: 'disponible' });

    if (viajeExistente) {
      return res.status(400).json({
        error: 'Ya tienes un viaje disponible. Debes cerrarlo o cambiar su estado antes de registrar uno nuevo.'
      });
    }

    // 2. Crea el nuevo viaje
    const nuevoViaje = new Viaje({
      uid,
      numeroVuelo: req.body.numeroVuelo,
      ciudadOrigen: req.body.ciudadOrigen,
      ciudadDestino: req.body.ciudadDestino,
      fechaViaje: req.body.fechaViaje,
      estado: 'disponible' // por defecto
    });

    await nuevoViaje.save();
    res.status(201).json(nuevoViaje);

  } catch (error) {
    console.error('❌ Error al crear el viaje:', error);
    res.status(500).json({ error: 'Error al crear el viaje' });
  }
};

module.exports = { crearViaje };
