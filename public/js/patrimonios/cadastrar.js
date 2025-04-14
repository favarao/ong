document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    function limparValidacao() {
        document.getElementById("patrimonioNome").style["border-color"] = "#ced4da";
        document.getElementById("patrimonioDesc").style["border-color"] = "#ced4da";
        document.getElementById("patrimonioQuantidade").style["border-color"] = "#ced4da";
        document.getElementById("patrimonioProjeto").style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let nome = document.querySelector("#patrimonioNome").value;
        let descricao = document.querySelector("#patrimonioDesc").value;
        let quantidade = document.querySelector("#patrimonioQuantidade").value;
        let projeto = document.querySelector("#patrimonioProjeto").value;

        let listaErros = [];
        if(nome == "") {
            listaErros.push("patrimonioNome");
        }
        if(descricao == "") {
            listaErros.push("patrimonioDesc");
        }
        if(quantidade == 0 || isNaN(quantidade) || quantidade <= 0) {
            listaErros.push("patrimonioQuantidade");
        }
        if(projeto == "" || isNaN(projeto) || projeto <= 0) {
            listaErros.push("patrimonioProjeto");
        }


        if(listaErros.length == 0) {
            //enviar ao backend com fetch

            let obj = {
                nome: nome,
                descricao: descricao,
                quantidade: quantidade,
                projeto: projeto,
            }

            fetch("/patrimonios/cadastrar", {
                method: 'POST',
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();
            })
            .then(r=> {
                if(r.ok) {
                    window.location.href="/patrimonios";
                }   
                else {
                    alert(r.msg);
                }
            })
        }
        else{
            //avisar sobre o preenchimento incorreto
            for(let i = 0; i < listaErros.length; i++) {
                let campos = document.getElementById(listaErros[i]);
                campos.style["border-color"] = "red";
            }
            alert("Preencha corretamente os campos indicados!");
        }
    }
    
    // Máscara para o campo de preço
    document.getElementById("patrimonioProjeto").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Máscara para o campo de quantidade
    document.getElementById("patrimonioQuantidade").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Máscara para o campo de nome
    document.getElementById("patrimonioNome").addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
    });

})