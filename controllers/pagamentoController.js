class pagamentoController{
    async screenPagamento(req, res){
        res.render('pagamento/pagamento')
    }
    async pagamentoTrinta(req, res){
        res.render('pagamento/pagamento30')
    }

    async pagamentoCinquenta(req, res){
        res.render('pagamento/pagamento50')
    }

    async pagamenotoOutros(req, res){
        res.render('pagamento/pagamentoOutros')
    }
}

module.exports = pagamentoController;