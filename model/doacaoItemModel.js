const Database = require("../utils/database");

const banco = new Database();

class DoacaoItemModel {
    #doacaoItemId;
    #doacaoId;
    #produtoId;
    #doacaoItemQuantidade;
    #produtoNome;

    constructor(doacaoItemId, doacaoId, produtoId, doacaoItemQuantidade, produtoNome) {
        this.#doacaoItemId = doacaoItemId;
        this.#doacaoId = doacaoId;
        this.#produtoId = produtoId;
        this.#doacaoItemQuantidade = doacaoItemQuantidade;
        this.#produtoNome = produtoNome;
    }

    get doacaoItemId() { return this.#doacaoItemId; }
    set doacaoItemId(doacaoItemId) { this.#doacaoItemId = doacaoItemId; }

    get doacaoId() { return this.#doacaoId; }
    set doacaoId(doacaoId) { this.#doacaoId = doacaoId; }

    get produtoId() { return this.#produtoId; }
    set produtoId(produtoId) { this.#produtoId = produtoId; }

    get doacaoItemQuantidade() { return this.#doacaoItemQuantidade; }
    set doacaoItemQuantidade(doacaoItemQuantidade) { this.#doacaoItemQuantidade = doacaoItemQuantidade; }

    get produtoNome() { return this.#produtoNome; }
    set produtoNome(produtoNome) { this.#produtoNome = produtoNome; }

    async listarPorDoacao(doacaoId) {
        let sql = `SELECT di.id_doacao_item, di.doacao_id, di.produto_id, di.quantidade, p.nome AS produto_nome
                  FROM doacao_item di
                  INNER JOIN produto p ON di.produto_id = p.id_produto
                  WHERE di.doacao_id = ?
                  ORDER BY di.id_doacao_item`;
        
        let valores = [doacaoId];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(new DoacaoItemModel(
                row['id_doacao_item'],
                row['doacao_id'],
                row['produto_id'],
                row['quantidade'],
                row['produto_nome']
            ));
        }
        return lista;
    }

    async cadastrar() {
        let sql = "INSERT INTO doacao_item (doacao_id, produto_id, quantidade) VALUES (?, ?, ?)";
        
        let valores = [
            this.#doacaoId,
            this.#produtoId,
            this.#doacaoItemQuantidade
        ];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir(id) {
        let sql = "DELETE FROM doacao_item WHERE id_doacao_item = ?";
        let valores = [id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirPorDoacao(doacaoId) {
        let sql = "DELETE FROM doacao_item WHERE doacao_id = ?";
        let valores = [doacaoId];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    toJSON() {
        return {
            "doacaoItemId": this.#doacaoItemId,
            "doacaoId": this.#doacaoId,
            "produtoId": this.#produtoId,
            "doacaoItemQuantidade": this.#doacaoItemQuantidade,
            "produtoNome": this.#produtoNome
        };
    }
}

module.exports = DoacaoItemModel;