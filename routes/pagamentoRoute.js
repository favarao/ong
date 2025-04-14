const express = require('express');
const pagamentoController = require('../controllers/pagamentoController');

const router = express.Router();
let ctrl = new pagamentoController();
router.get('/', ctrl.screenPagamento);
router.get('/pagamentoTrinta', ctrl.pagamentoTrinta);
router.get('/pagamentoCinquenta', ctrl.pagamentoCinquenta);
router.get('/pagamentoOutros', ctrl.pagamenotoOutros);

module.exports = router;