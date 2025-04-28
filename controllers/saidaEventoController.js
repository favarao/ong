const SaidaEventoModel = require("../model/saidaEventoModel");
const SaidaEventoItemModel = require("../model/saidaEventoItemModel");
const EventoModel = require("../model/eventoModel");
const ProdutoModel = require("../model/produtoModel");
const PatrimonioModel = require("../model/patrimonioModel");

class SaidaEventoController {
    
    async listagemView(req, resp) {
        let saidaEvento = new SaidaEventoModel();
        let listaSaidas = await saidaEvento.listar();

        resp.render("saidas-evento/listagem", { lista: listaSaidas });
    }

    async cadastroView(req, resp) {
        let evento = new EventoModel();
        let listaEventos = await evento.listar();
        resp.render("saidas-evento/cadastro", { listaEventos });
    }

    async buscarProdutos(req, res) {
        try {
            let produto = new ProdutoModel();
            let patrimonio = new PatrimonioModel();
            
            let listaProdutos = await produto.listar();
            let listaPatrimonios = await patrimonio.listar();
            
            res.send({
                ok: true,
                produtos: listaProdutos,
                patrimonios: listaPatrimonios
            });
        } catch (error) {
            console.error("Erro ao buscar produtos e patrimônios:", error);
            res.send({ ok: false, msg: "Erro ao buscar produtos e patrimônios" });
        }
    }

    async verificarEstoque(req, res) {
        try {
            const { tipo, id, quantidade } = req.body;
            
            if (!tipo || !id || !quantidade) {
                return res.send({ ok: false, msg: "Dados incompletos" });
            }
            
            if (tipo === 'produto') {
                let produto = new ProdutoModel();
                const disponivel = await produto.validarEstoque(id, quantidade);
                
                if (disponivel) {
                    return res.send({ ok: true });
                } else {
                    const produtoInfo = await produto.buscarProduto(id);
                    return res.send({ 
                        ok: false, 
                        msg: `Estoque insuficiente. Disponível: ${produtoInfo.produtoQuant}` 
                    });
                }
            } else if (tipo === 'patrimonio') {
                let patrimonio = new PatrimonioModel();
                const disponivel = await patrimonio.validarEstoque(id, quantidade);
                
                if (disponivel) {
                    return res.send({ ok: true });
                } else {
                    const patrimonioInfo = await patrimonio.buscarPatrimonio(id);
                    return res.send({ 
                        ok: false, 
                        msg: `Estoque insuficiente. Disponível: ${patrimonioInfo.patrimonioQuantidade}` 
                    });
                }
            }
            
            return res.send({ ok: false, msg: "Tipo de item inválido" });
        } catch (error) {
            console.error("Erro ao verificar estoque:", error);
            res.send({ ok: false, msg: "Erro ao verificar estoque" });
        }
    }

