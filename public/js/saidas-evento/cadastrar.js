document.addEventListener("DOMContentLoaded", function() {
    // Elementos do DOM
    const eventoSelect = document.getElementById("eventoSelect");
    const observacao = document.getElementById("observacao");
    const secaoItens = document.getElementById("secaoItens");
    const listaProdutos = document.getElementById("listaProdutos");
    const listaPatrimonios = document.getElementById("listaPatrimonios");
    const tabelaSaida = document.getElementById("tabelaSaida");
    const msgTabelaVazia = document.getElementById("msgTabelaVazia");
    const btnSalvar = document.getElementById("btnSalvar");
    const alertaMensagem = document.getElementById("alertaMensagem");
    
    // Lista de itens para saída
    let itensSaida = [];
    
    // Event Listeners
    eventoSelect.addEventListener("change", function() {
        if (this.value) {
            secaoItens.style.display = "block";
            carregarItens();
            btnSalvar.style.display = "block";
        } else {
            secaoItens.style.display = "none";
            btnSalvar.style.display = "none";
        }
    });
    
    btnSalvar.addEventListener("click", salvarSaida);
    
    // Funções
    function carregarItens() {
        fetch("/saidas-evento/buscar-produtos")
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Carregar produtos
                    if (data.produtos && data.produtos.length > 0) {
                        let htmlProdutos = "<table class='table table-striped'>";
                        htmlProdutos += "<thead><tr><th>ID</th><th>Produto</th><th>Estoque</th><th>Ações</th></tr></thead>";
                        htmlProdutos += "<tbody>";
                        
                        data.produtos.forEach(produto => {
                            htmlProdutos += `
                                <tr>
                                    <td>${produto.produtoId}</td>
                                    <td>${produto.produtoNome}</td>
                                    <td>${produto.produtoQuant}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm adicionar-item" 
                                                data-id="${produto.produtoId}" 
                                                data-nome="${produto.produtoNome}" 
                                                data-estoque="${produto.produtoQuant}"
                                                data-tipo="produto">
                                            <i class="fas fa-plus"></i> Adicionar
                                        </button>
                                    </td>
                                </tr>
                            `;
                        });
                        
                        htmlProdutos += "</tbody></table>";
                        listaProdutos.innerHTML = htmlProdutos;
                    } else {
                        listaProdutos.innerHTML = "<p class='text-center'>Nenhum produto disponível.</p>";
                    }
                    
                    // Carregar patrimônios
                    if (data.patrimonios && data.patrimonios.length > 0) {
                        let htmlPatrimonios = "<table class='table table-striped'>";
                        htmlPatrimonios += "<thead><tr><th>ID</th><th>Patrimônio</th><th>Estoque</th><th>Ações</th></tr></thead>";
                        htmlPatrimonios += "<tbody>";
                        
                        data.patrimonios.forEach(patrimonio => {
                            htmlPatrimonios += `
                                <tr>
                                    <td>${patrimonio.patrimonioId}</td>
                                    <td>${patrimonio.patrimonioNome}</td>
                                    <td>${patrimonio.patrimonioQuantidade}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm adicionar-item" 
                                                data-id="${patrimonio.patrimonioId}" 
                                                data-nome="${patrimonio.patrimonioNome}" 
                                                data-estoque="${patrimonio.patrimonioQuantidade}"
                                                data-tipo="patrimonio">
                                            <i class="fas fa-plus"></i> Adicionar
                                        </button>
                                    </td>
                                </tr>
                            `;
                        });
                        
                        htmlPatrimonios += "</tbody></table>";
                        listaPatrimonios.innerHTML = htmlPatrimonios;
                    } else {
                        listaPatrimonios.innerHTML = "<p class='text-center'>Nenhum patrimônio disponível.</p>";
                    }
                    
                    // Adicionar eventos aos botões de adicionar
                    document.querySelectorAll(".adicionar-item").forEach(btn => {
                        btn.addEventListener("click", function() {
                            adicionarItem(
                                this.dataset.id,
                                this.dataset.nome,
                                this.dataset.estoque,
                                this.dataset.tipo
                            );
                        });
                    });
                } else {
                    mostrarAlerta("Erro ao carregar produtos e patrimônios", "alert-danger");
                }
            })
            .catch(error => {
                console.error("Erro ao carregar itens:", error);
                mostrarAlerta("Erro ao carregar lista de produtos e patrimônios", "alert-danger");
            });
    }
    
    function adicionarItem(itemId, itemNome, estoque, tipo) {
        // Verificar se o item já está na lista
        const itemExistente = itensSaida.find(i => i.id === itemId && i.tipo === tipo);
        
        if (itemExistente) {
            mostrarAlerta(`Este ${tipo === 'produto' ? 'produto' : 'patrimônio'} já foi adicionado à saída`, "alert-warning");
            return;
        }
        
        // Criar modal para definição de quantidade e observação
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "modalQuantidade";
        modal.tabIndex = "-1";
        modal.setAttribute("aria-labelledby", "modalQuantidadeLabel");
        modal.setAttribute("aria-hidden", "true");
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalQuantidadeLabel">Detalhes da Saída - ${itemNome}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="qtdSaida" class="form-label">Quantidade para saída (máximo: ${estoque})</label>
                            <input type="number" class="form-control" id="qtdSaida" min="1" max="${estoque}" value="1">
                            <div id="erroEstoque" class="form-text text-danger" style="display: none;"></div>
                        </div>
                        <div class="mb-3">
                            <label for="observacaoItem" class="form-label">Observação</label>
                            <textarea class="form-control" id="observacaoItem" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmarItem">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Inicializar o modal
        const modalInstance = new bootstrap.Modal(document.getElementById("modalQuantidade"));
        modalInstance.show();
        
        // Validação de quantidade quando alterada
        document.getElementById("qtdSaida").addEventListener("change", function() {
            const quantidade = parseInt(this.value);
            const estoqueMax = parseInt(estoque);
            
            if (quantidade <= 0) {
                document.getElementById("erroEstoque").textContent = "A quantidade deve ser maior que zero";
                document.getElementById("erroEstoque").style.display = "block";
                document.getElementById("btnConfirmarItem").disabled = true;
            } else if (quantidade > estoqueMax) {
                document.getElementById("erroEstoque").textContent = `A quantidade máxima disponível é ${estoqueMax}`;
                document.getElementById("erroEstoque").style.display = "block";
                document.getElementById("btnConfirmarItem").disabled = true;
            } else {
                document.getElementById("erroEstoque").style.display = "none";
                document.getElementById("btnConfirmarItem").disabled = false;
            }
        });
        
        // Configurar evento do botão de confirmar
        document.getElementById("btnConfirmarItem").addEventListener("click", function() {
            const quantidade = parseInt(document.getElementById("qtdSaida").value);
            const observacaoItem = document.getElementById("observacaoItem").value;
            
            // Verificar estoque novamente
            verificarEstoque(itemId, tipo, quantidade)
                .then(disponivel => {
                    if (disponivel) {
                        // Adicionar item à lista de saída
                        itensSaida.push({
                            id: itemId,
                            nome: itemNome,
                            tipo: tipo,
                            quantidade: quantidade,
                            observacao: observacaoItem
                        });
                        
                        // Atualizar tabela
                        atualizarTabelaSaida();
                        
                        // Fechar o modal
                        modalInstance.hide();
                    } else {
                        document.getElementById("erroEstoque").style.display = "block";
                    }
                })
                .catch(error => {
                    console.error("Erro ao verificar estoque:", error);
                    mostrarAlerta("Erro ao verificar disponibilidade em estoque", "alert-danger");
                });
            
            // Remover o modal do DOM após fechar
            document.getElementById("modalQuantidade").addEventListener("hidden.bs.modal", function() {
                document.body.removeChild(document.getElementById("modalQuantidade"));
            });
        });
    }
    
    function verificarEstoque(itemId, tipo, quantidade) {
        return fetch("/saidas-evento/verificar-estoque", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo: tipo,
                id: itemId,
                quantidade: quantidade
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.ok) {
                document.getElementById("erroEstoque").textContent = data.msg;
            }
            return data.ok;
        });
    }
    
    function atualizarTabelaSaida() {
        const tbody = tabelaSaida.querySelector("tbody");
        tbody.innerHTML = "";
        
        if (itensSaida.length === 0) {
            msgTabelaVazia.style.display = "block";
            return;
        }
        
        msgTabelaVazia.style.display = "none";
        
        itensSaida.forEach((item, index) => {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.tipo === 'produto' ? 'Produto' : 'Patrimônio'}</td>
                <td>${item.quantidade}</td>
                <td>${item.observacao || "-"}</td>
                <td>
                    <button class="btn btn-danger btn-sm remover-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Adicionar eventos aos botões de remoção
        document.querySelectorAll(".remover-item").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                itensSaida.splice(index, 1);
                atualizarTabelaSaida();
            });
        });
    }
    
    function salvarSaida() {
        // Validar dados obrigatórios
        if (!eventoSelect.value) {
            mostrarAlerta("Por favor, selecione um evento", "alert-warning");
            return;
        }
        
        if (itensSaida.length === 0) {
            mostrarAlerta("Por favor, adicione pelo menos um item para saída", "alert-warning");
            return;
        }
        
        // Montar objeto de saída
        const saida = {
            eventoId: eventoSelect.value,
            observacao: observacao.value,
            itens: itensSaida
        };
        
        // Enviar para o servidor
        fetch("/saidas-evento/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saida)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                mostrarAlerta(data.msg, "alert-success");
                setTimeout(() => {
                    window.location.href = "/saidas-evento";
                }, 2000);
            } else {
                mostrarAlerta(data.msg, "alert-danger");
            }
        })
        .catch(error => {
            console.error("Erro ao salvar saída:", error);
            mostrarAlerta("Erro ao registrar saída para evento. Tente novamente.", "alert-danger");
        });
    }
    
    function mostrarAlerta(mensagem, tipo) {
        alertaMensagem.className = `alert ${tipo}`;
        alertaMensagem.textContent = mensagem;
        alertaMensagem.style.display = "block";
        
        // Ocultar alerta após 5 segundos
        setTimeout(() => {
            alertaMensagem.style.display = "none";
        }, 5000);
    }
});