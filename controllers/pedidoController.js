const PedidoItemModel = require("../model/pedidoItemModel");
const PedidoModel = require("../model/pedidoModel");
const ProdutoModel = require("../model/produtoModel");


class PedidoController {


    async gravar(req, res) {
        // console.log(req.body);

        if(req.body != null) {

            let listaProdutos = [];
            //validação de estoque
            let listaValidacao = [];
            for(let i = 0; i<req.body.length; i++) {
                let produtoId = req.body[i].produtoId;
                let quantidade = req.body[i].quantidade;
                let produto = new ProdutoModel();
                if(await produto.validarEstoque(produtoId, quantidade) == false) {
                    listaValidacao.push(produtoId);
                }
            }

            if(listaValidacao.length == 0) {
                //prosseguir com a gravação
                let pedido = new PedidoModel();
                let pedidoId = await pedido.gravar();
                let produto = new ProdutoModel()
                //gerar os itens do pedido
                for(let i =0; i< req.body.length; i++) {
                    
                    let pedidoItem = new PedidoItemModel();

                    pedidoItem.pedidoItemQuantidade = req.body[i].quantidade;
                    
                    pedidoItem.pedidoId = pedidoId;

                    pedidoItem.produtoId = req.body[i].produtoId

                    produto = await produto.buscarProduto(req.body[i].produtoId);
                    
                    produto.produtoQuant = produto.produtoQuant - req.body[i].quantidade;
                    produto.cadastrar();

                    pedidoItem.pedidoItemValor = produto.produtoPreco;
            
                    pedidoItem.pedidoItemValorTotal = pedidoItem.pedidoItemQuantidade * pedidoItem.pedidoItemValor;
                    
                    pedidoItem.gravar();
                }

                res.send({ok: true, msg: "Pedido realizado!"});

            }
            else{
                res.send({ok: false, msg: "Erro durante a validação de estoque", lista: listaValidacao})
            }

        }
        else{
            res.send({ok: false, msg: "carrinho vazio!"});
        }
    }

}

module.exports = PedidoController;