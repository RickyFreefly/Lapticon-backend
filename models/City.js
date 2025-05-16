// models/City.js
const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
  city_ascii: String,
  country: String,
  iso2: String,
  iso3: String
});

module.exports = mongoose.models.ciudades || mongoose.model('ciudades', ciudadSchema);
