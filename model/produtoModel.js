const Database = require("../utils/database");

const banco = new Database();

class produtoModel {
    #produtoId;
    #produtoNome;
    #produtoDesc;
    #produtoPreco;
    #produtoQuant;

    get produtoId() {
        return this.#produtoId;
    }

    get produtoNome() {
        return this.#produtoNome;
    }

    get produtoDesc() {
        return this.#produtoDesc;
    }

    get produtoPreco() {
        return this.#produtoPreco;
    }

    get produtoQuant() {
        return this.#produtoQuant;
    }

    // Setters
    set produtoId(novaprodutoId) {
        this.#produtoId = novaprodutoId;
    }

    set produtoNome(novoprodutoNome) {
        this.#produtoNome = novoprodutoNome;
    }

    set produtoDesc(novoProdutoDesc) {
        this.#produtoDesc = novoProdutoDesc;
    }

    set produtoPreco(novoProdutoPreco) {
        this.#produtoPreco = novoProdutoPreco;
    }

    set produtoQuant(novoProdutoQuant) {
        this.#produtoQuant = novoProdutoQuant;
    }

    //construtor
    constructor(produtoId, produtoNome, produtoDesc, produtoPreco, produtoQuant) {
        this.#produtoId = produtoId;
        this.#produtoNome = produtoNome;
        this.#produtoDesc = produtoDesc;
        this.#produtoPreco = produtoPreco;
        this.#produtoQuant = produtoQuant;
    }

    async listarProduto(termo, filtro) {

        let sqlFiltro = "";
        if(termo != "") {
            if(filtro == "1") {
                termo = "%"+ termo +"%"
                sqlFiltro = ` where p.id_produto like ?`
            }
            else if(filtro == "2") {
                termo = "%"+ termo +"%"
                sqlFiltro = ` where p.nome like ?`;
            }
        }

        let sql = `select p.id_produto, p.nome, p.descricao, p.preco, p.quantidade, pro.nome AS nomeProjeto
        from produto p inner join projetos pro on p.id_produto = pro.id_projeto ${sqlFiltro} ORDER BY p.id_produto DESC;`

        let valores = [];
        if(sqlFiltro != ""){
            valores.push(termo);
        }
        

        let rows = await banco.ExecutaComando(sql, valores);

        let lista = [];

        for(let i = 0; i<rows.length; i++){
            let row = rows[i];

            lista.push(new produtoModel(row["id_produto"], row["nome"], row["descricao"], row["preco"], row["quantidade"], row["nomeProjeto"]))
        }

        return lista;
    }

    //função listar tudo
    async listar() {

        let sql = "select * from produto ORDER BY id_produto DESC"
        let lista = [];
 

        let rows = await banco.ExecutaComando(sql)
        

        for(let i = 0; i < rows.length; i++) {
            lista.push(new produtoModel(rows[i]['id_produto'], rows[i]['nome'], rows[i]['descricao'], rows[i]['preco'], rows[i]['quantidade']));
        }
        return lista;
    }

    async validarEstoque(produtoId, quantidade) {

        let sql = "select * from produto where id_produto = ? and quantidade >= ?";
        let valores = [produtoId, quantidade];

        let rows = await banco.ExecutaComando(sql, valores);
        
        return rows.length > 0;
    }

    //função cadastrar
    async cadastrar() {
        if(this.#produtoId == 0){
            let sql = "insert into produto (nome, descricao, preco, quantidade) values (?,?,?,?)";
        
            let valores =[
                this.#produtoNome, this.#produtoDesc, this.#produtoPreco, this.#produtoQuant
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);

            return result;

        }  else{
            let sql = "update produto set nome = ?, descricao = ?, preco = ?, quantidade = ? where id_produto = ?";

            let valores =[
                this.#produtoNome, this.#produtoDesc, this.#produtoPreco, this.#produtoQuant, this.#produtoId,
            ]

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
     }

     async obter(id) {
        let sql = "select * from produto where id_produto = ?"

        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            return new produtoModel(row['id_produto'], row['nome'] ,row['descricao'] , row['preco'], row['quantidade']);
        }
        return null;
    }

    async excluir(id) {

        let sqlForeign = "delete from tb_pedidoitens where id_produto = ?; ";

        let sql = "delete from produto where id_produto = ?";

        let valores = [id];
        await banco.ExecutaComandoNonQuery(sqlForeign, valores);
        
        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async buscarProduto(id){
        let sql = "select * from produto where id_produto = ?;";
        let valores = [id];
        var rows = await banco.ExecutaComando(sql, valores);

        let produto = null;

        if(rows.length > 0){
            var row = rows[0];
            
            produto = new produtoModel(row['id_produto'], row['nome'], row['descricao'], row['preco'], row['quantidade']);
        }

        return produto;
    }

    toJSON() {
        return {
            "produtoId": this.#produtoId,
            "produtoNome": this.#produtoNome,
            "produtoDescricao": this.#produtoDesc,
            "produtoQuantidade": this.#produtoQuant,
            "produtoPreco": this.#produtoPreco,
        }
    }
}

module.exports = produtoModel;
    
