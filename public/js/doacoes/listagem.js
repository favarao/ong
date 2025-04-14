document.addEventListener("DOMContentLoaded", function() {
    // Configurar botões de exclusão
    const btnExclusao = document.querySelectorAll(".btnExclusao");
    
    for (let i = 0; i < btnExclusao.length; i++) {
        btnExclusao[i].addEventListener("click", confirmarExclusao);
    }
    
    function confirmarExclusao() {
        const id = this.dataset.codigoexclusao;
        
        if (id) {
            if (confirm("Tem certeza que deseja excluir esta doação?")) {
                const data = {
                    id: id
                };
                
                fetch("/doacoes/excluir", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        window.location.reload();
                    } else {
                        alert(data.msg || "Erro ao excluir doação");
                    }
                })
                .catch(error => {
                    console.error("Erro ao excluir:", error);
                    alert("Erro ao processar a exclusão");
                });
            }
        } else {
            alert("ID da doação não encontrado");
        }
    }
});