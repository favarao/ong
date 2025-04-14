const express = require('express');
const patrimonioControllers = require('../controllers/patrimonioController');

let control = new patrimonioControllers();

const router = express.Router();
router.get('/',control.listagemView);
router.get('/cadastrar',control.cadastroView);
router.post('/cadastrar',control.cadastrar);
router.get('/alterar/:id', control.alterarView);
router.post("/alterar", control.alterar);
router.post("/excluir", control.excluir);
router.get("/obter/:patrimonio", control.obter);
router.get("/filtrar/:termo/:filtro", control.filtrar);

module.exports = router;