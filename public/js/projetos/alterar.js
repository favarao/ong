document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnAlterar").addEventListener("click", alterar);

    function limparValidacao() {
        document.getElementById("projetoNome").style["border-color"] = "#ced4da";
        document.getElementById("projetoDescricao").style["border-color"] = "#ced4da";
        document.getElementById("projetoDataInic").style["border-color"] = "#ced4da";
        document.getElementById("projetoDataFim").style["border-color"] = "#ced4da";
        document.getElementById("projetoObjetivo").style["border-color"] = "#ced4da";
        document.getElementById("projetoOrcamento").style["border-color"] = "#ced4da";
        document.getElementById("projetoStatu").style["border-color"] = "#ced4da";
    }

    function alterar() {
        limparValidacao();
        let id = document.querySelector("#projetoId").value;
        let nome = document.querySelector("#projetoNome").value;
        let descricao = document.querySelector("#projetoDescricao").value;
        let dataInic = document.querySelector("#projetoDataInic").value;
        let dataFim = document.querySelector("#projetoDataFim").value;
        let objetivo = document.querySelector("#projetoObjetivo").value;
        let orcamento = document.querySelector("#projetoOrcamento").value;
        let status = document.querySelector("#projetoStatu").value;

        let listaErros = [];
        if (nome == "") listaErros.push("projetoNome");
        if (descricao == "") listaErros.push("projetoDescricao");
        if (dataInic == "") listaErros.push("projetoDataInic");
        if (dataFim == "") listaErros.push("projetoDataFim");
        if (objetivo == "") listaErros.push("projetoObjetivo");
        if (orcamento == "") listaErros.push("projetoOrcamento");
        if (status == "") listaErros.push("projetoStatu");

        if (listaErros.length == 0) {
            let obj = {
                id: id,
                nome: nome,
                descricao: descricao,
                dataInic: dataInic,
                dataFim: dataFim,
                objetivo: objetivo,
                orcamento: orcamento,
                status: status,
            };

            fetch("/projetos/alterar", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((r) => r.json())
                .then((r) => {
                    if (r.ok) {
                        window.location.href = "/projetos";
                    } else {
                        alert(r.msg);
                    }
                });
        } else {
            for (let i = 0; i < listaErros.length; i++) {
                let campos = document.getElementById(listaErros[i]);
                campos.style["border-color"] = "red";
            }
            alert("Preencha corretamente os campos indicados!");
        }
    }
});