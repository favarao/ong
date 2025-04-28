const express = require('express');
const DevolucaoController = require('../controllers/devolucaoController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const devolucaoController = new DevolucaoController();
const authMiddleware = new AuthMiddleware();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware.verificarUsuarioLogado);

// Verificar se o usuário é admin para certas rotas que exigem privilégio administrativo
router.use('/excluir', authMiddleware.verificarAdmin);

// Rotas de visualização
router.get('/', devolucaoController.listagemView);
router.get('/cadastrar', devolucaoController.cadastroView);
router.get('/visualizar/:id', devolucaoController.visualizarView);

// Rotas de API
router.get('/buscar-cliente/:termo', devolucaoController.buscarCliente);
router.get('/listar-pedidos/:id', devolucaoController.listarPedidosCliente);
router.get('/buscar-produtos-pedido/:id', devolucaoController.buscarProdutosPedido);
router.post('/registrar', devolucaoController.registrarDevolucao);
router.post('/excluir', devolucaoController.excluir);

module.exports = router;