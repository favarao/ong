const Database = require("../utils/database");

const banco = new Database();

class SaidaEventoItemModel {
    #itemSaidaId;
    #saidaId;
    #itemId;
    #tipo;
    #quantidade;
    #observacao;
    #itemNome;

    constructor(itemSaidaId, saidaId, itemId, tipo, quantidade, observacao, itemNome) {
        this.#itemSaidaId = itemSaidaId;
        this.#saidaId = saidaId;
        this.#itemId = itemId;
        this.#tipo = tipo; // 'produto' ou 'patrimonio'
        this.#quantidade = quantidade;
        this.#observacao = observacao;
        this.#itemNome = itemNome;
    }

    get itemSaidaId() { return this.#itemSaidaId; }
    set itemSaidaId(itemSaidaId) { this.#itemSaidaId = itemSaidaId; }

    get saidaId() { return this.#saidaId; }
    set saidaId(saidaId) { this.#saidaId = saidaId; }

    get itemId() { return this.#itemId; }
    set itemId(itemId) { this.#itemId = itemId; }

    get tipo() { return this.#tipo; }
    set tipo(tipo) { this.#tipo = tipo; }

    get quantidade() { return this.#quantidade; }
    set quantidade(quantidade) { this.#quantidade = quantidade; }

    get observacao() { return this.#observacao; }
    set observacao(observacao) { this.#observacao = observacao; }

    get itemNome() { return this.#itemNome; }
    set itemNome(itemNome) { this.#itemNome = itemNome; }

    async listarPorSaida(saidaId) {
        let sql = `
            SELECT si.id_item_saida, si.saida_id, si.item_id, si.tipo, si.quantidade, si.observacao,
                   CASE 
                     WHEN si.tipo = 'produto' THEN p.nome
                     WHEN si.tipo = 'patrimonio' THEN pat.nome
                     ELSE 'Desconhecido'
                   END AS item_nome
            FROM saida_evento_item si
            LEFT JOIN produto p ON si.tipo = 'produto' AND si.item_id = p.id_produto
            LEFT JOIN patrimonio pat ON si.tipo = 'patrimonio' AND si.item_id = pat.id_patrimonio
            WHERE si.saida_id = ?
            ORDER BY si.id_item_saida`;
        
        let valores = [saidaId];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(new SaidaEventoItemModel(
                row['id_item_saida'],
                row['saida_id'],
                row['item_id'],
                row['tipo'],
                row['quantidade'],
                row['observacao'],
                row['item_nome']
            ));
        }
        return lista;
    }

    async cadastrar() {
        let sql = "INSERT INTO saida_evento_item (saida_id, item_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?, ?)";
        
        let valores = [
            this.#saidaId,
            this.#itemId,
            this.#tipo,
            this.#quantidade,
            this.#observacao
        ];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir(id) {
        let sql = "DELETE FROM saida_evento_item WHERE id_item_saida = ?";
        let valores = [id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirPorSaida(saidaId) {
        let sql = "DELETE FROM saida_evento_item WHERE saida_id = ?";
        let valores = [saidaId];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    toJSON() {
        return {
            "itemSaidaId": this.#itemSaidaId,
            "saidaId": this.#saidaId,
            "itemId": this.#itemId,
            "tipo": this.#tipo,
            "quantidade": this.#quantidade,
            "observacao": this.#observacao,
            "itemNome": this.#itemNome
        };
    }
}

module.exports = SaidaEventoItemModel;