/* eslint-disable no-unused-vars */
require('dotenv').config();
const CustomError = require("../middlewares/customError");
// const fs = require('fs');
const moment = require('moment');
moment().format(); 
// const BACK_URL = process.env.BACKEND_URL;

const handleCases = {
  // 'usuario': {
  //   'entry.create': createUser,
  //   'entry.update': updateUser,
  //   'entry.delete': handlerCases
  // },
  // 'organizacion': handlerCases,
  // 'empleado': {
  //   'entry.create': handlerEmpleado,
  //   'entry.update': handlerEmpleado,
  //   'entry.delete': handlerCases
  // },
  // 'categoria': handlerCases,
  // 'accion': {
  //   'entry.create': handlerAction,
  //   'entry.update': handlerAction,
  //   'entry.delete': handlerCases,
  // },
  // 'evento': {
  //   'entry.create': handlerEvent,
  //   'entry.update': handlerEvent,
  //   'entry.delete': handlerEventDelete
  // },
  // 'usuario-voucher': {
  //   'entry.create': (req) => handlerUsuarioVoucher(req, true),
  //   'entry.update': (req) => handlerUsuarioVoucher(req, false),
  //   'entry.delete': handlerCases
  // },
  // 'parametros-interno': {
  //   'entry.create': handlerParametrosInternos,
  //   'entry.update': handlerParametrosInternos
  // },
  // 'usuario-medida': {
  //   'entry.create': handlerUsuarioMedida,
  //   'entry.update': handlerCases,
  //   'entry.delete': handlerCases
  // }
};

const strapiHandler = async (req) => {
  const { model, event } = req.body
  //
  console.log("Handler of service in serviceHandlers -> strapiHandler: ", model, event)
  if ((model && event) && ['usuario', 'empleado', 'accion', 'evento', 'usuario-voucher', 'parametros-interno', 'usuario-medida'].includes(model)) {
    const handler = handleCases[model][event];
    await handler(req);
  } else if (model !== 'usuario') {
    // const handler = handleCases[model];
    // handlerCases(req);
  } else {
    throw new CustomError('invalid model or event')
  }

};

module.exports = strapiHandler