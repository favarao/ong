const PedidoPatrimonioItemModel = require("../model/pedidoPatrimonioItemModel");
const PedidoPatrimonioModel = require("../model/pedidoPatrimonioModel");
const PatrimonioModel = require("../model/patrimonioModel");


class pedidoPatrimonioControlle {


    async gravar(req, res) {
        // console.log(req.body);

        if(req.body != null) {

            let listapatrimonios = [];
            //validação de estoque
            let listaValidacao = [];
            for(let i = 0; i<req.body.length; i++) {
                let patrimonioId = req.body[i].patrimonioId;
                let quantidade = req.body[i].quantidade;
                let patrimonio = new PatrimonioModel();
                if(await patrimonio.validarEstoque(patrimonioId, quantidade) == false) {
                    listaValidacao.push(patrimonioId);
                }
            }

            if(listaValidacao.length == 0) {
                //prosseguir com a gravação
                let pedido = new PedidoPatrimonioModel();
                let pedidoId = await pedido.gravar();
                let patrimonio = new PatrimonioModel()
                //gerar os itens do pedido
                for(let i =0; i< req.body.length; i++) {
                    
                    let pedidoItem = new PedidoPatrimonioItemModel();

                    pedidoItem.pedidoItemQuantidade = req.body[i].quantidade;
                    
                    pedidoItem.pedidoId = pedidoId;

                    pedidoItem.patrimonioId = req.body[i].patrimonioId;

                    patrimonio = await patrimonio.buscarPatrimonio(req.body[i].patrimonioId);
                    
                    patrimonio.patrimonioQuantidade = patrimonio.patrimonioQuantidade - req.body[i].quantidade;
                    patrimonio.cadastrar();
                    
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

module.exports = pedidoPatrimonioControlle;