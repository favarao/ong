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
            const banco = new Database();
            const { dataInicio, dataFim } = req.query;
            
            // Construir filtros de data
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE d.data BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE d.data >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE d.data <= ?";
                parametros = [dataFim];
            }
            
            // Buscar doações
            let sqlDoacoes = `SELECT d.id_doacao, d.doador_id, d.data, d.valor, d.status, 
                             do.nome AS doador_nome
                             FROM doacao d 
                             INNER JOIN doador do ON d.doador_id = do.id_doador 
                             ${filtroData}
                             ORDER BY d.id_doacao DESC`;
            
            let rowsDoacoes = await banco.ExecutaComando(sqlDoacoes, parametros);
            let listaDoacoes = [];
    
            for (let i = 0; i < rowsDoacoes.length; i++) {
                let row = rowsDoacoes[i];
                let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
                
                listaDoacoes.push({
                    doacaoId: row['id_doacao'],
                    doadorId: row['doador_id'],
                    doacaoData: dataFormatada,
                    doacaoValor: row['valor'],
                    doacaoStatus: row['status'],
                    doadorNome: row['doador_nome'],
                    itens: [] // Inicializar array vazio
                });
            }
            
            // Buscar todos os itens de uma vez
            if (listaDoacoes.length > 0) {
                let sqlItens = `SELECT di.doacao_id, di.produto_id, di.quantidade, p.nome AS produto_nome
                               FROM doacao_item di
                               INNER JOIN produto p ON di.produto_id = p.id_produto
                               WHERE di.doacao_id IN (${listaDoacoes.map(d => d.doacaoId).join(',')})
                               ORDER BY di.doacao_id, di.id_doacao_item`;
                
                let rowsItens = await banco.ExecutaComando(sqlItens);
                
                // Agrupar itens por doação
                for (let item of rowsItens) {
                    let doacao = listaDoacoes.find(d => d.doacaoId === item.doacao_id);
                    if (doacao) {
                        doacao.itens.push({
                            produtoId: item.produto_id,
                            doacaoItemQuantidade: item.quantidade,
                            produtoNome: item.produto_nome
                        });
                    }
                }
            }
            
            res.render("relatorios/historico-doacoes", { 
                lista: listaDoacoes,
                totalDoacoes: listaDoacoes.length,
                valorTotal: listaDoacoes.reduce((sum, doacao) => sum + parseFloat(doacao.doacaoValor || 0), 0),
                filtros: { 
                    dataInicio: dataInicio || "", 
                    dataFim: dataFim || "" 
                }
            });
        } catch (error) {
            console.error("Erro ao gerar relatório de doações:", error);
            res.render("relatorios/historico-doacoes", { 
                erro: "Erro ao carregar dados do relatório",
                lista: [],
                totalDoacoes: 0,
                valorTotal: 0,
                filtros: { 
                    dataInicio: "", 
                    dataFim: "" 
                }
            });
        }
    }
    
    // Relatório de Histórico de Projetos
    async historicoProjetosView(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;
            let projeto = new ProjetoModel();
            
            // Construir filtros de data
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE p.data_inicio BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE p.data_inicio >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE p.data_inicio <= ?";
                parametros = [dataFim];
            }
            
            const banco = new Database();
            let sql = `SELECT * FROM projetos p ${filtroData} ORDER BY p.id_projeto DESC`;
            let rows = await banco.ExecutaComando(sql, parametros);
            
            let listaProjetos = [];
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                listaProjetos.push({
                    projetoId: row['id_projeto'],
                    projetoNome: row['nome'],
                    projetoDescricao: row['descricao'],
                    projetoDataInic: row['data_inicio'] ? new Date(row['data_inicio']).toISOString().split('T')[0] : null,
                    projetoDataFim: row['data_fim'] ? new Date(row['data_fim']).toISOString().split('T')[0] : null,
                    projetoObjetivo: row['objetivo'],
                    projetoOrcamento: row['orcamento'],
                    projetoStatu: row['status']
                });
            }
            
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
                valorTotalOrcamentos: listaProjetos.reduce((sum, projeto) => sum + parseFloat(projeto.projetoOrcamento || 0), 0),
                filtros: { 
                    dataInicio: dataInicio || "", 
                    dataFim: dataFim || "" 
                }
            });
        } catch (error) {
            console.error("Erro ao gerar relatório de projetos:", error);
            res.render("relatorios/historico-projetos", { 
                erro: "Erro ao carregar dados do relatório",
                lista: [],
                totalProjetos: 0,
                valorTotalOrcamentos: 0,
                filtros: { 
                    dataInicio: "", 
                    dataFim: "" 
                }
            });
        }
    }
    
    // Página de impressão para doações
    async imprimirDoacoes(req, res) {
        try {
            const banco = new Database();
            const { dataInicio, dataFim } = req.query;
            
            // Construir filtros de data
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE d.data BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE d.data >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE d.data <= ?";
                parametros = [dataFim];
            }
            
            // Buscar doações
            let sqlDoacoes = `SELECT d.id_doacao, d.doador_id, d.data, d.valor, d.status, 
                             do.nome AS doador_nome
                             FROM doacao d 
                             INNER JOIN doador do ON d.doador_id = do.id_doador 
                             ${filtroData}
                             ORDER BY d.id_doacao DESC`;
            
            let rowsDoacoes = await banco.ExecutaComando(sqlDoacoes, parametros);
            let listaDoacoes = [];
    
            for (let i = 0; i < rowsDoacoes.length; i++) {
                let row = rowsDoacoes[i];
                let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
                
                listaDoacoes.push({
                    doacaoId: row['id_doacao'],
                    doadorId: row['doador_id'],
                    doacaoData: dataFormatada,
                    doacaoValor: row['valor'],
                    doacaoStatus: row['status'],
                    doadorNome: row['doador_nome'],
                    itens: []
                });
            }
            
            // Buscar itens
            if (listaDoacoes.length > 0) {
                let sqlItens = `SELECT di.doacao_id, di.produto_id, di.quantidade, p.nome AS produto_nome
                               FROM doacao_item di
                               INNER JOIN produto p ON di.produto_id = p.id_produto
                               WHERE di.doacao_id IN (${listaDoacoes.map(d => d.doacaoId).join(',')})
                               ORDER BY di.doacao_id, di.id_doacao_item`;
                
                let rowsItens = await banco.ExecutaComando(sqlItens);
                
                for (let item of rowsItens) {
                    let doacao = listaDoacoes.find(d => d.doacaoId === item.doacao_id);
                    if (doacao) {
                        doacao.itens.push({
                            produtoId: item.produto_id,
                            doacaoItemQuantidade: item.quantidade,
                            produtoNome: item.produto_nome
                        });
                    }
                }
            }
            
            res.render("relatorios/imprimir-doacoes", { 
                lista: listaDoacoes,
                totalDoacoes: listaDoacoes.length,
                valorTotal: listaDoacoes.reduce((sum, doacao) => sum + parseFloat(doacao.doacaoValor || 0), 0),
                filtros: { 
                    dataInicio: dataInicio || "", 
                    dataFim: dataFim || "" 
                },
                layout: false // Remove o layout padrão para impressão
            });
        } catch (error) {
            console.error("Erro ao gerar página de impressão:", error);
            res.status(500).send("Erro ao gerar relatório para impressão");
        }
    }
    
    // Página de impressão para projetos
    async imprimirProjetos(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;
            const banco = new Database();
            
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE p.data_inicio BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE p.data_inicio >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE p.data_inicio <= ?";
                parametros = [dataFim];
            }
            
            let sql = `SELECT * FROM projetos p ${filtroData} ORDER BY p.id_projeto DESC`;
            let rows = await banco.ExecutaComando(sql, parametros);
            
            let listaProjetos = [];
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                listaProjetos.push({
                    projetoId: row['id_projeto'],
                    projetoNome: row['nome'],
                    projetoDescricao: row['descricao'],
                    projetoDataInic: row['data_inicio'] ? new Date(row['data_inicio']).toISOString().split('T')[0] : null,
                    projetoDataFim: row['data_fim'] ? new Date(row['data_fim']).toISOString().split('T')[0] : null,
                    projetoObjetivo: row['objetivo'],
                    projetoOrcamento: row['orcamento'],
                    projetoStatu: row['status']
                });
            }
            
            // Buscar estatísticas para cada projeto
            for (let i = 0; i < listaProjetos.length; i++) {
                try {
                    let sqlEventos = "SELECT COUNT(*) as total FROM evento WHERE projeto_id = ?";
                    let rowsEventos = await banco.ExecutaComando(sqlEventos, [listaProjetos[i].projetoId]);
                    listaProjetos[i].eventos = rowsEventos[0].total || 0;
                    
                    let sqlPatrimonios = "SELECT COUNT(*) as total FROM patrimonio WHERE projeto_id = ?";
                    let rowsPatrimonios = await banco.ExecutaComando(sqlPatrimonios, [listaProjetos[i].projetoId]);
                    listaProjetos[i].patrimonios = rowsPatrimonios[0].total || 0;
                } catch (error) {
                    console.error("Erro ao buscar estatísticas:", error);
                    listaProjetos[i].eventos = 0;
                    listaProjetos[i].patrimonios = 0;
                }
            }
            
            res.render("relatorios/imprimir-projetos", { 
                lista: listaProjetos,
                totalProjetos: listaProjetos.length,
                valorTotalOrcamentos: listaProjetos.reduce((sum, projeto) => sum + parseFloat(projeto.projetoOrcamento || 0), 0),
                filtros: { 
                    dataInicio: dataInicio || "", 
                    dataFim: dataFim || "" 
                },
                layout: false // Remove o layout padrão para impressão
            });
        } catch (error) {
            console.error("Erro ao gerar página de impressão:", error);
            res.status(500).send("Erro ao gerar relatório para impressão");
        }
    }
    
    // Exportar doações em CSV
    async exportarDoacoesCsv(req, res) {
        try {
            const banco = new Database();
            const { dataInicio, dataFim } = req.query;
            
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE d.data BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE d.data >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE d.data <= ?";
                parametros = [dataFim];
            }
            
            let sqlDoacoes = `SELECT d.id_doacao, d.doador_id, d.data, d.valor, d.status, 
                             do.nome AS doador_nome
                             FROM doacao d 
                             INNER JOIN doador do ON d.doador_id = do.id_doador 
                             ${filtroData}
                             ORDER BY d.id_doacao DESC`;
            
            let rowsDoacoes = await banco.ExecutaComando(sqlDoacoes, parametros);
            
            // Criar CSV
            let csv = "ID,Doador,Data,Valor,Status,Itens\n";
            
            for (let row of rowsDoacoes) {
                let dataFormatada = row['data'] ? new Date(row['data']).toLocaleDateString('pt-BR') : '';
                
                // Buscar itens da doação
                let sqlItens = `SELECT p.nome, di.quantidade 
                               FROM doacao_item di
                               INNER JOIN produto p ON di.produto_id = p.id_produto
                               WHERE di.doacao_id = ?`;
                let itens = await banco.ExecutaComando(sqlItens, [row['id_doacao']]);
                
                let itensStr = itens.map(item => `${item.nome}(${item.quantidade})`).join('; ');
                
                csv += `${row['id_doacao']},"${row['doador_nome']}","${dataFormatada}","R$ ${parseFloat(row['valor'] || 0).toFixed(2)}","${row['status']}","${itensStr}"\n`;
            }
            
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="relatorio-doacoes-${new Date().toISOString().split('T')[0]}.csv"`);
            res.send('\ufeff' + csv); // BOM para UTF-8
            
        } catch (error) {
            console.error("Erro ao exportar CSV:", error);
            res.status(500).json({ ok: false, msg: "Erro ao exportar CSV" });
        }
    }
    
    // Exportar projetos em CSV
    async exportarProjetosCsv(req, res) {
        try {
            const { dataInicio, dataFim } = req.query;
            const banco = new Database();
            
            let filtroData = "";
            let parametros = [];
            
            if (dataInicio && dataFim) {
                filtroData = "WHERE p.data_inicio BETWEEN ? AND ?";
                parametros = [dataInicio, dataFim];
            } else if (dataInicio) {
                filtroData = "WHERE p.data_inicio >= ?";
                parametros = [dataInicio];
            } else if (dataFim) {
                filtroData = "WHERE p.data_inicio <= ?";
                parametros = [dataFim];
            }
            
            let sql = `SELECT * FROM projetos p ${filtroData} ORDER BY p.id_projeto DESC`;
            let rows = await banco.ExecutaComando(sql, parametros);
            
            // Criar CSV
            let csv = "ID,Nome,Período,Orçamento,Status,Eventos,Patrimônios\n";
            
            for (let row of rows) {
                let dataInicio = row['data_inicio'] ? new Date(row['data_inicio']).toLocaleDateString('pt-BR') : '';
                let dataFim = row['data_fim'] ? new Date(row['data_fim']).toLocaleDateString('pt-BR') : '';
                
                // Buscar estatísticas
                let sqlEventos = "SELECT COUNT(*) as total FROM evento WHERE projeto_id = ?";
                let rowsEventos = await banco.ExecutaComando(sqlEventos, [row['id_projeto']]);
                let eventos = rowsEventos[0].total || 0;
                
                let sqlPatrimonios = "SELECT COUNT(*) as total FROM patrimonio WHERE projeto_id = ?";
                let rowsPatrimonios = await banco.ExecutaComando(sqlPatrimonios, [row['id_projeto']]);
                let patrimonios = rowsPatrimonios[0].total || 0;
                
                csv += `${row['id_projeto']},"${row['nome']}","${dataInicio} - ${dataFim}","R$ ${parseFloat(row['orcamento'] || 0).toFixed(2)}","${row['status']}","${eventos}","${patrimonios}"\n`;
            }
            
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="relatorio-projetos-${new Date().toISOString().split('T')[0]}.csv"`);
            res.send('\ufeff' + csv); // BOM para UTF-8
            
        } catch (error) {
            console.error("Erro ao exportar CSV:", error);
            res.status(500).json({ ok: false, msg: "Erro ao exportar CSV" });
        }
    }
    
    // API endpoints para exportar relatórios em PDF (implementação futura)
    async exportarDoacoesPdf(req, res) {
        res.send({ ok: false, msg: "Funcionalidade de PDF será implementada em breve" });
    }
    
    async exportarProjetosPdf(req, res) {
        res.send({ ok: false, msg: "Funcionalidade de PDF será implementada em breve" });
    }
}

module.exports = RelatorioController;