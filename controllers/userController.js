const User = require('../models/User');

// ✅ Registrar o actualizar usuario (upsert)
const registerUser = async (req, res) => {
  try {
    const { uid, email } = req.user;

    const {
      nombre,
      apellido,
      telefono,
      fechaNacimiento,
      nacionalidad,
      correo,
    } = req.body;

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

// ✅ Actualizar usuario por UID (desde ruta PUT /:uid)
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const datosActualizados = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      datosActualizados,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno al actualizar el usuario' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    console.log('🔍 UID desde token:', uid); // 👈 Agrega esto

    const user = await User.findOne({ uid });

    if (!user) {
      console.log('⚠️ No se encontró el usuario en la base de datos con ese uid');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil del usuario' });
  }
};

// ✅ Exportar ambos controladores
module.exports = {
  registerUser,
  updateUser,
  getUserProfile, // ✅ nuevo
};
