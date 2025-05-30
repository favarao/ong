const Database = require("../utils/database");

const banco = new Database();

class PedidoItemModel {

    #pedidodoItemId;
    #pedidoId;
    #produtoId;
    #pedidoItemQuantidade;
    #pedidoItemValor;
    #pedidoItemValorTotal;

    get pedidoItemId() {
        return this.#pedidodoItemId;
    }
    set pedidoItemId(pedidoItemId) {
        this.#pedidodoItemId = pedidoItemId;
    }

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId) {
        this.#pedidoId = pedidoId;
    }

    get produtoId() {
        return this.#produtoId;
    }
    set produtoId(produtoId) {
        this.#produtoId = produtoId;
    }

    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }

    get pedidoItemValor() {
        return this.#pedidoItemValor;
    }
    set pedidoItemValor(pedidoItemValor) {
        this.#pedidoItemValor = pedidoItemValor;
    }

    get pedidoItemValorTotal() {
        return this.#pedidoItemValorTotal;
    }
    set pedidoItemValorTotal(pedidoItemValorTotal) {
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
    }

    constructor(pedidodoItemId, pedidoId, produtoId, pedidoItemQuantidade, pedidoItemValor, pedidoItemValorTotal) {
        this.#pedidodoItemId = pedidodoItemId;
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
        this.#pedidoItemValor = pedidoItemValor;
        this.#pedidoItemValorTotal = pedidoItemValorTotal;
    }

    async listar() {
        let sql = "select * from tb_pedidoitens";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            listaItens.push(new PedidoItemModel(row["pit_id"], row["ped_id"], row["id_produto"], row["pit_quantidade"], row["pit_valorunitario"], row["pit_valortotal"]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_pedidoitens (ped_id, id_produto, pit_quantidade, pit_valorunitario, pit_valortotal) values (?, ?, ?, ?, ?)";

        let valores = [this.#pedidoId, this.#produtoId, this.#pedidoItemQuantidade, this.#pedidoItemValor, this.#pedidoItemValorTotal];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}

module.exports = PedidoItemModel;