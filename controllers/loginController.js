const DoadorModel = require("../model/doadorModel");
const crypto = require('crypto');

class loginController{
    screenLogin(req, res){
        res.render('login/login', {layout: "login/login"});
    }

    screenCadastro(req, res){
        res.render('login/cadastro', {layout: "login/cadastro"});
    }

    recuperarSenhaView(req, res) {
        res.render('login/recuperar-senha', {layout: "login/recuperar-senha"});
    }

    trocarSenhaView(req, res) {
        res.render('login/trocar-senha', {layout: "login/trocar-senha"});
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

    // Gerar senha aleatória
    gerarSenhaAleatoria(tamanho = 8) {
        return crypto.randomBytes(Math.ceil(tamanho/2))
            .toString('hex')
            .slice(0, tamanho);
    }

    // Recuperar senha
    async recuperarSenha(req, res) {
        const email = req.body.email;

        if (!email) {
            return res.json({
                ok: false,
                msg: "Email não informado"
            });
        }

        try {
            let doador = new DoadorModel();
            const doadorEncontrado = await doador.obterPorEmail(email);

            if (!doadorEncontrado) {
                return res.json({
                    ok: false,
                    msg: "Email não encontrado no sistema"
                });
            }

            // Gerar nova senha baseada nos últimos 4 dígitos do telefone
            let telefone = doadorEncontrado.doadorTelefone;
            
            // Verificar se o telefone está disponível
            if (!telefone || telefone.length < 4) {
                return res.json({
                    ok: false,
                    msg: "Não foi possível recuperar a senha. Telefone não cadastrado corretamente."
                });
            }
            
            // Obter os últimos 4 dígitos do telefone
            const ultimos4Digitos = telefone.replace(/\D/g, '').slice(-4);
            
            if (ultimos4Digitos.length !== 4) {
                return res.json({
                    ok: false,
                    msg: "Não foi possível recuperar a senha. Telefone não possui dígitos suficientes."
                });
            }

            // Atualizar senha no banco de dados
            doadorEncontrado.doadorSenha = ultimos4Digitos;
            const resultadoAtualizacao = await doadorEncontrado.cadastrar();

            if (!resultadoAtualizacao) {
                return res.json({
                    ok: false,
                    msg: "Erro ao atualizar a senha"
                });
            }

            return res.json({
                ok: true,
                msg: "Sua senha foi redefinida para os últimos 4 dígitos do seu telefone cadastrado. Por favor, faça login e altere sua senha."
            });

        } catch (error) {
            console.error("Erro na recuperação de senha:", error);
            return res.json({
                ok: false,
                msg: "Erro ao processar solicitação"
            });
        }
    }

    // Trocar senha
    async trocarSenha(req, res) {
        if (!req.cookies.doadorLogado) {
            return res.json({
                ok: false,
                msg: "Usuário não autenticado"
            });
        }

        const doadorId = req.cookies.doadorLogado;
        const senhaAtual = req.body.senhaAtual;
        const novaSenha = req.body.novaSenha;

        if (!senhaAtual || !novaSenha) {
            return res.json({
                ok: false,
                msg: "Senhas não informadas corretamente"
            });
        }

        try {
            // Buscar doador no banco de dados
            let doadorModel = new DoadorModel();
            let doador = await doadorModel.obter(doadorId);

            if (!doador) {
                return res.json({
                    ok: false,
                    msg: "Usuário não encontrado"
                });
            }

            // Verificar se a senha atual está correta
            if (doador.doadorSenha !== senhaAtual) {
                return res.json({
                    ok: false,
                    msg: "Senha atual incorreta"
                });
            }

            // Atualizar para a nova senha
            doador.doadorSenha = novaSenha;
            const resultado = await doador.cadastrar();

            if (resultado) {
                return res.json({
                    ok: true,
                    msg: "Senha alterada com sucesso!"
                });
            } else {
                return res.json({
                    ok: false,
                    msg: "Erro ao atualizar senha no sistema"
                });
            }

        } catch (error) {
            console.error("Erro ao trocar senha:", error);
            return res.json({
                ok: false,
                msg: "Erro ao processar solicitação"
            });
        }
    }
}

module.exports = loginController;