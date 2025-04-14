document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnExportarExcel").addEventListener("click", exportarExcel);

    document.getElementById("btnFiltrar").addEventListener("click", buscar);

    let filtroEscolhido = 0;

    let itemFiltro = document.querySelectorAll(".itemFiltro");

    
    let btns = document.querySelectorAll(".btnExclusao");

    for(let i = 0; i<itemFiltro.length; i++) {
        itemFiltro[i].addEventListener("click", mudarCriterioFiltragem);
    }

    for(let i = 0; i<btns.length; i++) {
        btns[i].addEventListener("click", excluir);
    }

    function buscar() {
        let termoFiltro = document.getElementById("filtro").value;

        if (termoFiltro == "") {
            termoFiltro = "todos";
            filtroEscolhido = 0;
        }

        fetch(`/produtos/filtrar/${termoFiltro}/${filtroEscolhido}`)
            .then(r => {
                return r.json();
            })
            .then(r => {
                //remontar tabela
                console.log(r);
                if (r.length > 0) {
                    let htmlCorpo = "";
                    for (let i = 0; i < r.length; i++) {
                        htmlCorpo += `
                                <tr>
                                    <td>${r[i].produtoId}</td>
                                    <td>${r[i].produtoNome}</td>
                                    <td>${r[i].produtoDescricao}</td>
                                    <td>${r[i].produtoQuantidade}</td>
                                    <td>${r[i].produtoPreco}</td>
                                    <td>
                                        <button data-produtoid="${r[i].produtoId}" class="btn btn-success btnAddCarrinho">
                                            <i class="fas fa-cart-plus"></i>
                                        </button>

                                        <a href="/produtos/alterar/${r[i].produtoId}" class="btn btn-primary">
                                            <i class="fas fa-pen"></i>
                                        </a>

                                        <button data-codigoexclusao="${r[i].produtoId}" class="btn btn-danger btnExclusao">
                                            <i class="fas fa-trash"></i>
                                        </button>

                                     </td>
                                </tr>
                            `;
                    }

                    document.querySelector("#tabelaPedidos > tbody").innerHTML = htmlCorpo;

                    associarEventos();
                } else {
                    alert("Não foi possivel encontrar!");
                 //    let htmlCorpo = "";
                 //    htmlCorpo += `
                 //                    <h1>Não foi possivel encontrar!</h1>
                 //            `;
                 //    document.querySelector("#tabelaPedidos > thead").style.display = "none";                
                 //    document.querySelector("#tabelaPedidos > tbody").innerHTML = htmlCorpo;
                 }
            })
    }

    function excluir() {
        let id = this.dataset.codigoexclusao;

        if(id != null) {
            if(confirm("Tem certeza que deseja excluir esse produto?")) {
                let obj = {
                    id: id
                }

                fetch('/produtos/excluir', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                .then(r => {
                    return r.json()
                })
                .then(r=> {
                    if(r.ok) {
                        window.location.reload();
                    }
                    else{
                        alert(r.msg);
                    }

                })

            }
        }
        else{
            alert("Nenhum ID encontrado para exclusão");
        }
    }

    // function exportarExcel() {
    //     //chama a biblioteca para gerar o excel
    //     var wb = XLSX.utils.table_to_book(document.getElementById("tabelaPedidos"));
    //     /* Export to file (start a download) */
    //     XLSX.writeFile(wb, "relatorio-pedidos.xlsx");
    // }

    function exportarExcel() {
        // Seleciona a tabela específica pelo seu ID
        var tabela = document.getElementById("tabelaPedidos");
    
        // Remove a última coluna do cabeçalho
        tabela.querySelector("thead th:last-child").remove();
    
        // Remove a última coluna de cada linha do corpo da tabela
        var linhas = tabela.querySelectorAll("tbody tr");
        linhas.forEach(function(linha) {
            linha.querySelector("td:last-child").remove();
        });
    
        // Cria o workbook a partir da tabela modificada
        var wb = XLSX.utils.table_to_book(tabela);
    
        // Exporta para um arquivo (inicia o download)
        XLSX.writeFile(wb, "relatorio-pedidos.xlsx");
    
        // Restaura a tabela original (opcional, dependendo do seu caso de uso)
        location.reload();
    }

    function adicionarItemCarrinho(item) {
        let carrinho = localStorage.getItem("carrinhoProduto");
    
        if (carrinho !== null) {
            carrinho = JSON.parse(carrinho);
        } else {
            carrinho = [];
        }
    
        // Verifica se o item já está no carrinho
        let itemIndex = carrinho.findIndex(i => i.patrimonioId === item.patrimonioId);
    
        if (itemIndex !== -1) {
            // Se o item já existe, incrementa a quantidade
            carrinho[itemIndex].quantidade++;
        } else {
            // Se o item não existe, adiciona ao carrinho
            item.quantidade = 1;
            carrinho.push(item);
        }
    
        // Atualiza o localStorage
        localStorage.setItem("carrinhoProduto", JSON.stringify(carrinho));
                
        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinhoProduto"));
        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    function adicionarAoCarrinho() {
        let id = this.dataset.produtoid;
    
        fetch("/produtos/obter/" + id)
            .then(r => r.json())
            .then(r => {
                if (r.produtoEncontrado !== null) {
                    adicionarItemCarrinho(r.produtoEncontrado);
    
                    this.innerHTML = "<i class='fas fa-check'></i> Adicionado!";
    
                    let that = this;
                    setTimeout(function() {
                        that.innerHTML = `<i class="fas fa-cart-plus"></i>`;
                    }, 5000);
                }
            })
    }

    function associarEventos() {
        let btnsExclusao = document.querySelectorAll(".btnExclusao");
        let btnsAdicionarCarrinho = document.querySelectorAll(".btnAddCarrinho");

        btnsExclusao.forEach(btn => {
            btn.addEventListener("click", excluir);
        });

        btnsAdicionarCarrinho.forEach(btn => {
            btn.addEventListener("click", adicionarAoCarrinho);
        });
    }

    function mudarCriterioFiltragem() {
        let nome = this.dataset.nome;
        document.getElementById("btnEscolherFiltro").innerText = nome;
        filtroEscolhido = this.dataset.valor;
    }
    
})