const express = require('express');
const DoacaoController = require('../controllers/doacaoController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const doacaoController = new DoacaoController();
const authMiddleware = new AuthMiddleware();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware.verificarUsuarioLogado);

// Verificar se o usuário é admin para certas rotas
router.use('/cadastrar', authMiddleware.verificarAdmin);
router.use('/agendar', authMiddleware.verificarAdmin);
router.use('/excluir', authMiddleware.verificarAdmin);

// Rotas de visualização
router.get('/', doacaoController.listagemView);
router.get('/cadastrar', doacaoController.cadastroView);
router.get('/visualizar/:id', doacaoController.visualizarView);

// Rotas de API
router.get('/buscar-doador/:termo', doacaoController.buscarDoador);
router.get('/listar-produtos', doacaoController.listarProdutos);
router.post('/agendar', doacaoController.agendar);
router.post('/excluir', doacaoController.excluir);

module.exports = router;