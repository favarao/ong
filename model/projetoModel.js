const Database = require("../utils/database");

const banco = new Database();

class ProjetoModel {
    
    #projetoId;
    #projetoNome;
    #projetoDescricao;
    #projetoDataInic;
    #projetoDataFim;
    #projetoObjetivo;
    #projetoOrcamento;
    #projetoStatu;

    constructor(projetoId, projetoNome, projetoDescricao, projetoDataInic, projetoDataFim, projetoObjetivo, projetoOrcamento, projetoStatu) {
        this.#projetoId = projetoId;
        this.#projetoNome = projetoNome;
        this.#projetoDescricao = projetoDescricao;
        this.#projetoDataInic = projetoDataInic;
        this.#projetoDataFim = projetoDataFim;
        this.#projetoObjetivo = projetoObjetivo;
        this.#projetoOrcamento = projetoOrcamento;
        this.#projetoStatu = projetoStatu;
    }

    get projetoId() { return this.#projetoId; }
    set projetoId(novoprojetoId) { this.#projetoId = novoprojetoId; }

    get projetoNome() { return this.#projetoNome; }
    set projetoNome(novoprojetoNome) { this.#projetoNome = novoprojetoNome; }

    get projetoDescricao() { return this.#projetoDescricao; }
    set projetoDescricao(novoprojetoDescricao) { this.#projetoDescricao = novoprojetoDescricao; }

    get projetoDataInic() { return this.#projetoDataInic; }
    set projetoDataInic(novoprojetoDataInic) { this.#projetoDataInic = novoprojetoDataInic; }

    get projetoDataFim() { return this.#projetoDataFim; }
    set projetoDataFim(novoprojetoDataFim) { this.#projetoDataFim = novoprojetoDataFim; }

    get projetoObjetivo() { return this.#projetoObjetivo; }
    set projetoObjetivo(novoprojetoObjetivo) { this.#projetoObjetivo = novoprojetoObjetivo; }

    get projetoOrcamento() { return this.#projetoOrcamento; }
    set projetoOrcamento(novoprojetoOrcamento) { this.#projetoOrcamento = novoprojetoOrcamento; }

    get projetoStatu() { return this.#projetoStatu; }
    set projetoStatu(novoprojetoStatu) { this.#projetoStatu = novoprojetoStatu; }


    //função listar tudo
    async listar() {

        let sql = `select * from projetos`;
        let lista = [];

        let rows = await banco.ExecutaComando(sql)

        for (let i = 0; i < rows.length; i++) {
            lista.push(new ProjetoModel(
                rows[i]['id_projeto'], 
                rows[i]['nome'], 
                rows[i]['descricao'], 
                rows[i]['data_inicio'].toISOString().split('T')[0], 
                rows[i]['data_fim'].toISOString().split('T')[0], 
                rows[i]['objetivo'], 
                rows[i]['orcamento'], 
                rows[i]['status']
            ));
        }
        return lista;
    }

    async obter(projetoId) {
        let sql = `select * from projetos where id_projeto = ?`;
        let rows = await banco.ExecutaComando(sql, [projetoId]);

        if (rows.length > 0) {
            let row = rows[0];
            return new ProjetoModel(
                row['id_projeto'], 
                row['nome'], 
                row['descricao'], 
                row['data_inicio'].toISOString().split('T')[0], 
                row['data_fim'].toISOString().split('T')[0], 
                row['objetivo'], 
                row['orcamento'], 
                row['status']
            );
        } else {
            return null;
        }
    }

    async cadastrar() {
        if (this.#projetoId == 0) {
            let sql = "insert into projetos (nome, descricao, data_inicio, data_fim, objetivo, orcamento, status) values (?,?,?,?,?,?,?)";

            let valores = [
                this.#projetoNome, this.#projetoDescricao, this.#projetoDataInic, this.#projetoDataFim, this.#projetoObjetivo, this.#projetoOrcamento, this.#projetoStatu,
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;

        } else {
            let sql = "update projetos set nome = ?, descricao = ?, data_inicio = ?, data_fim = ?, objetivo = ?, orcamento = ?, status = ? where id_projeto = ?";

            let valores = [
                this.#projetoNome, this.#projetoDescricao, this.#projetoDataInic, this.#projetoDataFim, this.#projetoObjetivo, this.#projetoOrcamento, this.#projetoStatu, this.#projetoId,
            ];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

}

module.exports = ProjetoModel;
