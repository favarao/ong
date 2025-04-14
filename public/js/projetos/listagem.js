document.addEventListener("DOMContentLoaded", function () {
    let btns = document.querySelectorAll(".btnExclusao");

    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", excluir);
    }

    function excluir() {
        let id = this.dataset.codigoexclusao;

        if (id != null) {
            if (confirm("Tem certeza que deseja excluir esse projeto?")) {
                let obj = {
                    id: id,
                };

                fetch("/projetos/excluir", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                })
                    .then((r) => r.json())
                    .then((r) => {
                        if (r.ok) {
                            window.location.reload();
                        } else {
                            alert(r.msg);
                        }
                    });
            }
        } else {
            alert("Nenhum ID encontrado para exclusão");
        }
    }
});