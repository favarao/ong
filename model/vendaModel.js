const Database = require("../utils/database");

const banco = new Database();

class VendaModel {
    #vendaId;
    #numero;
    #clienteId;
    #data;
    #valorTotal;
    #status;
    #clienteNome;

    constructor(vendaId, numero, clienteId, data, valorTotal, status, clienteNome) {
        this.#vendaId = vendaId;
        this.#numero = numero;
        this.#clienteId = clienteId;
        this.#data = data;
        this.#valorTotal = valorTotal;
        this.#status = status;
        this.#clienteNome = clienteNome;
    }

    get vendaId() { return this.#vendaId; }
    set vendaId(vendaId) { this.#vendaId = vendaId; }

    get numero() { return this.#numero; }
    set numero(numero) { this.#numero = numero; }

    get clienteId() { return this.#clienteId; }
    set clienteId(clienteId) { this.#clienteId = clienteId; }

    get data() { return this.#data; }
    set data(data) { this.#data = data; }

    get valorTotal() { return this.#valorTotal; }
    set valorTotal(valorTotal) { this.#valorTotal = valorTotal; }

    get status() { return this.#status; }
    set status(status) { this.#status = status; }

    get clienteNome() { return this.#clienteNome; }
    set clienteNome(clienteNome) { this.#clienteNome = clienteNome; }

    // Esta é uma versão simplificada, você precisará implementar adequadamente
    async listarPorCliente(clienteId) {
        let sql = `SELECT v.id_venda, v.numero, v.cliente_id, v.data, v.valor_total, v.status, d.nome as cliente_nome
                  FROM venda v 
                  INNER JOIN doador d ON v.cliente_id = d.id_doador 
                  WHERE v.cliente_id = ?
                  ORDER BY v.id_venda DESC`;
        
        let valores = [clienteId];
        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows;
    }

    // Esta é uma versão simplificada, você precisará implementar adequadamente
    async buscarProdutos(vendaId) {
        let sql = `SELECT vi.produto_id, p.nome, vi.quantidade, vi.valor_unitario
                  FROM venda_item vi
                  INNER JOIN produto p ON vi.produto_id = p.id_produto
                  WHERE vi.venda_id = ?`;
        
        let valores = [vendaId];
        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows;
    }
}

module.exports = VendaModel;