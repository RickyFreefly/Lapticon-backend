const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { uid, email } = req.user; // 👈 clave correcta

    const { nombre, apellido, telefono, fechaNacimiento, nacionalidad, correo } = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        uid,
        email,
        nombre,
        apellido,
        telefono,
        fechaNacimiento,
        nacionalidad,
        correo,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Usuario guardado correctamente', user });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno al guardar el usuario' });
  }
};

module.exports = { registerUser };
