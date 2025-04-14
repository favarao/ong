const Database = require("../utils/database");

const banco = new Database();

class PedidoPatrimonioItemModel {

    #pedidodoItemId;
    #pedidoId;
    #patrimonioId;
    #pedidoItemQuantidade;

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

    get patrimonioId() {
        return this.#patrimonioId;
    }
    set patrimonioId(patrimonioId) {
        this.#patrimonioId = patrimonioId;
    }

    get pedidoItemQuantidade() {
        return this.#pedidoItemQuantidade;
    }
    set pedidoItemQuantidade(pedidoItemQuantidade) {
        this.#pedidoItemQuantidade = pedidoItemQuantidade;
    }

    constructor(pedidodoItemId, pedidoId, patrimonioId, pedidoItemQuantidade) {
        this.#pedidodoItemId = pedidodoItemId;
        this.#pedidoId = pedidoId;
        this.#patrimonioId = patrimonioId;
        this.#pedidoItemQuantidade = pedidoItemQuantidade;

    }

    async listar() {
        let sql = "select * from tb_pedidoitenspatrimonio";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaItens = [];

        for(let i = 0; i< rows.length; i++) {
            let row = rows[i];
            listaItens.push(new PedidoPatrimonioItemModel(row["pitpat_id "], row["pedpat_id  "], row["id_patrimonio "], row["pitpat_quantidade "]));
        }

        return listaItens;
    }

    async gravar() {
        let sql = "insert into tb_pedidoitenspatrimonio (pitpat_id, pedpat_id, id_patrimonio, pitpat_quantidade) values (?, ?, ?, ? )";

        let valores = [this.#pedidodoItemId, this.#pedidoId, this.#patrimonioId, this.#pedidoItemQuantidade];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}

module.exports = PedidoPatrimonioItemModel;