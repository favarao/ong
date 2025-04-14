const Database = require("../utils/database");

const banco = new Database();

class eventoModel {
    #eventoId;
    #eventoNome;
    #eventoDescricao;
    #eventoDataInic;
    #eventoDataFim;
    #eventoLocal;
    #projetoId;
    #projetoNome;

    constructor(eventoId, eventoNome, eventoDescricao, eventoDataInic, eventoDataFim, eventoLocal, projetoId, projetoNome) {
        this.#eventoId = eventoId;
        this.#eventoNome = eventoNome;
        this.#eventoDescricao = eventoDescricao;
        this.#eventoDataInic = eventoDataInic;
        this.#eventoDataFim = eventoDataFim;
        this.#eventoLocal = eventoLocal;
        this.#projetoId = projetoId;
        this.#projetoNome = projetoNome;
    }

    get eventoId() { return this.#eventoId; }
    set eventoId(novoeventoId) { this.#eventoId = novoeventoId; }

    get eventoNome() { return this.#eventoNome; }
    set eventoNome(novoeventoNome) { this.#eventoNome = novoeventoNome; }

    get eventoDescricao() { return this.#eventoDescricao; }
    set eventoDescricao(novoeventoDescricao) { this.#eventoDescricao = novoeventoDescricao; }

    get eventoDataInic() { return this.#eventoDataInic; }
    set eventoDataInic(novoeventoDataInic) { this.#eventoDataInic = novoeventoDataInic; }

    get eventoDataFim() { return this.#eventoDataFim; }
    set eventoDataFim(novoeventoDataFim) { this.#eventoDataFim = novoeventoDataFim; }

    get eventoLocal() { return this.#eventoLocal; }
    set eventoLocal(novoeventoLocal) { this.#eventoLocal = novoeventoLocal; }

    get projetoId() { return this.#projetoId; }
    set projetoId(novoprojetoId) { this.#projetoId = novoprojetoId; }

    get projetoNome() { return this.#projetoNome; }
    set projetoNome(novoprojetoNome) { this.#projetoNome = novoprojetoNome; }

    //função listar tudo
    async listar() {

        let sql = `select e.id_evento, e.nome, e.descricao, e.data_inicio, e.data_fim, e.local, e.projeto_id, pro.nome AS nomePatrimonio 
                    from evento e inner join projetos pro on e.projeto_id = pro.id_projeto ORDER BY e.id_evento DESC`;
        let lista = [];

        let rows = await banco.ExecutaComando(sql)

        for (let i = 0; i < rows.length; i++) {
            let dataInicio = new Date(rows[i]['data_inicio']).toISOString().split('T')[0];
            let dataFim = new Date(rows[i]['data_fim']).toISOString().split('T')[0];
            lista.push(new eventoModel(rows[i]['id_evento'], rows[i]['nome'], rows[i]['descricao'], dataInicio, dataFim, rows[i]['local'], rows[i]['projeto_id'], rows[i]['nomePatrimonio']));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#eventoId == 0) {
            let sql = "insert into evento (nome ,descricao , data_inicio, data_fim, local, projeto_id) values (?,?,?,?,?,?)";

            let valores = [
                this.#eventoNome, this.#eventoDescricao, this.#eventoDataInic, this.#eventoDataFim, this.#eventoLocal, this.#projetoId,
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;

        } else {
            let sql = "update evento set nome = ?, descricao = ?, data_inicio = ?, data_fim = ?, local = ?, projeto_id = ?";

            let valores = [
                this.#eventoNome, this.#eventoDescricao, this.#eventoDataInic, this.#eventoDataFim, this.#eventoLocal, this.#projetoId,
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = "select * from evento where id_evento = ?"

        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let dataInicio = new Date(row['data_inicio']).toISOString().split('T')[0];
            let dataFim = new Date(row['data_fim']).toISOString().split('T')[0];
            return new eventoModel(row['id_evento'], row['nome'], row['descricao'], dataInicio, dataFim, row['local'], row['projeto_id'], row['nomePatrimonio']);
        }
        return null;
    }

    async excluir(id) {
        let sql = "delete from evento where id_evento = ?";

        let valores = [id];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

}

module.exports = eventoModel;
