const User = require('../models/User');

// ======================================================
// 🧾 Registrar o actualizar usuario (UP SERT)
// ======================================================
const registerUser = async (req, res) => {
  try {
    // El middleware verificarToken ya adjunta req.user
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
      { uid }, // Buscar por UID de Firebase
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

    res.status(201).json({
      message: 'Usuario guardado correctamente',
      user,
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({
      error: 'Error interno al guardar el usuario',
    });
  }
};

// ======================================================
// 🔧 Actualizar usuario por UID (PUT /users/:uid)
// ======================================================
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = req.body;

    // Evitar que intenten cambiar el UID o email manualmente
    if (data.uid || data.email) {
      return res.status(400).json({
        error: 'No se permite modificar UID o email desde esta ruta',
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      data,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    res.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({
      error: 'Error interno al actualizar el usuario',
    });
  }
};

// ======================================================
// Exportación de controladores
// ======================================================
module.exports = {
  registerUser,
  updateUser,
};
