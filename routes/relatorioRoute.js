const express = require('express');
const RelatorioController = require('../controllers/relatorioController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const relatorioController = new RelatorioController();
const authMiddleware = new AuthMiddleware();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware.verificarUsuarioLogado);

// Aplicar verificação de admin para todas as rotas de relatório
router.use(authMiddleware.verificarAdmin);

// Rotas de visualização de relatórios
router.get('/doacoes', relatorioController.historicoDoacoesView);
router.get('/projetos', relatorioController.historicoProjetosView);

// Rotas para exportação (futuro)
router.get('/doacoes/pdf', relatorioController.exportarDoacoesPdf);
router.get('/projetos/pdf', relatorioController.exportarProjetosPdf);

module.exports = router;