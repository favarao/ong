const DevolucaoModel = require("../model/devolucaoModel");
const DevolucaoItemModel = require("../model/devolucaoItemModel");
const PedidoModel = require("../model/pedidoModel");
const ProdutoModel = require("../model/produtoModel");
const DoadorModel = require("../model/doadorModel");

class DevolucaoController {
    
    async listagemView(req, resp) {
        let devolucao = new DevolucaoModel();
        let listaDevolucao = await devolucao.listar();

        resp.render("devolucoes/listagem", {lista: listaDevolucao});
    }

    async cadastroView(req, resp) {
        resp.render("devolucoes/cadastro");
    }

    async buscarCliente(req, res) {
        const termoBusca = req.params.termo;
        let doador = new DoadorModel();
        
        if (!isNaN(termoBusca) && parseInt(termoBusca) > 0) {
            // Busca por ID
            let cliente = await doador.obter(parseInt(termoBusca));
            if (cliente) {
                res.send({ok: true, cliente: cliente.toJSON()});
            } else {
                res.send({ok: false, msg: "Cliente não encontrado!"});
            }
        } else {
            // Busca por nome
            let clientes = await doador.buscarPorNome(termoBusca);
            if (clientes && clientes.length > 0) {
                res.send({ok: true, clientes: clientes});
            } else {
                res.send({ok: false, msg: "Nenhum cliente encontrado!"});
            }
        }
    }

    async listarPedidosCliente(req, res) {
        const clienteId = req.params.id;
        let pedido = new PedidoModel();
        
        try {
            let pedidos = await pedido.listarPorCliente(clienteId);
            
            if (pedidos && pedidos.length > 0) {
                res.send({ok: true, pedidos: pedidos});
            } else {
                res.send({ok: false, msg: "Nenhum pedido encontrado para este cliente!"});
            }
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            res.send({ok: false, msg: "Erro ao buscar pedidos do cliente"});
        }
    }

    async buscarProdutosPedido(req, res) {
        const pedidoId = req.params.id;
        let pedido = new PedidoModel();
        
        try {
            let produtos = await pedido.buscarProdutos(pedidoId);
            
            if (produtos && produtos.length > 0) {
                res.send({ok: true, produtos: produtos});
            } else {
                res.send({ok: false, msg: "Nenhum produto encontrado neste pedido!"});
            }
        } catch (error) {
            console.error("Erro ao buscar produtos do pedido:", error);
            res.send({ok: false, msg: "Erro ao buscar produtos do pedido"});
        }
    }

    async registrarDevolucao(req, res) {
        if (!req.body.clienteId || !req.body.pedidoId || !req.body.produtos || req.body.produtos.length === 0) {
            return res.send({ok: false, msg: "Dados incompletos para devolução!"});
        }

        try {
            // Criar o registro da devolução
            let devolucao = new DevolucaoModel(
                0, 
                req.body.clienteId, 
                req.body.pedidoId, 
                new Date(), 
                req.body.tipoRetorno || 'produto',
                0 // Valor inicial
            );
            
            let devolucaoId = await devolucao.cadastrar();
            
            if (!devolucaoId) {
                return res.send({ok: false, msg: "Erro ao criar registro de devolução!"});
            }
            
            // Cadastrar os itens da devolução
            let valorTotal = 0;
            
            for (let i = 0; i < req.body.produtos.length; i++) {
                let item = req.body.produtos[i];
                
                // Buscar informações do produto
                let produto = new ProdutoModel();
                let produtoObj = await produto.buscarProduto(item.produtoId);
                
                if (!produtoObj) {
                    continue; // Produto não encontrado, pula para o próximo
                }
                
                // Registrar item da devolução
                let devolucaoItem = new DevolucaoItemModel(
                    0, 
                    devolucaoId, 
                    item.produtoId, 
                    item.quantidade, 
                    item.valorUnitario || produtoObj.produtoPreco,
                    item.defeito || false,
                    item.observacao || ''
                );
                
                await devolucaoItem.cadastrar();
                
                // Calcular valor total
                const valorItemTotal = (parseFloat(item.valorUnitario) || parseFloat(produtoObj.produtoPreco)) * parseInt(item.quantidade);
                valorTotal += valorItemTotal;
                
                // Atualizar estoque se o produto não tiver defeito ou se a devolução for em produto
                if (!item.defeito || req.body.tipoRetorno === 'produto') {
                    produtoObj.produtoQuant = parseInt(produtoObj.produtoQuant) + parseInt(item.quantidade);
                    await produtoObj.cadastrar();
                }
            }
            
            // Atualizar o valor total da devolução
            devolucao.devolucaoId = devolucaoId;
            devolucao.devolucaoValor = valorTotal;
            await devolucao.atualizarValor();
            
            // Se for devolução em dinheiro, atualizar o caixa (esta função seria implementada em outro lugar)
            if (req.body.tipoRetorno === 'dinheiro') {
                // TODO: Implementar atualização do caixa
                // Ex: await this.atualizarCaixa(-valorTotal, 'Devolução de produtos');
            }
            
            res.send({
                ok: true, 
                msg: "Devolução registrada com sucesso!", 
                devolucaoId: devolucaoId,
                valorTotal: valorTotal
            });
            
        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            res.send({ok: false, msg: "Erro ao processar devolução!"});
        }
    }

    async visualizarView(req, res) {
        try {
            let devolucaoId = req.params.id;
            let devolucao = new DevolucaoModel();
            let devolucaoData = await devolucao.obter(devolucaoId);
            
            if (!devolucaoData) {
                return res.render("devolucoes/visualizar", {
                    erro: "Devolução não encontrada!", 
                    devolucao: null, 
                    itens: []
                });
            }
            
            let devolucaoItem = new DevolucaoItemModel();
            let itens = await devolucaoItem.listarPorDevolucao(devolucaoId);
            
            res.render("devolucoes/visualizar", {
                devolucao: devolucaoData, 
                itens: itens
            });
            
        } catch (error) {
            console.error("Erro ao visualizar devolução:", error);
            res.render("devolucoes/visualizar", {
                erro: "Erro ao carregar dados da devolução!", 
                devolucao: null, 
                itens: []
            });
        }
    }

    async excluir(req, res) {
        if(req.body.id != null) {
            try {
                // Primeiro excluir os itens relacionados
                let devolucaoItem = new DevolucaoItemModel();
                await devolucaoItem.excluirPorDevolucao(req.body.id);
                
                // Depois excluir a devolução
                let devolucao = new DevolucaoModel();
                let ok = await devolucao.excluir(req.body.id);
                
                if(ok) {
                    res.send({ok: true});
                } else {
                    res.send({ok: false, msg: "Erro ao excluir devolução"});
                }
            } catch (error) {
                console.error("Erro ao excluir devolução:", error);
                res.send({ok: false, msg: "Erro ao excluir devolução"});
            }
        } else {
            res.send({ok: false, msg: "O id para exclusão não foi enviado"});
        }
    }
}

module.exports = DevolucaoController;