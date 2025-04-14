document.addEventListener("DOMContentLoaded", function() {
    // Elementos do DOM
    const termoBuscaDoador = document.getElementById("termoBuscaDoador");
    const btnBuscarDoador = document.getElementById("btnBuscarDoador");
    const resultadosBusca = document.getElementById("resultadosBusca");
    const seletorDoador = document.getElementById("seletorDoador");
    const btnConfirmarDoador = document.getElementById("btnConfirmarDoador");
    const dadosDoador = document.getElementById("dadosDoador");
    const doadorId = document.getElementById("doadorId");
    const doadorNome = document.getElementById("doadorNome");
    const doadorEmail = document.getElementById("doadorEmail");
    const doadorTelefone = document.getElementById("doadorTelefone");
    const doarProdutos = document.getElementById("doarProdutos");
    const secaoProdutos = document.getElementById("secaoProdutos");
    const seletorProduto = document.getElementById("seletorProduto");
    const qtdProduto = document.getElementById("qtdProduto");
    const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
    const tabelaProdutos = document.getElementById("tabelaProdutos");
    const btnSalvar = document.getElementById("btnSalvar");
    const alertaMensagem = document.getElementById("alertaMensagem");
    
    // Lista de produtos para doação
    let produtos = [];
    // Lista de produtos doados
    let produtosDoados = [];
    
    // Event Listeners
    btnBuscarDoador.addEventListener("click", buscarDoador);
    btnConfirmarDoador.addEventListener("click", confirmarDoador);
    doarProdutos.addEventListener("change", toggleSecaoProdutos);
    btnAdicionarProduto.addEventListener("click", adicionarProduto);
    btnSalvar.addEventListener("click", salvarDoacao);
    
    // Carregar produtos disponíveis ao iniciar
    carregarProdutos();
    
    // Funções
    function buscarDoador() {
        const termo = termoBuscaDoador.value.trim();
        
        if (termo === "") {
            mostrarAlerta("Por favor, digite um nome ou ID para buscar", "alert-warning");
            return;
        }
        
        fetch(`/doacoes/buscar-doador/${termo}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    if (data.doador) {
                        // Encontrou um doador específico
                        seletorDoador.innerHTML = "";
                        const option = document.createElement("option");
                        option.value = data.doador.id_doador;
                        option.textContent = `${data.doador.id_doador} - ${data.doador.nome}`;
                        seletorDoador.appendChild(option);
                        
                        resultadosBusca.style.display = "block";
                    } else if (data.doadores && data.doadores.length > 0) {
                        // Encontrou vários doadores
                        seletorDoador.innerHTML = "<option selected disabled>Selecione um doador</option>";
                        
                        data.doadores.forEach(doador => {
                            const option = document.createElement("option");
                            option.value = doador.id_doador;
                            option.textContent = `${doador.id_doador} - ${doador.nome}`;
                            seletorDoador.appendChild(option);
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
                mostrarAlerta("Erro ao buscar doador. Tente novamente.", "alert-danger");
            });
    }
    
    function confirmarDoador() {
        const doadorSelecionado = seletorDoador.value;
        
        if (!doadorSelecionado || doadorSelecionado === "Selecione um doador") {
            mostrarAlerta("Por favor, selecione um doador", "alert-warning");
            return;
        }
        
        fetch(`/doacoes/buscar-doador/${doadorSelecionado}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok && data.doador) {
                    doadorId.value = data.doador.id_doador;
                    doadorNome.textContent = data.doador.nome;
                    doadorEmail.textContent = data.doador.email || "Não informado";
                    doadorTelefone.textContent = data.doador.telefone || "Não informado";
                    
                    dadosDoador.style.display = "block";
                    resultadosBusca.style.display = "none";
                    mostrarAlerta("Doador selecionado com sucesso!", "alert-success");
                } else {
                    mostrarAlerta("Erro ao obter dados do doador", "alert-danger");
                }
            })
            .catch(error => {
                console.error("Erro ao confirmar doador:", error);
                mostrarAlerta("Erro ao obter dados do doador", "alert-danger");
            });
    }
    
    function toggleSecaoProdutos() {
        secaoProdutos.style.display = doarProdutos.checked ? "block" : "none";
    }
    
    function carregarProdutos() {
        fetch("/doacoes/listar-produtos")
            .then(response => response.json())
            .then(data => {
                if (data.produtos && data.produtos.length > 0) {
                    produtos = data.produtos;
                    seletorProduto.innerHTML = "<option selected disabled>Selecione um produto</option>";
                    
                    produtos.forEach(produto => {
                        const option = document.createElement("option");
                        option.value = produto.produtoId;
                        option.textContent = `${produto.produtoId} - ${produto.produtoNome}`;
                        option.dataset.nome = produto.produtoNome;
                        seletorProduto.appendChild(option);
                    });
                }
            })
            .catch(error => {
                console.error("Erro ao carregar produtos:", error);
                mostrarAlerta("Erro ao carregar lista de produtos", "alert-danger");
            });
    }
    
    function adicionarProduto() {
        const produtoSelecionado = seletorProduto.value;
        const quantidade = parseInt(qtdProduto.value);
        
        if (produtoSelecionado === "Selecione um produto") {
            mostrarAlerta("Por favor, selecione um produto", "alert-warning");
            return;
        }
        
        if (isNaN(quantidade) || quantidade <= 0) {
            mostrarAlerta("Por favor, informe uma quantidade válida", "alert-warning");
            return;
        }
        
        // Verificar se o produto já foi adicionado
        const produtoExistente = produtosDoados.find(p => p.produtoId === produtoSelecionado);
        
        if (produtoExistente) {
            produtoExistente.quantidade += quantidade;
            atualizarTabelaProdutos();
        } else {
            const option = seletorProduto.options[seletorProduto.selectedIndex];
            const nomeProduto = option.dataset.nome;
            
            produtosDoados.push({
                produtoId: produtoSelecionado,
                nome: nomeProduto,
                quantidade: quantidade
            });
            
            atualizarTabelaProdutos();
        }
        
        // Resetar campos
        seletorProduto.selectedIndex = 0;
        qtdProduto.value = 1;
    }
    
    function atualizarTabelaProdutos() {
        const tbody = tabelaProdutos.querySelector("tbody");
        tbody.innerHTML = "";
        
        produtosDoados.forEach((produto, index) => {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
                <td>${produto.produtoId}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Adicionar event listeners para botões de remoção
        document.querySelectorAll("[data-index]").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                produtosDoados.splice(index, 1);
                atualizarTabelaProdutos();
            });
        });
    }
    
    function salvarDoacao() {
        // Validar dados obrigatórios
        if (!doadorId.value) {
            mostrarAlerta("Por favor, selecione um doador", "alert-warning");
            return;
        }
        
        const dataDoacao = document.getElementById("dataDoacao").value;
        if (!dataDoacao) {
            mostrarAlerta("Por favor, informe a data da doação", "alert-warning");
            return;
        }
        
        const valorDoacao = parseFloat(document.getElementById("valorDoacao").value) || 0;
        
        if (valorDoacao <= 0 && (!doarProdutos.checked || produtosDoados.length === 0)) {
            mostrarAlerta("É necessário informar um valor ou incluir produtos na doação", "alert-warning");
            return;
        }
        
        // Montar objeto de doação
        const doacao = {
            doadorId: doadorId.value,
            data: dataDoacao,
            valor: valorDoacao,
            status: "Agendada",
            produtos: doarProdutos.checked ? produtosDoados.map(p => ({ 
                produtoId: p.produtoId, 
                quantidade: p.quantidade 
            })) : []
        };
        
        // Enviar para o servidor
        fetch("/doacoes/agendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doacao)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                mostrarAlerta(data.msg, "alert-success");
                setTimeout(() => {
                    window.location.href = "/doacoes";
                }, 2000);
            } else {
                mostrarAlerta(data.msg, "alert-danger");
            }
        })
        .catch(error => {
            console.error("Erro ao salvar doação:", error);
            mostrarAlerta("Erro ao salvar doação. Tente novamente.", "alert-danger");
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