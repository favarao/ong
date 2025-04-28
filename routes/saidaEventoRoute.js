const express = require('express');
const SaidaEventoController = require('../controllers/saidaEventoController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const saidaEventoController = new SaidaEventoController();
const authMiddleware = new AuthMiddleware();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware.verificarUsuarioLogado);

// Todas as rotas de saída para evento requerem perfil admin
router.use(authMiddleware.verificarAdmin);

// Rotas de visualização
router.get('/', saidaEventoController.listagemView);
router.get('/cadastrar', saidaEventoController.cadastroView);
router.get('/visualizar/:id', saidaEventoController.visualizarView);

// Rotas de API
router.get('/buscar-produtos', saidaEventoController.buscarProdutos);
router.post('/verificar-estoque', saidaEventoController.verificarEstoque);
router.post('/registrar', saidaEventoController.registrarSaida);
router.post('/excluir', saidaEventoController.excluir);

module.exports = router;