const express = require('express');
const strapiHandler = require('./strapiHandler');
const CustomError = require('../middlewares/customError');

const router = express.Router();

const serviceHandlers = {
  'strapi': strapiHandler,
};

router.post('/', async (req, res, next) => {
  const totalRequestSize = req.socket.bytesRead;
  const fechaHoraLocal = new Date().toLocaleString();
  console.log(`Logs a las ${fechaHoraLocal}`);
  (totalRequestSize > 102400) && console.log(`${fechaHoraLocal} - Total request size (headers + body) in bytes: ${totalRequestSize}`);
  const { service } = req.headers;
  try {
    if (service in serviceHandlers) {
      const handler = serviceHandlers[service];
      await handler(req);
      res.status(200).send('successful');
    } else {
      throw new CustomError('invalid service')
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;