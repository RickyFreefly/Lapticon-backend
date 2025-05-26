const Rating = require('../models/Rating');

const crearCalificacion = async (req, res) => {
  try {
    const { usuarioDestino, rolDestino, calificacion, comentario, timestamp } = req.body;
    const usuarioOrigen = req.user.uid; // del token Firebase

    const nueva = new Rating({
      usuarioOrigen,
      usuarioDestino,
      rolDestino,
      calificacion,
      comentario,
      timestamp: timestamp || new Date()
    });

    await nueva.save();

    res.status(201).json({ mensaje: 'Calificación guardada', data: nueva });
  } catch (error) {
    console.error('❌ Error al guardar calificación:', error);
    res.status(500).json({ error: 'Error interno al guardar calificación' });
  }
};

const obtenerCalificacionesPorUsuario = async (req, res) => {
  const { uid } = req.params;

  try {
    const calificaciones = await Rating.find({ usuarioDestino: uid }).sort({ timestamp: -1 });

    // Calcular promedio
    const promedio =
      calificaciones.length > 0
        ? (calificaciones.reduce((sum, r) => sum + r.calificacion, 0) / calificaciones.length).toFixed(2)
        : null;

    res.json({
      total: calificaciones.length,
      promedio: promedio ? parseFloat(promedio) : null,
      calificaciones,
    });
  } catch (error) {
    console.error('❌ Error al obtener calificaciones:', error);
    res.status(500).json({ error: 'Error interno al consultar calificaciones' });
  }
};


module.exports = {
  crearCalificacion,
  obtenerCalificacionesPorUsuario,
};
