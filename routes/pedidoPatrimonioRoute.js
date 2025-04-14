const express = require('express');

const pedidoPatrimonioController = require('../controllers/pedidoPatrimonioController');

const pedidopatrimonioRoute = express.Router();

let ctrl = new pedidoPatrimonioController();
pedidopatrimonioRoute.post('/gravar', ctrl.gravar);


module.exports = pedidopatrimonioRoute;