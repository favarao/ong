const ProjetoModel = require("../model/projetoModel");

class ProjetoController {
    async listagemView(req, res) {
        let projeto = new ProjetoModel();
        let listaProjetos = await projeto.listar();
        res.render("projetos/listagem", { lista: listaProjetos });
    }

    async cadastroView(req, res) {
        res.render("projetos/cadastro");
    }

    async cadastrar(req, res) {
        let msg = "";
        if (
            req.body.nome != "" &&
            req.body.descricao != "" &&
            req.body.dataInic != "" &&
            req.body.dataFim != "" &&
            req.body.objetivo != "" &&
            req.body.orcamento != "" &&
            req.body.status != ""
        ) {
            let projeto = new ProjetoModel(
                0,
                req.body.nome,
                req.body.descricao,
                req.body.dataInic,
                req.body.dataFim,
                req.body.objetivo,
                req.body.orcamento,
                req.body.status
            );

            let result = await projeto.cadastrar();

            if (result) {
                res.send({ ok: true, msg: "Projeto cadastrado com sucesso!" });
            } else {
                res.send({ ok: false, msg: "Erro ao cadastrar projeto!" });
            }
        } else {
            res.send({ ok: false, msg: "Parâmetros preenchidos incorretamente!" });
        }
    }

    async alterarView(req, res) {
        let projeto = new ProjetoModel();
        projeto = await projeto.obter(req.params.id);
        res.render("projetos/alterar", { projeto: projeto });
    }

    async alterar(req, res) {
        if (
            req.body.id > 0 &&
            req.body.nome != "" &&
            req.body.descricao != "" &&
            req.body.dataInic != "" &&
            req.body.dataFim != "" &&
            req.body.objetivo != "" &&
            req.body.orcamento != "" &&
            req.body.status != ""
        ) {
            let projeto = new ProjetoModel(
                req.body.id,
                req.body.nome,
                req.body.descricao,
                req.body.dataInic,
                req.body.dataFim,
                req.body.objetivo,
                req.body.orcamento,
                req.body.status
            );

            let result = await projeto.cadastrar();

            if (result) {
                res.send({ ok: true, msg: "Projeto alterado com sucesso!" });
            } else {
                res.send({ ok: false, msg: "Erro ao alterar projeto!" });
            }
        } else {
            res.send({ ok: false, msg: "Parâmetros preenchidos incorretamente!" });
        }
    }

    async excluir(req, res) {
        if (req.body.id != null) {
            let projeto = new ProjetoModel();
            let ok = await projeto.excluir(req.body.id);
            if (ok) {
                res.send({ ok: true });
            } else {
                res.send({ ok: false, msg: "Erro ao excluir projeto" });
            }
        } else {
            res.send({ ok: false, msg: "O id para exclusão não foi enviado" });
        }
    }
}

module.exports = ProjetoController;