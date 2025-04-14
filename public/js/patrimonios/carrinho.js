document.addEventListener("DOMContentLoaded", function() {

    //Carrinho Botão da tabela
    var btnAddCarrinho = document.querySelectorAll(".btnAddCarrinho");

    //Modal confirmar Pedido
    var btnConfirmar = document.querySelector("#btnConfirmarPedido");
    btnConfirmar.addEventListener("click", gravarPedido);

    let carrinho = [];

    for(let i = 0; i < btnAddCarrinho.length; i++) {
        btnAddCarrinho[i].addEventListener("click", adicionarAoCarrinho);
    }
    
    //Altera o numero do Botão do carrinho que abre o Modal
    if(localStorage.getItem("carrinhoPatrimonio") != null) {
        carrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));

        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    //Carrega o carrinho, a função show.bs.modal carrega o carrinho antes de abrir para que todos os itens estão lá dentro antes da abertura
    var modalCarrinho = document.getElementById('modalCarrinho')
    modalCarrinho.addEventListener('show.bs.modal', function (event) {
        carregarCarrinho();
    })

    function gravarPedido() {

        let listaCarrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
        if(listaCarrinho.length > 0) {

            fetch("/pedidosPatrimonio/gravar", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(listaCarrinho)
            })
            .then(r=> {
                return r.json();
            })
            .then(r=> {
                alert(r.msg);
                localStorage.removeItem("carrinhoPatrimonio");
                window.location.reload();
            })

        }
        else{
            alert("O carrinho está vazio!");
        }
    }
    
    function carregarCarrinho() {

        let html = "";

        let carrinhoModal = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
        let valorTotalCarrinho = 0;
        if(carrinhoModal.length > 0) {
            for(let i = 0; i<carrinhoModal.length; i++) {
                html += `<tr>
                            <td>${carrinhoModal[i].patrimonioId}</td>                       
                            <td>${carrinhoModal[i].patrimonioNome}</td>
                            <td>
                                <div style="display:flex;">
                                    <button class="btn btn-default incrementar" data-patrimonio="${carrinhoModal[i].patrimonioId}" >+</button>
                                    <input style="width:100px;" type="number" class="form-control inputQtde" data-patrimonio="${carrinhoModal[i].patrimonioId}" value="${carrinhoModal[i].quantidade}" />
                                    <button class="btn btn-default decrementar" data-patrimonio="${carrinhoModal[i].patrimonioId}">-</button>
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-danger remover" data-patrimonio="${carrinhoModal[i].patrimonioId}"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
            }
            
            document.querySelector("#tabelaCarrinho > tbody").innerHTML = html;

            if(valorTotalCarrinho > 0) {
                document.querySelector("#valorTotal").innerHTML = `<h2>Valor total do pedido: R$ ${valorTotalCarrinho}</h2>`
            }
            document.querySelector("#msgCarrinhoVazio").style["display"] = "none";
            document.querySelector("#tabelaCarrinho").style["display"] = "inline-table";
            document.querySelector("#valorTotal").style["display"] = "block";
            
            iniciarEventos();
        }
        else{
            document.querySelector("#msgCarrinhoVazio").style["display"] = "block";
            document.querySelector("#tabelaCarrinho").style["display"] = "none";
            document.querySelector("#valorTotal").style["display"] = "none";
        }

    }   

    function iniciarEventos() {

        let inputQtde = document.querySelectorAll(".inputQtde");

        let btnIncrementar = document.querySelectorAll(".incrementar");

        let btnDecrementar = document.querySelectorAll(".decrementar");

        let btnRemover = document.querySelectorAll(".remover");

        for(let i = 0; i < inputQtde.length; i++) {
            inputQtde[i].addEventListener("change", alterarValor);
            btnIncrementar[i].addEventListener("click", incrementar);
            btnDecrementar[i].addEventListener("click", decrementar);
            btnRemover[i].addEventListener("click", remover);
        }

    }

    function incrementar() {
        let patrimonio = this.dataset.patrimonio;
        let valor = document.querySelector(`input[data-patrimonio='${patrimonio}']`).value;
        valor++;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(patrimonio == listaCarrinho[i].patrimonioId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinhoPatrimonio", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function decrementar() {
        let patrimonio = this.dataset.patrimonio;
        let valor = document.querySelector(`input[data-patrimonio='${patrimonio}']`).value;
        valor--;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(patrimonio == listaCarrinho[i].patrimonioId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinhoPatrimonio", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function alterarValor() {

        let valor = this.value;
        if(valor > 0 && valor < 999) {
            let patrimonio = this.dataset.patrimonio;

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(patrimonio == listaCarrinho[i].patrimonioId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinhoPatrimonio", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else{
            alert("Valor incorreto, selecione entre 0 e 999");
        }

    }

    function remover() {
        let patrimonio = this.dataset.patrimonio;
        let listaCarrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));

        listaCarrinho = listaCarrinho.filter(x=> x.patrimonioId != patrimonio);

        localStorage.setItem("carrinhoPatrimonio", JSON.stringify(listaCarrinho));

        let carrinho = localStorage.getItem("carrinhoPatrimonio");

        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
        document.getElementById("contadorCarrinho").innerText = carrinho.length;

        carregarCarrinho();
    }
    
    // Inicio - Adicionar LocalStorage Carrinho
    function adicionarItemCarrinho(item) {
        let carrinho = localStorage.getItem("carrinhoPatrimonio");
    
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
        localStorage.setItem("carrinhoPatrimonio", JSON.stringify(carrinho));
                
        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinhoPatrimonio"));
        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    function adicionarAoCarrinho() {
        let id = this.dataset.patrimonioid;
    
        fetch("/patrimonios/obter/" + id)
            .then(r => r.json())
            .then(r => {
                if (r.patrimonioEncontrado !== null) {
                    adicionarItemCarrinho(r.patrimonioEncontrado);
    
                    this.innerHTML = "<i class='fas fa-check'></i> Adicionado!";
    
                    let that = this;
                    setTimeout(function() {
                        that.innerHTML = `<i class="fas fa-cart-plus"></i>`;
                    }, 5000);
                }
            })
    }
    // Fim - Adicionar LocalStorage Carrinho
})