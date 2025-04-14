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
    if(localStorage.getItem("carrinho") != null) {
        carrinho = JSON.parse(localStorage.getItem("carrinho"));

        document.getElementById("contadorCarrinho").innerText = carrinho.length;
    }

    //Carrega o carrinho, a função show.bs.modal carrega o carrinho antes de abrir para que todos os itens estão lá dentro antes da abertura
    var modalCarrinho = document.getElementById('modalCarrinho')
    modalCarrinho.addEventListener('show.bs.modal', function (event) {
        carregarCarrinho();
    })
    
    function gravarPedido() {

        let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
        if(listaCarrinho.length > 0) {

            fetch("/pedidos/gravar", {
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
                localStorage.removeItem("carrinho");
                window.location.reload();
            })

        }
        else{
            alert("O carrinho está vazio!");
        }
    }
    
    function carregarCarrinho() {

        let html = "";

        let carrinhoModal = JSON.parse(localStorage.getItem("carrinho"));
        let valorTotalCarrinho = 0;
        if(carrinhoModal.length > 0) {
            for(let i = 0; i<carrinhoModal.length; i++) {

                let valorTotalItem = carrinhoModal[i].produtoPreco * carrinhoModal[i].quantidade;
                valorTotalCarrinho += valorTotalItem;
                html += `<tr>
                            <td>${carrinhoModal[i].produtoId}</td>                       
                            <td>${carrinhoModal[i].produtoNome}</td>
                            <td>R$${carrinhoModal[i].produtoPreco}</td>
                            <td>
                                <div style="display:flex;">
                                    <button class="btn btn-default incrementar" data-produto="${carrinhoModal[i].produtoId}" >+</button>
                                    <input style="width:100px;" type="number" class="form-control inputQtde" data-produto="${carrinhoModal[i].produtoId}" value="${carrinhoModal[i].quantidade}" />
                                    <button class="btn btn-default decrementar" data-produto="${carrinhoModal[i].produtoId}">-</button>
                                </div>
                            </td>
                            <td>R$${valorTotalItem}</td>
                            <td>
                                <button class="btn btn-danger remover" data-produto="${carrinhoModal[i].produtoId}"><i class="fas fa-trash"></i></button>
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
        let produto = this.dataset.produto;
        let valor = document.querySelector(`input[data-produto='${produto}']`).value;
        valor++;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function decrementar() {
        let produto = this.dataset.produto;
        let valor = document.querySelector(`input[data-produto='${produto}']`).value;
        valor--;
        if(valor > 0 && valor < 999) {

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else {
            alert("Valor incorreto, selecione entre 0 e 999");
        }
    }

    function alterarValor() {


        let valor = this.value;
        if(valor > 0 && valor < 999) {
            let produto = this.dataset.produto;

            let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));
    
            for(let i = 0; i<listaCarrinho.length; i++) {
                if(produto == listaCarrinho[i].produtoId) {
                    listaCarrinho[i].quantidade = valor;
                }
            }
    
            localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
    
            carregarCarrinho();
        }
        else{
            alert("Valor incorreto, selecione entre 0 e 999");
        }

    }

    function remover() {
        let produto = this.dataset.produto;
        let listaCarrinho = JSON.parse(localStorage.getItem("carrinho"));

        listaCarrinho = listaCarrinho.filter(x=> x.produtoId != produto);

        localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));

        let carrinho = localStorage.getItem("carrinho");

        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinho"));
        document.getElementById("contadorCarrinho").innerText = carrinho.length;

        carregarCarrinho();
    }
    
    // Inicio - Adicionar LocalStorage Carrinho
    function adicionarItemCarrinho(item) {
        let carrinho = localStorage.getItem("carrinho");
    
        if (carrinho !== null) {
            carrinho = JSON.parse(carrinho);
        } else {
            carrinho = [];
        }
    
        // Verifica se o item já está no carrinho
        let itemIndex = carrinho.findIndex(i => i.produtoId === item.produtoId);
    
        if (itemIndex !== -1) {
            // Se o item já existe, incrementa a quantidade
            carrinho[itemIndex].quantidade++;
        } else {
            // Se o item não existe, adiciona ao carrinho
            item.quantidade = 1;
            carrinho.push(item);
        }
    
        // Atualiza o localStorage
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
                
        //incrementar contador com a nova lista;
        carrinho = JSON.parse(localStorage.getItem("carrinho"));
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
    // Fim - Adicionar LocalStorage Carrinho
})