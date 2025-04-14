const Database = require("../utils/database");

const banco = new Database();

class patrimonioModel {
    #patrimonioId;
    #patrimonioNome;
    #patrimonioDescricao;
    #patrimonioQuantidade;
    #projetoId;
    #projetoNome;

    constructor(patrimonioId, patrimonioNome, patrimonioDescricao, patrimonioQuantidade, projetoId, projetoNome) {
        this.#patrimonioId = patrimonioId;
        this.#patrimonioNome = patrimonioNome;
        this.#patrimonioDescricao = patrimonioDescricao;
        this.#patrimonioQuantidade = patrimonioQuantidade;
        this.#projetoId = projetoId;
        this.#projetoNome = projetoNome;
    }

    get patrimonioId() { return this.#patrimonioId; }
    set patrimonioId(novopatrimonioId) { this.#patrimonioId = novopatrimonioId; }

    get patrimonioNome() { return this.#patrimonioNome; }
    set patrimonioNome(novopatrimonioNome) { this.#patrimonioNome = novopatrimonioNome; }

    get patrimonioDescricao() { return this.#patrimonioDescricao; }
    set patrimonioDescricao(novopatrimonioDescricao) { this.#patrimonioDescricao = novopatrimonioDescricao; }

    get patrimonioQuantidade() { return this.#patrimonioQuantidade; }
    set patrimonioQuantidade(novopatrimonioQuantidade) { this.#patrimonioQuantidade = novopatrimonioQuantidade; }

    get projetoId() { return this.#projetoId; }
    set projetoId(novoprojetoId) { this.#projetoId = novoprojetoId; }

    get projetoNome() { return this.#projetoNome; }
    set projetoNome(novoprojetoNome) { this.#projetoNome = novoprojetoNome; }

    async listarPatrimonio(termo, filtro) {

        let sqlFiltro = "";
        if(termo != "") {
            if(filtro == "1") {
                termo = "%"+ termo +"%"
                sqlFiltro = ` where p.id_patrimonio like ?`
            }
            else if(filtro == "2") {
                termo = "%"+ termo +"%"
                sqlFiltro = ` where p.nome like ?`;
            }
            else if(filtro == "3") {
                termo = "%"+ termo +"%"
                sqlFiltro = ` where pro.nome like ?`;
            }
        }

        let sql = `select p.id_patrimonio, p.nome, p.descricao, p.quantidade, pro.nome AS nomeProjeto
        from patrimonio p inner join projetos pro on p.projeto_id = pro.id_projeto ${sqlFiltro} ORDER BY p.id_patrimonio DESC;`

        let valores = [];
        if(sqlFiltro != ""){
            valores.push(termo);
        }
        

        let rows = await banco.ExecutaComando(sql, valores);

        let lista = [];

        for(let i = 0; i<rows.length; i++){
            let row = rows[i];

            lista.push(new patrimonioModel(row["id_patrimonio"], row["nome"], row["descricao"], row["quantidade"], row["id_projeto"], row["nomeProjeto"]))
        }

        return lista;
    }

    //função listar tudo
    async listar() {

        let sql = `select p.id_patrimonio, p.nome, p.descricao, p.quantidade, p.projeto_id, pro.nome AS nomePatrimonio 
                    from patrimonio p inner join projetos pro on p.projeto_id = pro.id_projeto ORDER BY p.id_patrimonio DESC;`
        let lista = [];


        let rows = await banco.ExecutaComando(sql)


        for (let i = 0; i < rows.length; i++) {
            lista.push(new patrimonioModel(rows[i]['id_patrimonio'], rows[i]['nome'], rows[i]['descricao'], rows[i]['quantidade'], rows[i]['projeto_id'], rows[i]['nomePatrimonio']
            ))
        }

        return lista;
    }

    async validarEstoque(patrimonioId, quantidade) {

        let sql = "select * from patrimonio where id_patrimonio = ? and quantidade >= ?";
        let valores = [patrimonioId, quantidade];

        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows.length > 0;
    }

    async cadastrar() {
        if (this.#patrimonioId == 0) {
            let sql = "insert into patrimonio (nome, descricao, quantidade, projeto_id) values (?,?,?,?)";

            let valores = [
                this.#patrimonioNome, this.#patrimonioDescricao, this.#patrimonioQuantidade, this.#projetoId,
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;

        } else {
            let sql = "update patrimonio set nome = ?, descricao = ?, quantidade = ?, projeto_id = ?  where id_patrimonio = ?";

            let valores = [
                this.#patrimonioNome, this.#patrimonioDescricao, this.patrimonioQuantidade, this.#projetoId, this.#patrimonioId,
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = "select * from patrimonio where id_patrimonio = ?"

        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new patrimonioModel(row['id_patrimonio'], row['nome'], row['descricao'], row['quantidade'], row['projeto_id']);
        }
        return null;
    }

    async excluir(id) {

        let sqlForeign = "delete from tb_pedidoitenspatrimonio where id_patrimonio = ?; ";

        let sql = "delete from patrimonio where id_patrimonio = ?";

        let valores = [id];
        await banco.ExecutaComandoNonQuery(sqlForeign, valores);
        
        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }


    async buscarPatrimonio(id){
        let sql = "select * from patrimonio where id_patrimonio = ?;";
        let valores = [id];
        var rows = await banco.ExecutaComando(sql, valores);

        let patrimonio = null;

        if(rows.length > 0){
            var row = rows[0];
            
            patrimonio = new patrimonioModel(row['id_patrimonio'], row['nome'], row['descricao'], row['quantidade'], row['projeto_id']);
        }

        return patrimonio;
    }

    toJSON() {
        return {
            "patrimonioId": this.#patrimonioId,
            "patrimonioNome": this.#patrimonioNome,
            "patrimonioDescricao": this.#patrimonioDescricao,
            "patrimonioQuantidade": this.#patrimonioQuantidade,
            "projetoNome": this.#projetoNome,
        }
    }

}

module.exports = patrimonioModel;
