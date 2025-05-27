require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const viajeRoutes = require('./routes/viajeRoutes');
const vuelosRoute = require('./routes/vuelos');
const availableRoutes = require('./routes/availableRoutes');
const ciudadRoutes = require('./routes/ciudadRoutes');
const encomiendasRoutes = require('./routes/encomiendasRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const chatsRoutes = require('./routes/chatsRoutes');


const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión a MongoDB', err));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/viajes', viajeRoutes);
app.use('/api/vuelos', vuelosRoute);
app.use('/api/viajes', availableRoutes);
app.use('/api/ciudades', ciudadRoutes);
app.use('/api/encomiendas', encomiendasRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/chats', chatsRoutes);

// Servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor en http://localhost:${config.port}`);
});
