document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnAlterar").addEventListener("click", alterar);

    function limparValidacao() {
        document.getElementById("eventoNome").style["border-color"] = "#ced4da";
        document.getElementById("eventoDesc").style["border-color"] = "#ced4da";
        document.getElementById("eventoDataInic").style["border-color"] = "#ced4da";
        document.getElementById("eventoDataFim").style["border-color"] = "#ced4da";
        document.getElementById("eventoLocal").style["border-color"] = "#ced4da";
        document.getElementById("eventoProjeto").style["border-color"] = "#ced4da";
    }

    function alterar() {
        limparValidacao();
        let id = document.querySelector("#eventoId").value;
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
                id: id,
                nome: nome,
                descricao: descricao,
                dataInic: dataInic,
                dataFim: dataInic,
                local: local,
                projeto: projeto,
            }

            fetch("/eventos/alterar", {
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

})