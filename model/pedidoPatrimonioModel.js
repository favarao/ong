const Database = require("../utils/database");

const banco = new Database();

class PedidoPatrimonioModel {

    #pedidoId;
    #pedidoData;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData){
        this.#pedidoData = pedidoData;
    }

    constructor(pedidoId, pedidoData) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
    }

    async gravar() {
        let sql = "insert into pedidopatrimonio  (pedpat_data ) values (now())";     
        let valores = [];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }

}

module.exports = PedidoPatrimonioModel;