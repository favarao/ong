const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();
let ctrl = new loginController();
router.get('/', ctrl.screenLogin);
router.post('/validar', ctrl.login);
router.get('/logout', ctrl.logout);
router.get('/cadastrar', ctrl.screenCadastro);
router.post('/cadastrar', ctrl.cadastrar);

module.exports = router;