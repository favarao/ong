const DoacaoModel = require("../model/doacaoModel");
const DoacaoItemModel = require("../model/doacaoItemModel");
const ProjetoModel = require("../model/projetoModel");
const EventoModel = require("../model/eventoModel");
const PatrimonioModel = require("../model/patrimonioModel");
const Database = require("../utils/database");

class RelatorioController {
    
    // Relatório de Histórico de Doações
    async historicoDoacoesView(req, res) {
        try {
            // Buscar todas as doações diretamente do banco de dados
            const banco = new Database();
            
            let sql = `SELECT d.id_doacao, d.doador_id, d.data, d.valor, d.status, 
                      do.nome AS doador_nome
                      FROM doacao d 
                      INNER JOIN doador do ON d.doador_id = do.id_doador 
                      ORDER BY d.id_doacao DESC`;
            
            let rows = await banco.ExecutaComando(sql);
            let listaDoacoes = [];

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
                
                listaDoacoes.push({
                    doacaoId: row['id_doacao'],
                    doadorId: row['doador_id'],
                    doacaoData: dataFormatada,
                    doacaoValor: row['valor'],
                    doacaoStatus: row['status'],
                    doadorNome: row['doador_nome']
                });
            }
            
            // Para cada doação, buscar os itens
            for (let i = 0; i < listaDoacoes.length; i++) {
                let doacaoItem = new DoacaoItemModel();
                let itens = await doacaoItem.listarPorDoacao(listaDoacoes[i].doacaoId);
                listaDoacoes[i].itens = itens;
            }
            
            console.log("Total de doações encontradas:", listaDoacoes.length);
            
            res.render("relatorios/historico-doacoes", { 
                lista: listaDoacoes,
                totalDoacoes: listaDoacoes.length,
                valorTotal: listaDoacoes.reduce((sum, doacao) => sum + parseFloat(doacao.doacaoValor || 0), 0)
            });
        } catch (error) {
            console.error("Erro ao gerar relatório de doações:", error);
            res.render("relatorios/historico-doacoes", { 
                erro: "Erro ao carregar dados do relatório",
                lista: [],
                totalDoacoes: 0,
                valorTotal: 0
            });
        }
    }
    
    // Relatório de Histórico de Projetos
    async historicoProjetosView(req, res) {
        try {
            let projeto = new ProjetoModel();
            let listaProjetos = await projeto.listar();
            const banco = new Database();
            
            // Para cada projeto, buscar estatísticas relacionadas
            for (let i = 0; i < listaProjetos.length; i++) {
                // Buscar eventos relacionados ao projeto
                try {
                    let sqlEventos = "SELECT COUNT(*) as total FROM evento WHERE projeto_id = ?";
                    let rowsEventos = await banco.ExecutaComando(sqlEventos, [listaProjetos[i].projetoId]);
                    listaProjetos[i].eventos = rowsEventos[0].total || 0;
                } catch (error) {
                    console.error("Erro ao buscar eventos:", error);
                    listaProjetos[i].eventos = 0;
                }
                
                // Buscar patrimônios relacionados ao projeto
                try {
                    let sqlPatrimonios = "SELECT COUNT(*) as total FROM patrimonio WHERE projeto_id = ?";
                    let rowsPatrimonios = await banco.ExecutaComando(sqlPatrimonios, [listaProjetos[i].projetoId]);
                    listaProjetos[i].patrimonios = rowsPatrimonios[0].total || 0;
                } catch (error) {
                    console.error("Erro ao buscar patrimônios:", error);
                    listaProjetos[i].patrimonios = 0;
                }
            }
            
            res.render("relatorios/historico-projetos", { 
                lista: listaProjetos,
                totalProjetos: listaProjetos.length,
                valorTotalOrcamentos: listaProjetos.reduce((sum, projeto) => sum + parseFloat(projeto.projetoOrcamento || 0), 0)
            });
        } catch (error) {
            console.error("Erro ao gerar relatório de projetos:", error);
            res.render("relatorios/historico-projetos", { 
                erro: "Erro ao carregar dados do relatório",
                lista: [],
                totalProjetos: 0,
                valorTotalOrcamentos: 0
            });
        }
    }
    
    // API endpoints para exportar relatórios
    async exportarDoacoesPdf(req, res) {
        // Implementação futura para PDF
        res.send({ ok: false, msg: "Funcionalidade de PDF será implementada em breve" });
    }
    
    async exportarProjetosPdf(req, res) {
        // Implementação futura para PDF
        res.send({ ok: false, msg: "Funcionalidade de PDF será implementada em breve" });
    }
}

module.exports = RelatorioController;