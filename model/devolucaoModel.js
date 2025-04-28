const Database = require("../utils/database");

const banco = new Database();

class DevolucaoModel {
    #devolucaoId;
    #clienteId;
    #pedidoId;
    #devolucaoData;
    #devolucaoValor;
    #tipoRetorno;
    #clienteNome;
    #pedidoNumero;

    constructor(devolucaoId, clienteId, pedidoId, devolucaoData, tipoRetorno, devolucaoValor, clienteNome, pedidoNumero) {
        this.#devolucaoId = devolucaoId;
        this.#clienteId = clienteId;
        this.#pedidoId = pedidoId;
        this.#devolucaoData = devolucaoData;
        this.#devolucaoValor = devolucaoValor || 0;
        this.#tipoRetorno = tipoRetorno;
        this.#clienteNome = clienteNome;
        this.#pedidoNumero = pedidoNumero;
    }

    get devolucaoId() { return this.#devolucaoId; }
    set devolucaoId(devolucaoId) { this.#devolucaoId = devolucaoId; }

    get clienteId() { return this.#clienteId; }
    set clienteId(clienteId) { this.#clienteId = clienteId; }

    get pedidoId() { return this.#pedidoId; }
    set pedidoId(pedidoId) { this.#pedidoId = pedidoId; }

    get devolucaoData() { return this.#devolucaoData; }
    set devolucaoData(devolucaoData) { this.#devolucaoData = devolucaoData; }

    get devolucaoValor() { return this.#devolucaoValor; }
    set devolucaoValor(devolucaoValor) { this.#devolucaoValor = devolucaoValor; }

    get tipoRetorno() { return this.#tipoRetorno; }
    set tipoRetorno(tipoRetorno) { this.#tipoRetorno = tipoRetorno; }

    get clienteNome() { return this.#clienteNome; }
    set clienteNome(clienteNome) { this.#clienteNome = clienteNome; }

    get pedidoNumero() { return this.#pedidoNumero; }
    set pedidoNumero(pedidoNumero) { this.#pedidoNumero = pedidoNumero; }

    async listar() {
        let sql = `SELECT d.id_devolucao, d.cliente_id, d.pedido_id, d.data, d.valor, d.tipo_retorno, 
                  do.nome AS cliente_nome
                  FROM devolucao d 
                  INNER JOIN doador do ON d.cliente_id = do.id_doador 
                  ORDER BY d.id_devolucao DESC`;
        
        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            lista.push(new DevolucaoModel(
                row['id_devolucao'],
                row['cliente_id'],
                row['pedido_id'],
                dataFormatada,
                row['tipo_retorno'],
                row['valor'],
                row['cliente_nome'],
                row['pedido_id'] // Usando pedido_id como número do pedido por enquanto
            ));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#devolucaoId == 0) {
            let sql = "INSERT INTO devolucao (cliente_id, pedido_id, data, tipo_retorno, valor) VALUES (?, ?, ?, ?, ?)";
            
            let valores = [
                this.#clienteId,
                this.#pedidoId,
                this.#devolucaoData,
                this.#tipoRetorno,
                this.#devolucaoValor
            ];

            let result = await banco.ExecutaComandoLastInserted(sql, valores);
            return result;
        } else {
            let sql = "UPDATE devolucao SET cliente_id = ?, pedido_id = ?, data = ?, tipo_retorno = ?, valor = ? WHERE id_devolucao = ?";
            
            let valores = [
                this.#clienteId,
                this.#pedidoId,
                this.#devolucaoData,
                this.#tipoRetorno,
                this.#devolucaoValor,
                this.#devolucaoId
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async atualizarValor() {
        let sql = "UPDATE devolucao SET valor = ? WHERE id_devolucao = ?";
        let valores = [this.#devolucaoValor, this.#devolucaoId];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = "SELECT d.*, do.nome AS cliente_nome FROM devolucao d INNER JOIN doador do ON d.cliente_id = do.id_doador WHERE d.id_devolucao = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            return new DevolucaoModel(
                row['id_devolucao'],
                row['cliente_id'],
                row['pedido_id'],
                dataFormatada,
                row['tipo_retorno'],
                row['valor'],
                row['cliente_nome'],
                row['pedido_id'] // Usando pedido_id como número do pedido por enquanto
            );
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM devolucao WHERE id_devolucao = ?";
        let valores = [id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async buscarDoadorPorNome(nome) {
        let sql = "SELECT * FROM doador WHERE nome LIKE ?";
        let valores = [`%${nome}%`];
        let rows = await banco.ExecutaComando(sql, valores);
        return rows;
    }

    async buscarDoadorPorId(id) {
        let sql = "SELECT * FROM doador WHERE id_doador = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }

    toJSON() {
        return {
            "devolucaoId": this.#devolucaoId,
            "clienteId": this.#clienteId,
            "pedidoId": this.#pedidoId,
            "devolucaoData": this.#devolucaoData,
            "devolucaoValor": this.#devolucaoValor,
            "tipoRetorno": this.#tipoRetorno,
            "clienteNome": this.#clienteNome,
            "pedidoNumero": this.#pedidoNumero
        };
    }
}

module.exports = DevolucaoModel;