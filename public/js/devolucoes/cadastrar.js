document.addEventListener("DOMContentLoaded", function() {
    // Elementos do DOM
    const termoBuscaCliente = document.getElementById("termoBuscaCliente");
    const btnBuscarCliente = document.getElementById("btnBuscarCliente");
    const resultadosBusca = document.getElementById("resultadosBusca");
    const seletorCliente = document.getElementById("seletorCliente");
    const btnConfirmarCliente = document.getElementById("btnConfirmarCliente");
    const dadosCliente = document.getElementById("dadosCliente");
    const clienteId = document.getElementById("clienteId");
    const clienteNome = document.getElementById("clienteNome");
    const clienteEmail = document.getElementById("clienteEmail");
    const secaoPedidos = document.getElementById("secaoPedidos");
    const listaPedidos = document.getElementById("listaPedidos");
    const pedidoId = document.getElementById("pedidoId");
    const btnVisualizarProdutos = document.getElementById("btnVisualizarProdutos");
    const secaoProdutos = document.getElementById("secaoProdutos");
    const listaProdutos = document.getElementById("listaProdutos");
    const tabelaDevolucao = document.getElementById("tabelaDevolucao");
    const msgTabelaVazia = document.getElementById("msgTabelaVazia");
    const btnSalvar = document.getElementById("btnSalvar");
    const alertaMensagem = document.getElementById("alertaMensagem");
    const sugestoesList = document.getElementById("sugestoesList");
    
    // Lista de produtos para devolução
    let produtosDevolucao = [];
    // Lista de produtos do pedido
    let produtosPedido = [];
    // Lista de clientes para autocomplete
    let clientesTodas = [];
    
    // Variáveis de controle do autocomplete
    let timeoutId = null;
    let clienteSelecionado = null;
    
    // Event Listeners
    termoBuscaCliente.addEventListener("input", buscarClienteAutoComplete);
    termoBuscaCliente.addEventListener("keydown", handleKeyDown);
    termoBuscaCliente.addEventListener("click", function() {
        if (termoBuscaCliente.value.trim().length >= 2) {
            buscarClienteAutoComplete();
        }
    });
    btnBuscarCliente.addEventListener("click", buscarCliente);
    btnConfirmarCliente.addEventListener("click", confirmarCliente);
    btnVisualizarProdutos.addEventListener("click", visualizarProdutos);
    btnSalvar.addEventListener("click", salvarDevolucao);
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (!termoBuscaCliente.contains(e.target) && !sugestoesList.contains(e.target)) {
            sugestoesList.style.display = 'none';
        }
    });
    
    // Funções do autocomplete
    function buscarClienteAutoComplete() {
        const termo = termoBuscaCliente.value.trim();
        
        if (termo.length < 2) {
            sugestoesList.style.display = 'none';
            return;
        }
        
        // Limpar timeout anterior
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        // Aguardar 300ms antes de fazer a busca
        timeoutId = setTimeout(() => {
            if (!isNaN(termo) && parseInt(termo) > 0) {
                // Se for número, buscar por ID
                buscarPorId(parseInt(termo));
            } else {
                // Se for texto, buscar por nome
                buscarPorNome(termo);
            }
        }, 300);
    }
    
    function buscarPorNome(nome) {
        fetch(`/devolucoes/buscar-cliente/${encodeURIComponent(nome)}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.clientes) {
                    mostrarSugestoes(data.clientes);
                } else {
                    sugestoesList.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Erro na busca:", error);
                sugestoesList.style.display = 'none';
            });
    }
    
    function buscarPorId(id) {
        fetch(`/devolucoes/buscar-cliente/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.cliente) {
                    mostrarSugestoes([data.cliente]);
                } else {
                    sugestoesList.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Erro na busca:", error);
                sugestoesList.style.display = 'none';
            });
    }
    
    function mostrarSugestoes(clientes) {
        sugestoesList.innerHTML = '';
        
        if (clientes.length === 0) {
            sugestoesList.style.display = 'none';
            return;
        }
        
        clientes.forEach((cliente, index) => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.textContent = `${cliente.id_doador || cliente.doadorId} - ${cliente.nome || cliente.doadorNome}`;
            item.setAttribute('data-id', cliente.id_doador || cliente.doadorId);
            item.setAttribute('data-nome', cliente.nome || cliente.doadorNome);
            item.setAttribute('data-email', cliente.email || cliente.doadorEmail || '');
            
            item.addEventListener('click', function(e) {
                e.preventDefault();
                selecionarCliente(this);
            });
            
            // Destacar correspondência
            const termoBusca = termoBuscaCliente.value.trim().toLowerCase();
            const nome = cliente.nome || cliente.doadorNome;
            const nomeDestacado = destacarTexto(nome, termoBusca);
            item.innerHTML = `${cliente.id_doador || cliente.doadorId} - ${nomeDestacado}`;
            
            sugestoesList.appendChild(item);
        });
        
        sugestoesList.style.display = 'block';
    }
    
    function destacarTexto(texto, termo) {
        const regex = new RegExp(`(${termo})`, 'gi');
        return texto.replace(regex, '<strong>$1</strong>');
    }
    
    function selecionarCliente(elemento) {
        const id = elemento.getAttribute('data-id');
        const nome = elemento.getAttribute('data-nome');
        const email = elemento.getAttribute('data-email');
        
        clienteSelecionado = {
            id: id,
            nome: nome,
            email: email
        };
        
        termoBuscaCliente.value = nome;
        sugestoesList.style.display = 'none';
        
        // Confirmar cliente automaticamente
        confirmarClienteAutomatico();
    }
    
    function confirmarClienteAutomatico() {
        clienteId.value = clienteSelecionado.id;
        clienteNome.textContent = clienteSelecionado.nome;
        clienteEmail.textContent = clienteSelecionado.email || "Não informado";
        
        dadosCliente.style.display = "block";
        resultadosBusca.style.display = "none";
        
        // Carregar pedidos do cliente
        carregarPedidos(clienteSelecionado.id);
        
        mostrarAlerta("Cliente selecionado com sucesso!", "alert-success");
    }
    
    function handleKeyDown(e) {
        const items = sugestoesList.querySelectorAll('.dropdown-item');
        let currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < items.length - 1) {
                    items[currentIndex]?.classList.remove('active');
                    items[currentIndex + 1]?.classList.add('active');
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex]?.classList.remove('active');
                    items[currentIndex - 1]?.classList.add('active');
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                const activeItem = sugestoesList.querySelector('.dropdown-item.active');
                if (activeItem) {
                    selecionarCliente(activeItem);
                }
                break;
                
            case 'Escape':
                sugestoesList.style.display = 'none';
                break;
        }
    }
    
    function buscarCliente() {
        const termo = termoBuscaCliente.value.trim();
        
        if (termo === "") {
            mostrarAlerta("Por favor, digite um nome ou ID para buscar", "alert-warning");
            return;
        }
        
        fetch(`/devolucoes/buscar-cliente/${termo}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    if (data.cliente) {
                        // Encontrou um cliente específico
                        seletorCliente.innerHTML = "";
                        const option = document.createElement("option");
                        option.value = data.cliente.doadorId;
                        option.textContent = `${data.cliente.doadorId} - ${data.cliente.doadorNome}`;
                        seletorCliente.appendChild(option);
                        
                        resultadosBusca.style.display = "block";
                    } else if (data.clientes && data.clientes.length > 0) {
                        // Encontrou vários clientes
                        seletorCliente.innerHTML = "<option selected disabled>Selecione um cliente</option>";
                        
                        data.clientes.forEach(cliente => {
                            const option = document.createElement("option");
                            option.value = cliente.id_doador;
                            option.textContent = `${cliente.id_doador} - ${cliente.nome}`;
                            seletorCliente.appendChild(option);
                        });
                        
                        resultadosBusca.style.display = "block";
                    }
                } else {
                    mostrarAlerta(data.msg, "alert-warning");
                    resultadosBusca.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Erro na busca:", error);
                mostrarAlerta("Erro ao buscar cliente. Tente novamente.", "alert-danger");
            });
    }
    
    function confirmarCliente() {
        const clienteSelecionado = seletorCliente.value;
        
        if (!clienteSelecionado || clienteSelecionado === "Selecione um cliente") {
            mostrarAlerta("Por favor, selecione um cliente", "alert-warning");
            return;
        }
        
        fetch(`/devolucoes/buscar-cliente/${clienteSelecionado}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.cliente) {
                    clienteId.value = data.cliente.doadorId;
                    clienteNome.textContent = data.cliente.doadorNome;
                    clienteEmail.textContent = data.cliente.doadorEmail || "Não informado";
                    
                    dadosCliente.style.display = "block";
                    resultadosBusca.style.display = "none";
                    
                    // Carregar pedidos do cliente
                    carregarPedidos(clienteSelecionado);
                    
                    mostrarAlerta("Cliente selecionado com sucesso!", "alert-success");
                } else {
                    mostrarAlerta("Erro ao obter dados do cliente", "alert-danger");
                }
            })
            .catch(error => {
                console.error("Erro ao confirmar cliente:", error);
                mostrarAlerta("Erro ao obter dados do cliente", "alert-danger");
            });
    }
    
    function carregarPedidos(clienteId) {
        fetch(`/devolucoes/listar-pedidos/${clienteId}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.pedidos && data.pedidos.length > 0) {
                    // Criar lista de pedidos
                    let html = "<div class='list-group'>";
                    
                    data.pedidos.forEach(pedido => {
                        const dataFormatada = new Date(pedido.ped_data).toLocaleDateString('pt-BR');
                        html += `
                            <a href="#" class="list-group-item list-group-item-action selecionar-pedido" data-id="${pedido.ped_id}">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Pedido #${pedido.ped_id}</h5>
                                    <small>Data: ${dataFormatada}</small>
                                </div>
                                <p class="mb-1">Total: R$ ${parseFloat(pedido.valor_total || 0).toFixed(2)}</p>
                            </a>
                        `;
                    });
                    
                    html += "</div>";
                    listaPedidos.innerHTML = html;
                    
                    // Adicionar eventos aos itens da lista
                    document.querySelectorAll(".selecionar-pedido").forEach(item => {
                        item.addEventListener("click", function(e) {
                            e.preventDefault();
                            
                            // Remover seleção anterior
                            document.querySelectorAll(".selecionar-pedido").forEach(el => {
                                el.classList.remove("active");
                            });
                            
                            // Adicionar seleção ao item atual
                            this.classList.add("active");
                            
                            // Guardar ID do pedido
                            pedidoId.value = this.dataset.id;
                            
                            // Mostrar botão para visualizar produtos
                            btnVisualizarProdutos.style.display = "block";
                        });
                    });
                    
                    secaoPedidos.style.display = "block";
                } else {
                    listaPedidos.innerHTML = "<p class='text-center'>Nenhum pedido encontrado para este cliente.</p>";
                    secaoPedidos.style.display = "block";
                }
            })
            .catch(error => {
                console.error("Erro ao carregar pedidos:", error);
                mostrarAlerta("Erro ao carregar lista de pedidos do cliente", "alert-danger");
            });
    }
    
    function visualizarProdutos() {
        const pedidoIdValue = pedidoId.value;
        
        if (!pedidoIdValue) {
            mostrarAlerta("Por favor, selecione um pedido", "alert-warning");
            return;
        }
        
        fetch(`/devolucoes/buscar-produtos-pedido/${pedidoIdValue}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.produtos && data.produtos.length > 0) {
                    produtosPedido = data.produtos;
                    
                    // Criar lista de produtos
                    let html = "<table class='table table-striped'>";
                    html += "<thead><tr><th>ID</th><th>Produto</th><th>Quantidade</th><th>Valor Unit.</th><th>Ações</th></tr></thead>";
                    html += "<tbody>";
                    
                    produtosPedido.forEach(produto => {
                        html += `
                            <tr>
                                <td>${produto.produto_id}</td>
                                <td>${produto.nome}</td>
                                <td>${produto.quantidade}</td>
                                <td>R$ ${parseFloat(produto.valor_unitario).toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-primary btn-sm adicionar-produto" data-id="${produto.produto_id}" data-nome="${produto.nome}" data-preco="${produto.valor_unitario}" data-quantidade="${produto.quantidade}">
                                        <i class="fas fa-plus"></i> Adicionar
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    
                    html += "</tbody></table>";
                    listaProdutos.innerHTML = html;
                    
                    // Adicionar eventos aos botões de adicionar
                    document.querySelectorAll(".adicionar-produto").forEach(btn => {
                        btn.addEventListener("click", function() {
                            adicionarProdutoDevolucao(
                                this.dataset.id,
                                this.dataset.nome,
                                this.dataset.preco,
                                this.dataset.quantidade
                            );
                        });
                    });
                    
                    secaoProdutos.style.display = "block";
                    btnSalvar.style.display = "block";
                    atualizarTabelaDevolucao();
                } else {
                    listaProdutos.innerHTML = "<p class='text-center'>Nenhum produto encontrado neste pedido.</p>";
                    secaoProdutos.style.display = "block";
                }
            })
            .catch(error => {
                console.error("Erro ao carregar produtos:", error);
                mostrarAlerta("Erro ao carregar lista de produtos do pedido", "alert-danger");
            });
    }
    
    function adicionarProdutoDevolucao(produtoId, produtoNome, preco, quantidadeDisponivel) {
        // Verificar se o produto já está na lista
        const produtoExistente = produtosDevolucao.find(p => p.produtoId === produtoId);
        
        if (produtoExistente) {
            mostrarAlerta("Este produto já foi adicionado à devolução", "alert-warning");
            return;
        }
        
        // Criar modal para definição de quantidade e defeito
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "modalQuantidadeDefeito";
        modal.tabIndex = "-1";
        modal.setAttribute("aria-labelledby", "modalQuantidadeDefeitoLabel");
        modal.setAttribute("aria-hidden", "true");
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalQuantidadeDefeitoLabel">Detalhes da Devolução - ${produtoNome}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="qtdDevolucao" class="form-label">Quantidade para devolução (máximo: ${quantidadeDisponivel})</label>
                            <input type="number" class="form-control" id="qtdDevolucao" min="1" max="${quantidadeDisponivel}" value="1">
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="produtoDefeito">
                            <label class="form-check-label" for="produtoDefeito">Produto com defeito</label>
                        </div>
                        <div class="mb-3">
                            <label for="observacaoDevolucao" class="form-label">Observação</label>
                            <textarea class="form-control" id="observacaoDevolucao" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnConfirmarProduto">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Inicializar o modal
        const modalInstance = new bootstrap.Modal(document.getElementById("modalQuantidadeDefeito"));
        modalInstance.show();
        
        // Configurar evento do botão de confirmar
        document.getElementById("btnConfirmarProduto").addEventListener("click", function() {
            const quantidade = document.getElementById("qtdDevolucao").value;
            const defeito = document.getElementById("produtoDefeito").checked;
            const observacao = document.getElementById("observacaoDevolucao").value;
            
            if (quantidade <= 0 || quantidade > quantidadeDisponivel) {
                alert("Por favor, informe uma quantidade válida");
                return;
            }
            
            // Adicionar produto à lista de devolução
            produtosDevolucao.push({
                produtoId: produtoId,
                nome: produtoNome,
                quantidade: quantidade,
                valorUnitario: preco,
                defeito: defeito,
                observacao: observacao
            });
            
            // Atualizar tabela
            atualizarTabelaDevolucao();
            
            // Fechar o modal
            modalInstance.hide();
            
            // Remover o modal do DOM após fechar
            document.getElementById("modalQuantidadeDefeito").addEventListener("hidden.bs.modal", function() {
                document.body.removeChild(document.getElementById("modalQuantidadeDefeito"));
            });
        });
    }
    
    function atualizarTabelaDevolucao() {
        const tbody = tabelaDevolucao.querySelector("tbody");
        tbody.innerHTML = "";
        
        if (produtosDevolucao.length === 0) {
            msgTabelaVazia.style.display = "block";
            return;
        }
        
        msgTabelaVazia.style.display = "none";
        
        produtosDevolucao.forEach((produto, index) => {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
                <td>${produto.produtoId}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${parseFloat(produto.valorUnitario).toFixed(2)}</td>
                <td>${produto.defeito ? "Sim" : "Não"}</td>
                <td>${produto.observacao || "-"}</td>
                <td>
                    <button class="btn btn-danger btn-sm remover-produto" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Adicionar eventos aos botões de remoção
        document.querySelectorAll(".remover-produto").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                produtosDevolucao.splice(index, 1);
                atualizarTabelaDevolucao();
            });
        });
    }
    
    function salvarDevolucao() {
        // Validar dados obrigatórios
        if (!clienteId.value) {
            mostrarAlerta("Por favor, selecione um cliente", "alert-warning");
            return;
        }
        
        if (!pedidoId.value) {
            mostrarAlerta("Por favor, selecione um pedido", "alert-warning");
            return;
        }
        
        if (produtosDevolucao.length === 0) {
            mostrarAlerta("Por favor, adicione pelo menos um produto para devolução", "alert-warning");
            return;
        }
        
        // Verificar se algum produto tem defeito para aplicar lógica de devolução
        const temProdutoDefeito = produtosDevolucao.some(p => p.defeito);
        let tipoRetorno = document.querySelector('input[name="tipoRetorno"]:checked').value;
        
        // Se algum produto tem defeito e a opção escolhida foi "produto", confirmar troca para dinheiro
        if (temProdutoDefeito && tipoRetorno === "produto") {
            if (confirm("Existe(m) produto(s) com defeito. Deseja realizar a devolução em dinheiro?")) {
                tipoRetorno = "dinheiro";
                document.getElementById("retornoDinheiro").checked = true;
            }
        }
        
        // Montar objeto de devolução
        const devolucao = {
            clienteId: clienteId.value,
            pedidoId: pedidoId.value,
            tipoRetorno: tipoRetorno,
            produtos: produtosDevolucao
        };
        
        // Enviar para o servidor
        fetch("/devolucoes/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(devolucao)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                mostrarAlerta(data.msg, "alert-success");
                setTimeout(() => {
                    window.location.href = "/devolucoes";
                }, 2000);
            } else {
                mostrarAlerta(data.msg, "alert-danger");
            }
        })
        .catch(error => {
            console.error("Erro ao salvar devolução:", error);
            mostrarAlerta("Erro ao salvar devolução. Tente novamente.", "alert-danger");
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