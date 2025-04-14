document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    function limparValidacao() {
        document.getElementById("eventoNome").style["border-color"] = "#ced4da";
        document.getElementById("eventoDesc").style["border-color"] = "#ced4da";
        document.getElementById("eventoDataInic").style["border-color"] = "#ced4da";
        document.getElementById("eventoDataFim").style["border-color"] = "#ced4da";
        document.getElementById("eventoLocal").style["border-color"] = "#ced4da";
        document.getElementById("eventoProjeto").style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let nome = document.querySelector("#eventoNome").value;
        let descricao = document.querySelector("#eventoDesc").value;
        let dataInic = document.querySelector("#eventoDataInic").value;
        let dataFim = document.querySelector("#eventoDataFim").value;
        let local = document.querySelector("#eventoLocal").value;
        let projeto = document.querySelector("#eventoProjeto").value;

        let listaErros = [];
        if(nome == "") {
            listaErros.push("eventoNome");
        }
        if(descricao == "") {
            listaErros.push("eventoDesc");
        }
        if(dataInic == "") {
            listaErros.push("eventoDataInic");
        }
        if(dataFim == 0) {
            listaErros.push("eventoDataFim");
        }
        if(local == "") {
            listaErros.push("eventoLocal");
        }
        if(projeto == 0) {
            listaErros.push("eventoProjeto");
        }


        if(listaErros.length == 0) {
            //enviar ao backend com fetch

            let obj = {
                nome: nome,
                descricao: descricao,
                dataInic: dataInic,
                dataFim: dataInic,
                local: local,
                projeto: projeto,
            }

            fetch("/eventos/cadastrar", {
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
                    window.location.href="/eventos";
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

    // Máscara para o campo de projeto
    document.getElementById("eventoProjeto").addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, '');
    });

    // Máscara para o campo de nome
    document.getElementById("eventoNome").addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
    });

    // Máscara para o campo de local
    document.getElementById("eventoLocal").addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-Z0-9\s,]/g, '');
    });
})