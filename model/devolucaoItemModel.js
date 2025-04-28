const Database = require("../utils/database");

const banco = new Database();

class DevolucaoItemModel {
    #devolucaoItemId;
    #devolucaoId;
    #produtoId;
    #quantidade;
    #valorUnitario;
    #defeito;
    #observacao;
    #produtoNome;

    constructor(devolucaoItemId, devolucaoId, produtoId, quantidade, valorUnitario, defeito, observacao, produtoNome) {
        this.#devolucaoItemId = devolucaoItemId;
        this.#devolucaoId = devolucaoId;
        this.#produtoId = produtoId;
        this.#quantidade = quantidade;
        this.#valorUnitario = valorUnitario;
        this.#defeito = defeito;
        this.#observacao = observacao;
        this.#produtoNome = produtoNome;
    }

    get devolucaoItemId() { return this.#devolucaoItemId; }
    set devolucaoItemId(devolucaoItemId) { this.#devolucaoItemId = devolucaoItemId; }

    get devolucaoId() { return this.#devolucaoId; }
    set devolucaoId(devolucaoId) { this.#devolucaoId = devolucaoId; }

    get produtoId() { return this.#produtoId; }
    set produtoId(produtoId) { this.#produtoId = produtoId; }

    get quantidade() { return this.#quantidade; }
    set quantidade(quantidade) { this.#quantidade = quantidade; }

    get valorUnitario() { return this.#valorUnitario; }
    set valorUnitario(valorUnitario) { this.#valorUnitario = valorUnitario; }

    get defeito() { return this.#defeito; }
    set defeito(defeito) { this.#defeito = defeito; }

    get observacao() { return this.#observacao; }
    set observacao(observacao) { this.#observacao = observacao; }

    get produtoNome() { return this.#produtoNome; }
    set produtoNome(produtoNome) { this.#produtoNome = produtoNome; }

    async listarPorDevolucao(devolucaoId) {
        let sql = `SELECT di.id_devolucao_item, di.devolucao_id, di.produto_id, di.quantidade, 
                   di.valor_unitario, di.defeito, di.observacao, p.nome AS produto_nome
                   FROM devolucao_item di
                   INNER JOIN produto p ON di.produto_id = p.id_produto
                   WHERE di.devolucao_id = ?
                   ORDER BY di.id_devolucao_item`;
        
        let valores = [devolucaoId];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(new DevolucaoItemModel(
                row['id_devolucao_item'],
                row['devolucao_id'],
                row['produto_id'],
                row['quantidade'],
                row['valor_unitario'],
                row['defeito'] === 1 || row['defeito'] === true,
                row['observacao'],
                row['produto_nome']
            ));
        }
        return lista;
    }

    async cadastrar() {
        let sql = "INSERT INTO devolucao_item (devolucao_id, produto_id, quantidade, valor_unitario, defeito, observacao) VALUES (?, ?, ?, ?, ?, ?)";
        
        let valores = [
            this.#devolucaoId,
            this.#produtoId,
            this.#quantidade,
            this.#valorUnitario,
            this.#defeito ? 1 : 0,
            this.#observacao
        ];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir(id) {
        let sql = "DELETE FROM devolucao_item WHERE id_devolucao_item = ?";
        let valores = [id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirPorDevolucao(devolucaoId) {
        let sql = "DELETE FROM devolucao_item WHERE devolucao_id = ?";
        let valores = [devolucaoId];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    toJSON() {
        return {
            "devolucaoItemId": this.#devolucaoItemId,
            "devolucaoId": this.#devolucaoId,
            "produtoId": this.#produtoId,
            "quantidade": this.#quantidade,
            "valorUnitario": this.#valorUnitario,
            "defeito": this.#defeito,
            "observacao": this.#observacao,
            "produtoNome": this.#produtoNome,
            "valorTotal": this.#quantidade * this.#valorUnitario
        };
    }
}

module.exports = DevolucaoItemModel;