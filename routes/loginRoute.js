const express = require('express');
const loginController = require('../controllers/loginController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const authMiddleware = new AuthMiddleware();
let ctrl = new loginController();

// Rotas públicas
router.get('/', ctrl.screenLogin);
router.post('/validar', ctrl.login);
router.get('/logout', ctrl.logout);
router.get('/cadastrar', ctrl.screenCadastro);
router.post('/cadastrar', ctrl.cadastrar);
router.get('/recuperar-senha', ctrl.recuperarSenhaView);
router.post('/recuperar-senha', ctrl.recuperarSenha);

// Rotas protegidas
router.get('/trocar-senha', authMiddleware.verificarUsuarioLogado, ctrl.trocarSenhaView);
router.post('/trocar-senha', authMiddleware.verificarUsuarioLogado, ctrl.trocarSenha);

module.exports = router;