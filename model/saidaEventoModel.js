const Database = require("../utils/database");

const banco = new Database();

class SaidaEventoModel {
    #saidaId;
    #eventoId;
    #data;
    #observacao;
    #eventoNome;

    constructor(saidaId, eventoId, data, observacao, eventoNome) {
        this.#saidaId = saidaId;
        this.#eventoId = eventoId;
        this.#data = data;
        this.#observacao = observacao;
        this.#eventoNome = eventoNome;
    }

    get saidaId() { return this.#saidaId; }
    set saidaId(saidaId) { this.#saidaId = saidaId; }

    get eventoId() { return this.#eventoId; }
    set eventoId(eventoId) { this.#eventoId = eventoId; }

    get data() { return this.#data; }
    set data(data) { this.#data = data; }

    get observacao() { return this.#observacao; }
    set observacao(observacao) { this.#observacao = observacao; }

    get eventoNome() { return this.#eventoNome; }
    set eventoNome(eventoNome) { this.#eventoNome = eventoNome; }

    async listar() {
        let sql = `SELECT s.id_saida, s.evento_id, s.data, s.observacao, e.nome AS evento_nome
                  FROM saida_evento s 
                  INNER JOIN evento e ON s.evento_id = e.id_evento 
                  ORDER BY s.id_saida DESC`;
        
        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            lista.push(new SaidaEventoModel(
                row['id_saida'],
                row['evento_id'],
                dataFormatada,
                row['observacao'],
                row['evento_nome']
            ));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#saidaId == 0) {
            let sql = "INSERT INTO saida_evento (evento_id, data, observacao) VALUES (?, ?, ?)";
            
            let valores = [
                this.#eventoId,
                this.#data,
                this.#observacao
            ];

            let result = await banco.ExecutaComandoLastInserted(sql, valores);
            return result;
        } else {
            let sql = "UPDATE saida_evento SET evento_id = ?, data = ?, observacao = ? WHERE id_saida = ?";
            
            let valores = [
                this.#eventoId,
                this.#data,
                this.#observacao,
                this.#saidaId
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = "SELECT s.*, e.nome AS evento_nome FROM saida_evento s INNER JOIN evento e ON s.evento_id = e.id_evento WHERE s.id_saida = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let dataFormatada = row['data'] ? new Date(row['data']).toISOString().split('T')[0] : null;
            
            return new SaidaEventoModel(
                row['id_saida'],
                row['evento_id'],
                dataFormatada,
                row['observacao'],
                row['evento_nome']
            );
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM saida_evento WHERE id_saida = ?";
        let valores = [id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    toJSON() {
        return {
            "saidaId": this.#saidaId,
            "eventoId": this.#eventoId,
            "data": this.#data,
            "observacao": this.#observacao,
            "eventoNome": this.#eventoNome
        };
    }
}

module.exports = SaidaEventoModel;