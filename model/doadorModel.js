const Database = require("../utils/database");

const banco = new Database();

class DoadorModel {

    #doadorId;
    #doadorNome;
    #doadorCPF;
    #doadorRG;
    #doadorSexo;
    #doadorEmail;
    #doadorSenha;
    #doadorTelefone;
    #doadorEndereco;
    #doadorCEP;
    #doadorAdmin;

    // Getter e Setter para doadorId
    get doadorId() {
        return this.#doadorId;
    }
    set doadorId(doadorId) {
        this.#doadorId = doadorId;
    }

    // Getter e Setter para doadorNome
    get doadorNome() {
        return this.#doadorNome;
    }
    set doadorNome(doadorNome) {
        this.#doadorNome = doadorNome;
    }

    // Getter e Setter para doadorCPF
    get doadorCPF() {
        return this.#doadorCPF;
    }
    set doadorCPF(doadorCPF) {
        this.#doadorCPF = doadorCPF;
    }

    // Getter e Setter para doadorRG
    get doadorRG() {
        return this.#doadorRG;
    }
    set doadorRG(doadorRG) {
        this.#doadorRG = doadorRG;
    }

    // Getter e Setter para doadorSexo
    get doadorSexo() {
        return this.#doadorSexo;
    }
    set doadorSexo(doadorSexo) {
        this.#doadorSexo = doadorSexo;
    }

    // Getter e Setter para doadorEmail
    get doadorEmail() {
        return this.#doadorEmail;
    }
    set doadorEmail(doadorEmail) {
        this.#doadorEmail = doadorEmail;
    }

    // Getter e Setter para doadorSenha
    get doadorSenha() {
        return this.#doadorSenha;
    }
    set doadorSenha(doadorSenha) {
        this.#doadorSenha = doadorSenha;
    }

    // Getter e Setter para doadorTelefone
    get doadorTelefone() {
        return this.#doadorTelefone;
    }
    set doadorTelefone(doadorTelefone) {
        this.#doadorTelefone = doadorTelefone;
    }

    // Getter e Setter para doadorEndereco
    get doadorEndereco() {
        return this.#doadorEndereco;
    }
    set doadorEndereco(doadorEndereco) {
        this.#doadorEndereco = doadorEndereco;
    }

    // Getter e Setter para doadorCEP
    get doadorCEP() {
        return this.#doadorCEP;
    }
    set doadorCEP(doadorCEP) {
        this.#doadorCEP = doadorCEP;
    }

    // Getter e Setter para doadorAdmin
    get doadorAdmin() {
        return this.#doadorAdmin;
    }
    set doadorAdmin(doadorAdmin) {
        this.#doadorAdmin = doadorAdmin;
    }

    // Construtor
    constructor(doadorId, doadorNome, doadorCPF, doadorRG, doadorSexo, doadorEmail, doadorSenha, doadorTelefone, doadorEndereco, doadorCEP, doadorAdmin) {
        this.#doadorId = doadorId;
        this.#doadorNome = doadorNome;
        this.#doadorCPF = doadorCPF;
        this.#doadorRG = doadorRG;
        this.#doadorSexo = doadorSexo;
        this.#doadorEmail = doadorEmail;
        this.#doadorSenha = doadorSenha;
        this.#doadorTelefone = doadorTelefone;
        this.#doadorEndereco = doadorEndereco;
        this.#doadorCEP = doadorCEP;
        this.#doadorAdmin = doadorAdmin;
    }

    //implementar as funções para manipulação das informações no banco
    async listar() {

        let sql = "select * from doador";

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for(let i = 0; i < rows.length; i++) {
            lista.push(new DoadorModel(rows[i]["id_doador"], rows[i]["nome"], rows[i]["CPF"], rows[i]["RG"],
                rows[i]["sexo"], rows[i]["email"], rows[i]["senha"], rows[i]["telefone"], rows[i]["endereco"], rows[i]["CEP"], rows[i]["admin"]
            ));
        }
        return lista;
    }

    async cadastrar() {
        if(this.#doadorId == 0) {
            let sql = "insert into doador (nome, CPF, RG, sexo, email, senha, telefone, endereco, CEP) values (?,?,?,?,?,?,?,?,?)";

            let valores = [this.#doadorNome, this.#doadorCPF, this.#doadorRG, this.#doadorSexo, this.#doadorEmail, this.#doadorSenha, this.#doadorTelefone, 
                this.#doadorEndereco, this.#doadorCEP,];
    
            let result = await banco.ExecutaComandoNonQuery(sql, valores);
    
            return result;
        }
        else{
            let sql = "update doador set nome = ?, CPF = ?, RG = ?, sexo = ?, email = ?, senha = ?, telefone = ?, endereco = ?, CEP = ? where id_doador = ?";

            let valores = [this.#doadorNome, this.#doadorCPF, this.#doadorRG, this.#doadorSexo, this.#doadorEmail, this.#doadorSenha, this.#doadorTelefone, 
                this.#doadorEndereco, this.#doadorCEP, this.#doadorId];

            let result = await banco.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = "select * from doador where id_doador = ?";

        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            return new DoadorModel(row["id_doador"], row["nome"], row["CPF"], row["RG"],
                row["sexo"], row["email"], row["senha"], row["telefone"], row["endereco"], row["CEP"], row["admin"]);
        }

        return null;
    }

    async obterPorEmailSenha(email, senha) {
        let sql = "select * from doador where email = ? and senha = ?";

        let valores = [email, senha];

        let rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            return new DoadorModel(row["id_doador"], row["nome"], row["CPF"], row["RG"],
                row["sexo"], row["email"], row["senha"], row["telefone"], row["endereco"], row["CEP"], row["admin"]);
        }

        return null;
    }

    async excluir(id) {
        let sql = "delete from doador where id_doador = ?";

        let valores = [id];
        
        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}

module.exports = DoadorModel;