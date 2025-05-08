require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const viajeRoutes = require('./routes/viajeRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/viajes', viajeRoutes); 

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));

const vuelosRoute = require('./routes/vuelos');
app.use('/api/vuelos', vuelosRoute);
