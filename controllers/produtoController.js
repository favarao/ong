const produtoModel = require("../model/produtoModel");

class produtoController {
    
    async listagemView (req, resp) {
        let produto = new produtoModel();
        let listaproduto = await produto.listar()

        resp.render("produtos/listagem", {lista: listaproduto});
    }

    async cadastroView(req, resp) {
        resp.render("produtos/cadastro");
    }

    async cadastrar(req, resp){
        let msg = "";
        let cor = "";
        if(req.body.nome != "" && req.body.descricao != "" && req.body.preco != "" && req.body.quantidade != "") {

            let produto = new produtoModel(0, req.body.nome, req.body.descricao, req.body.preco, 
            req.body.quantidade);

            let result = await produto.cadastrar();

            if(result) {
                resp.send({
                    ok: true,
                    msg: "produto cadastrado com sucesso!"
                });
            }   
            else{
                resp.send({
                    ok: false,
                    msg: "Erro ao cadastrar produto!"
                });
            }
        }
        else
        {
            resp.send({
                ok: false,
                msg: "Parâmetros preenchidos incorretamente!"
            });
        }

    }

    async alterarView(req, res) {
        let produto = new produtoModel();
        produto = await produto.obter(req.params.id);
        res.render('produtos/alterar', {produto: produto})
    }

    async alterar(req, resp){
        let msg = "";
        let cor = "";
        if(req.body.id > 0 && req.body.nome != "" && req.body.descricao != "" && req.body.preco != "" && req.body.quantidade != "") {

            let produto = new produtoModel(req.body.id, req.body.nome, req.body.descricao, req.body.preco, req.body.quantidade);

            let result = await produto.cadastrar();

            if(result) {
                resp.send({
                    ok: true,
                    msg: "produto alterada com sucesso!"
                });
            }   
            else{
                resp.send({
                    ok: false,
                    msg: "Erro ao alterar produto!"
                });
            }
        }
        else
        {
            resp.send({
                ok: false,
                msg: "Parâmetros preenchidos incorretamente!"
            });
        }
    }

    async excluir(req, res) {
        if(req.body.id != null) {
            let produto = new produtoModel();
            let ok = await produto.excluir(req.body.id);
            if(ok) {
                res.send({ok: true});
            }
            else{
                res.send({ok: false, msg: "Erro ao excluir produto"})
            }
        }
        else{
            res.send({ok: false, msg: "O id para exclusão não foi enviado"})
        }
    }

    async obter(req, res) {
        let id = req.params.produto;
        let produto = new produtoModel();
        produto = await produto.buscarProduto(id);

        res.send({produtoEncontrado: produto});
    }

    async filtrar(req, res) {
        let termo = req.params.termo;
        let filtro = req.params.filtro;
        let produto = new produtoModel();
        var lista = await produto.listarProduto(termo, filtro);

        res.send(lista);
    }
}

module.exports = produtoController