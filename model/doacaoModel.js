const Database = require("../utils/database");

const banco = new Database();

class DoacaoModel {
    #doacaoId;
    #doadorId;
    #doacaoData;
    #doacaoValor;
    #doacaoStatus;
    #doadorNome;

    constructor(doacaoId, doadorId, doacaoData, doacaoValor, doacaoStatus, doadorNome) {
        this.#doacaoId = doacaoId;
        this.#doadorId = doadorId;
        this.#doacaoData = doacaoData;
        this.#doacaoValor = doacaoValor;
        this.#doacaoStatus = doacaoStatus;
        this.#doadorNome = doadorNome;
    }

    get doacaoId() { return this.#doacaoId; }
    set doacaoId(doacaoId) { this.#doacaoId = doacaoId; }

    get doadorId() { return this.#doadorId; }
    set doadorId(doadorId) { this.#doadorId = doadorId; }

    get doacaoData() { return this.#doacaoData; }
    set doacaoData(doacaoData) { this.#doacaoData = doacaoData; }

    get doacaoValor() { return this.#doacaoValor; }
    set doacaoValor(doacaoValor) { this.#doacaoValor = doacaoValor; }

    get doacaoStatus() { return this.#doacaoStatus; }
    set doacaoStatus(doacaoStatus) { this.#doacaoStatus = doacaoStatus; }

    get doadorNome() { return this.#doadorNome; }
    set doadorNome(doadorNome) { this.#doadorNome = doadorNome; }

    async listar() {
        let sql = `SELECT d.id_doacao, d.doador_id, d.data, d.valor, d.status, do.nome AS doador_nome 
                  FROM doacao d 
                  INNER JOIN doador do ON d.doador_id = do.id_doador 
                  ORDER BY d.id_doacao DESC`;
        
        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            lista.push(new DoacaoModel(
                row['id_doacao'],
                row['doador_id'],
                dataFormatada,
                row['valor'],
                row['status'],
                row['doador_nome']
            ));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#doacaoId == 0) {
            let sql = "INSERT INTO doacao (doador_id, data, valor, status) VALUES (?, ?, ?, ?)";
            
            let valores = [
                this.#doadorId,
                this.#doacaoData,
                this.#doacaoValor,
                this.#doacaoStatus
            ];

            let result = await banco.ExecutaComandoLastInserted(sql, valores);
            return result;
        } else {
            let sql = "UPDATE doacao SET doador_id = ?, data = ?, valor = ?, status = ? WHERE id_doacao = ?";
            
            let valores = [
                this.#doadorId,
                this.#doacaoData,
                this.#doacaoValor,
                this.#doacaoStatus,
                this.#doacaoId
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = "SELECT d.*, do.nome AS doador_nome FROM doacao d INNER JOIN doador do ON d.doador_id = do.id_doador WHERE d.id_doacao = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            return new DoacaoModel(
                row['id_doacao'],
                row['doador_id'],
                dataFormatada,
                row['valor'],
                row['status'],
                row['doador_nome']
            );
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM doacao WHERE id_doacao = ?";
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
            "doacaoId": this.#doacaoId,
            "doadorId": this.#doadorId,
            "doacaoData": this.#doacaoData,
            "doacaoValor": this.#doacaoValor,
            "doacaoStatus": this.#doacaoStatus,
            "doadorNome": this.#doadorNome
        };
    }
}

module.exports = DoacaoModel;