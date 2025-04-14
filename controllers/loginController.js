const DoadorModel = require("../model/doadorModel");

class loginController{
    screenLogin(req, res){
        res.render('login/login', {layout: "login/login"});
    }

    screenCadastro(req, res){
        res.render('login/cadastro', {layout: "login/cadastro"});
    }

    logout(req, res){
        res.clearCookie("doadorLogado");
        res.redirect("/login");
        res.end();
    } 

    async login(req, res) {
        let msg = "";
        if(req.body.email != null && req.body.password != null) {
            let doador = new DoadorModel();
            doador = await doador.obterPorEmailSenha(req.body.email, req.body.password);
            if(doador != null) {
                res.cookie("doadorLogado", doador.doadorId);
                res.redirect("/produtos");
            }
            else {
                res.render('login/login', { msg: "Usuário ou senha inválidos", layout: 'login/login'});
            }
        }
        else {
            res.render('login/login', { msg: "Usuário ou senha inválidos", layout: 'login/login'});
        }
    }
    
    async cadastrar(req, resp){
        let msg = "";
        let cor = "";
        if(req.body.nome != "" && req.body.email != "" && req.body.senha != "" && req.body.cpf != "" && req.body.rg != "" && req.body.sexo != "" && req.body.telefone != "" && 
            req.body.endereco != "" && req.body.cep != "") {
            let doador = new DoadorModel(0, req.body.nome, req.body.cpf, req.body.rg, req.body.sexo, req.body.email, req.body.senha, req.body.telefone, req.body.endereco, req.body.cep
            );

            let result = await doador.cadastrar();

            if(result) {
                resp.send({
                    ok: true,
                    msg: "Usuário cadastrado com sucesso!"
                });
            }   
            else{
                resp.send({
                    ok: false,
                    msg: "Erro ao cadastrar usuário!"
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

}

module.exports = loginController;