    async registrarSaida(req, res) {
        if (!req.body.eventoId || !req.body.itens || req.body.itens.length === 0) {
            return res.send({ ok: false, msg: "Dados incompletos para registrar saída" });
        }

        try {
            // Validar estoque de todos os itens
            const itens = req.body.itens;
            let estoqueInsuficiente = [];
            
            for (const item of itens) {
                if (item.tipo === 'produto') {
                    const produto = new ProdutoModel();
                    const disponivel = await produto.validarEstoque(item.id, item.quantidade);
                    
                    if (!disponivel) {
                        const produtoInfo = await produto.buscarProduto(item.id);
                        estoqueInsuficiente.push({
                            nome: produtoInfo.produtoNome,
                            disponivel: produtoInfo.produtoQuant
                        });
                    }
                } else if (item.tipo === 'patrimonio') {
                    const patrimonio = new PatrimonioModel();
                    const disponivel = await patrimonio.validarEstoque(item.id, item.quantidade);
                    
                    if (!disponivel) {
                        const patrimonioInfo = await patrimonio.buscarPatrimonio(item.id);
                        estoqueInsuficiente.push({
                            nome: patrimonioInfo.patrimonioNome,
                            disponivel: patrimonioInfo.patrimonioQuantidade
                        });
                    }
                }
            }
            
            if (estoqueInsuficiente.length > 0) {
                let mensagem = "Estoque insuficiente para os seguintes itens: ";
                mensagem += estoqueInsuficiente.map(item => `${item.nome} (disponível: ${item.disponivel})`).join(", ");
                
                return res.send({ ok: false, msg: mensagem });
            }
            
            // Criar o registro da saída
            let saidaEvento = new SaidaEventoModel(
                0, 
                req.body.eventoId, 
                new Date(), 
                req.body.observacao || null
            );
            
            let saidaId = await saidaEvento.cadastrar();
            
            if (!saidaId) {
                return res.send({ ok: false, msg: "Erro ao criar registro de saída para evento" });
            }
            
            // Cadastrar os itens da saída e atualizar estoques
            for (const item of itens) {
                // Registrar item da saída
                let saidaItem = new SaidaEventoItemModel(
                    0, 
                    saidaId, 
                    item.id, 
                    item.tipo, 
                    item.quantidade, 
                    item.observacao || null
                );
                
                await saidaItem.cadastrar();
                
                // Atualizar estoque
                if (item.tipo === 'produto') {
                    const produto = new ProdutoModel();
                    let produtoObj = await produto.buscarProduto(item.id);
                    produtoObj.produtoQuant = parseInt(produtoObj.produtoQuant) - parseInt(item.quantidade);
                    await produtoObj.cadastrar();
                } else if (item.tipo === 'patrimonio') {
                    const patrimonio = new PatrimonioModel();
                    let patrimonioObj = await patrimonio.buscarPatrimonio(item.id);
                    patrimonioObj.patrimonioQuantidade = parseInt(patrimonioObj.patrimonioQuantidade) - parseInt(item.quantidade);
                    await patrimonio.cadastrar();
                }
            }
            
            res.send({
                ok: true, 
                msg: "Saída para evento registrada com sucesso!", 
                saidaId: saidaId
            });
            
        } catch (error) {
            console.error("Erro ao registrar saída para evento:", error);
            res.send({ ok: false, msg: "Erro ao processar saída para evento" });
        }
    }

    async visualizarView(req, res) {
        try {
            let saidaId = req.params.id;
            let saidaEvento = new SaidaEventoModel();
            let saidaData = await saidaEvento.obter(saidaId);
            
            if (!saidaData) {
                return res.render("saidas-evento/visualizar", {
                    erro: "Saída não encontrada!", 
                    saida: null, 
                    itens: []
                });
            }
            
            let saidaItem = new SaidaEventoItemModel();
            let itens = await saidaItem.listarPorSaida(saidaId);
            
            res.render("saidas-evento/visualizar", {
                saida: saidaData, 
                itens: itens
            });
            
        } catch (error) {
            console.error("Erro ao visualizar saída:", error);
            res.render("saidas-evento/visualizar", {
                erro: "Erro ao carregar dados da saída!", 
                saida: null, 
                itens: []
            });
        }
    }

    async excluir(req, res) {
        if(req.body.id != null) {
            try {
                // Primeiro obtém os itens para restaurar o estoque
                let saidaItem = new SaidaEventoItemModel();
                let itens = await saidaItem.listarPorSaida(req.body.id);
                
                // Restaura o estoque
                for (const item of itens) {
                    if (item.tipo === 'produto') {
                        const produto = new ProdutoModel();
                        let produtoObj = await produto.buscarProduto(item.itemId);
                        produtoObj.produtoQuant = parseInt(produtoObj.produtoQuant) + parseInt(item.quantidade);
                        await produtoObj.cadastrar();
                    } else if (item.tipo === 'patrimonio') {
                        const patrimonio = new PatrimonioModel();
                        let patrimonioObj = await patrimonio.buscarPatrimonio(item.itemId);
                        patrimonioObj.patrimonioQuantidade = parseInt(patrimonioObj.patrimonioQuantidade) + parseInt(item.quantidade);
                        await patrimonio.cadastrar();
                    }
                }
                
                // Exclui os itens
                await saidaItem.excluirPorSaida(req.body.id);
                
                // Exclui a saída
                let saidaEvento = new SaidaEventoModel();
                let ok = await saidaEvento.excluir(req.body.id);
                
                if(ok) {
                    res.send({ok: true});
                } else {
                    res.send({ok: false, msg: "Erro ao excluir saída"});
                }
            } catch (error) {
                console.error("Erro ao excluir saída:", error);
                res.send({ok: false, msg: "Erro ao excluir saída"});
            }
        } else {
            res.send({ok: false, msg: "O id para exclusão não foi enviado"});
        }
    }
}

module.exports = SaidaEventoController;