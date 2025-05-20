const axios = require("axios");
const config = require("../config");

async function obtenerViajesSugeridos(encomienda, viajes) {
  try {
    console.log("📤 Enviando al microservicio:", {
      encomienda,
      cantidadViajes: viajes.length,
      muestraViaje: viajes[0]
    });

    const response = await axios.post(`${config.matchingApiUrl}/predict-remitente`, {
      ciudadOrigen: encomienda.ciudadOrigen,
      ciudadDestino: encomienda.ciudadDestino,
      fechaEncomienda: encomienda.fechaEncomienda,
      valorEncomienda: encomienda.valorEncomienda,
      viajes: viajes.map(v => ({
        _id: v._id,
        uid: v.uid,
        ciudadOrigen: v.ciudadOrigen,
        ciudadDestino: v.ciudadDestino,
        fechaViaje: v.fechaViaje,
        capacidadDisponible: v.capacidadDisponible ?? 0.0,
        reputacion: v.reputacion ?? 0.0
      }))
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al consultar el motor de emparejamiento:", error.message);
    if (error.response?.data) {
      console.error("📩 Detalles:", error.response.data);
    }
    return [];
  }
}

module.exports = { obtenerViajesSugeridos };
