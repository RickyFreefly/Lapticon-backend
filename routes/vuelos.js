// routes/vuelos.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:numero/:fecha', async (req, res) => {
  const { numero, fecha } = req.params;

  try {
    const response = await axios.get(`https://aerodatabox.p.rapidapi.com/flights/number/${numero}/${fecha}`, {
      headers: {
        'X-RapidAPI-Key': '0a4ff3a990msh7ef5791a1de66d4p16feffjsn307a4adae88c',
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      }
    });

    const vuelos = response.data;

    if (!Array.isArray(vuelos) || vuelos.length === 0) {
      return res.status(404).json({ error: 'No se encontró el vuelo' });
    }

    const vuelo = vuelos[0];

    const info = {
      ciudadOrigen: vuelo.departure.airport.municipalityName,
      paisOrigen: vuelo.departure.airport.countryCode,
      ciudadDestino: vuelo.arrival.airport.municipalityName,
      paisDestino: vuelo.arrival.airport.countryCode,
      fechaViaje: vuelo.departure.scheduledTime.local,
      aerolinea: vuelo.airline.name
    };

    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar vuelo', detalle: err.message });
  }
});

module.exports = router;
