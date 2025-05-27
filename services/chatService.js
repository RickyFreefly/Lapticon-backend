// services/chatService.js
const Chat = require('../models/Chats');
const Encomienda = require('../models/Encomiendas');

async function cerrarChatSiEntregaConfirmada(encomiendaId) {
  const encomienda = await Encomienda.findById(encomiendaId);
  if (!encomienda || encomienda.estado !== 'recibida') return;

  const ambasCalificaciones = encomienda.viajeroCalifico && encomienda.remitenteCalifico;
  if (!ambasCalificaciones) return;

  const chat = await Chat.findOne({ encomiendaId });
  if (chat && chat.estado !== 'cerrado') {
    chat.estado = 'cerrado';
    chat.fechaCierre = new Date();
    await chat.save();
    console.log(`📩 Chat cerrado para encomienda ${encomiendaId}`);
  }
}

module.exports = { cerrarChatSiEntregaConfirmada };
