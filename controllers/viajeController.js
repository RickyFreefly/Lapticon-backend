// controllers/viajeController.js
const Viaje = require('../models/Viaje');

const crearViaje = async (req, res) => {
  try {
    const nuevoViaje = new Viaje({
      uid: req.user.uid,
      paisOrigen: req.body.paisOrigen,
      ciudadOrigen: req.body.ciudadOrigen,
      paisDestino: req.body.paisDestino,
      ciudadDestino: req.body.ciudadDestino,
      fechaViaje: req.body.fechaViaje,
    });

    await nuevoViaje.save();
    res.status(201).json(nuevoViaje);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el viaje' });
  }
};

module.exports = { crearViaje }; 
