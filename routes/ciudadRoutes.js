const express = require('express');
const router = express.Router();
const Ciudad = require('../models/City');

// GET /api/ciudades/ciudades
router.get('/ciudades', async (req, res) => {
  try {
    const ciudades = await Ciudad.distinct('city_ascii');
    res.json(ciudades);
  } catch (error) {
    console.error('❌ Error al obtener ciudades:', error);
    res.status(500).json({ error: 'Error al obtener las ciudades' });
  }
});

// GET /api/ciudades/paises
router.get('/paises', async (req, res) => {
  try {
    const paises = await Ciudad.distinct('country');
    res.json(paises);
  } catch (error) {
    console.error('❌ Error al obtener países:', error);
    res.status(500).json({ error: 'Error al obtener los países' });
  }
});

// GET /api/ciudades/ciudades-por-pais?nombre=India
router.get('/ciudades-por-pais', async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) {
    return res.status(400).json({ error: 'Parámetro "nombre" (del país) es requerido' });
  }

  try {
    const ciudades = await Ciudad.find({ country: nombre }).select('city_ascii -_id');
    const lista = ciudades.map(c => c.city_ascii);
    res.json(lista);
  } catch (error) {
    console.error('❌ Error al obtener ciudades por país:', error);
    res.status(500).json({ error: 'Error al obtener ciudades por país' });
  }
});

module.exports = router;
