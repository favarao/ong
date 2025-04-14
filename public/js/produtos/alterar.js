document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnAlterar").addEventListener("click", alterar);

    function limparValidacao() {
        document.getElementById("produtoNome").style["border-color"] = "#ced4da";
        document.getElementById("produtoDesc").style["border-color"] = "#ced4da";
        document.getElementById("produtoPreco").style["border-color"] = "#ced4da";
        document.getElementById("produtoQuant").style["border-color"] = "#ced4da";
    }

    function alterar() {
        limparValidacao();
        let id = document.querySelector("#produtoId").value;
        let nome = document.querySelector("#produtoNome").value;
        let descricao = document.querySelector("#produtoDesc").value;
        let preco = document.querySelector("#produtoPreco").value;
        let quantidade = document.querySelector("#produtoQuant").value;

        let listaErros = [];
        if(nome == "") {
            listaErros.push("produtoNome");
        }
        if(descricao == "") {
            listaErros.push("produtoDesc");
        }
        if(preco == "" || isNaN(preco) || preco <= 0) {
            listaErros.push("produtoPreco");
        }
        if(quantidade == 0 || isNaN(quantidade) || quantidade <= 0) {
            listaErros.push("produtoQuant");
        }

        if(listaErros.length == 0) {
            //enviar ao backend com fetch

            let obj = {
                id: id,
                nome: nome,
                descricao: descricao,
                preco: preco,
                quantidade: quantidade,
            }

            fetch("/produtos/alterar", {
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
                    window.location.href="/produtos";
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
    document.getElementById("produtoPreco").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Máscara para o campo de quantidade
    document.getElementById("produtoQuant").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Máscara para o campo de nome
    document.getElementById("produtoNome").addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
    });
    

})