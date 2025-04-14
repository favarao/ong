const DoacaoModel = require("../model/doacaoModel");
const DoacaoItemModel = require("../model/doacaoItemModel");
const DoadorModel = require("../model/doadorModel");
const ProdutoModel = require("../model/produtoModel");

class DoacaoController {
    
    async listagemView(req, resp) {
        let doacao = new DoacaoModel();
        let listaDoacao = await doacao.listar();

        resp.render("doacoes/listagem", {lista: listaDoacao});
    }

    async cadastroView(req, resp) {
        resp.render("doacoes/cadastro");
    }

    async buscarDoador(req, res) {
        const termoBusca = req.params.termo;
        let doacao = new DoacaoModel();
        
        if (!isNaN(termoBusca) && parseInt(termoBusca) > 0) {
            // Busca por ID
            let doador = await doacao.buscarDoadorPorId(parseInt(termoBusca));
            if (doador) {
                res.send({ok: true, doador: doador});
            } else {
                res.send({ok: false, msg: "Doador não encontrado!"});
            }
        } else {
            // Busca por nome
            let doadores = await doacao.buscarDoadorPorNome(termoBusca);
            if (doadores && doadores.length > 0) {
                res.send({ok: true, doadores: doadores});
            } else {
                res.send({ok: false, msg: "Nenhum doador encontrado!"});
            }
        }
    }

    async listarProdutos(req, res) {
        let produto = new ProdutoModel();
        let listaProdutos = await produto.listar();
        res.send({produtos: listaProdutos});
    }

    async agendar(req, res) {
        if (!req.body.doadorId || !req.body.data) {
            return res.send({ok: false, msg: "Dados incompletos para agendamento!"});
        }

        try {
            // Criar o registro da doação
            let doacao = new DoacaoModel(
                0, 
                req.body.doadorId, 
                req.body.data, 
                req.body.valor || 0, 
                req.body.status || 'Agendada'
            );
            
            let doacaoId = await doacao.cadastrar();
            
            if (!doacaoId) {
                return res.send({ok: false, msg: "Erro ao criar agendamento de doação!"});
            }
            
            // Se houver produtos, cadastrar os itens da doação
            if (req.body.produtos && req.body.produtos.length > 0) {
                let produto = new ProdutoModel();
                
                for (let i = 0; i < req.body.produtos.length; i++) {
                    let produtoItem = req.body.produtos[i];
                    
                    // Verificar estoque
                    let produtoObj = await produto.buscarProduto(produtoItem.produtoId);
                    
                    if (!produtoObj) {
                        continue; // Produto não encontrado, pula para o próximo
                    }
                    
                    // Aumentar o estoque (doação)
                    produtoObj.produtoQuant = parseInt(produtoObj.produtoQuant) + parseInt(produtoItem.quantidade);
                    await produtoObj.cadastrar();
                    
                    // Registrar item da doação
                    let doacaoItem = new DoacaoItemModel(0, doacaoId, produtoItem.produtoId, produtoItem.quantidade);
                    await doacaoItem.cadastrar();
                }
            }
            
            res.send({
                ok: true, 
                msg: "Doação agendada com sucesso!", 
                doacaoId: doacaoId
            });
            
        } catch (error) {
            console.error("Erro ao agendar doação:", error);
            res.send({ok: false, msg: "Erro ao processar agendamento de doação!"});
        }
    }

    async visualizarView(req, res) {
        try {
            let doacaoId = req.params.id;
            let doacao = new DoacaoModel();
            let doacaoData = await doacao.obter(doacaoId);
            
            if (!doacaoData) {
                return res.render("doacoes/visualizar", {
                    erro: "Doação não encontrada!", 
                    doacao: null, 
                    itens: []
                });
            }
            
            let doacaoItem = new DoacaoItemModel();
            let itens = await doacaoItem.listarPorDoacao(doacaoId);
            
            res.render("doacoes/visualizar", {
                doacao: doacaoData, 
                itens: itens
            });
            
        } catch (error) {
            console.error("Erro ao visualizar doação:", error);
            res.render("doacoes/visualizar", {
                erro: "Erro ao carregar dados da doação!", 
                doacao: null, 
                itens: []
            });
        }
    }

    async excluir(req, res) {
        if(req.body.id != null) {
            try {
                // Primeiro excluir os itens relacionados
                let doacaoItem = new DoacaoItemModel();
                await doacaoItem.excluirPorDoacao(req.body.id);
                
                // Depois excluir a doação
                let doacao = new DoacaoModel();
                let ok = await doacao.excluir(req.body.id);
                
                if(ok) {
                    res.send({ok: true});
                } else {
                    res.send({ok: false, msg: "Erro ao excluir doação"});
                }
            } catch (error) {
                console.error("Erro ao excluir doação:", error);
                res.send({ok: false, msg: "Erro ao excluir doação"});
            }
        } else {
            res.send({ok: false, msg: "O id para exclusão não foi enviado"});
        }
    }
}

module.exports = DoacaoController;