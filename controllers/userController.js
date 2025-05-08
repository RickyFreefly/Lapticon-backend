const User = require('../models/User');
const admin = require('../services/firebaseService');

const registerUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, phone_number, picture } = decoded;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        uid,
        email,
        displayName: name,
        phoneNumber: phone_number,
        photoURL: picture
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Usuario guardado', user });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { registerUser };
