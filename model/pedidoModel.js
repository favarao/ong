const Database = require("../utils/database");

const banco = new Database();

class PedidoModel {
    #pedidoId;
    #pedidoData;
    #doadorId;

    constructor(pedidoId, pedidoData, doadorId) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
        this.#doadorId = doadorId;
    }

    get pedidoId() { return this.#pedidoId; }
    set pedidoId(pedidoId) { this.#pedidoId = pedidoId; }

    get pedidoData() { return this.#pedidoData; }
    set pedidoData(pedidoData) { this.#pedidoData = pedidoData; }

    get doadorId() { return this.#doadorId; }
    set doadorId(doadorId) { this.#doadorId = doadorId; }

    async gravar() {
        let sql = "INSERT INTO pedido (ped_data, doador_id) VALUES (now(), ?)";     
        let valores = [this.#doadorId];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        return result;
    }

    // Esta função busca pedidos baseados no cookie do doador logado
    async listarPorCliente(clienteId) {
        let sql = `SELECT p.ped_id, p.ped_data, 
                  (SELECT SUM(pit_valortotal) FROM tb_pedidoitens WHERE ped_id = p.ped_id) AS valor_total
                  FROM pedido p 
                  WHERE p.doador_id = ?
                  ORDER BY p.ped_id DESC`;
        
        let valores = [clienteId];
        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows;
    }

    // Esta função busca os produtos de um pedido específico
    async buscarProdutos(pedidoId) {
        let sql = `SELECT pi.id_produto as produto_id, pr.nome, pi.pit_quantidade as quantidade, 
                   pi.pit_valorunitario as valor_unitario, pi.pit_valortotal as valor_total
                   FROM tb_pedidoitens pi
                   INNER JOIN produto pr ON pi.id_produto = pr.id_produto
                   WHERE pi.ped_id = ?`;
        
        let valores = [pedidoId];
        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows;
    }

    // Se o pedido não foi localizado
    async obter(id) {
        let sql = "SELECT * FROM pedido WHERE ped_id = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);
        
        if (rows.length > 0) {
            let row = rows[0];
            let dataFormatada = row['ped_data'] ? new Date(row['ped_data']).toISOString().split('T')[0] : null;
            
            return new PedidoModel(
                row['ped_id'],
                dataFormatada,
                row['doador_id']
            );
        }
        
        return null;
    }
}

module.exports = PedidoModel;