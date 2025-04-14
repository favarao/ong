document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);

    function limparValidacao() {
        document.getElementById("inputNome").style["border-color"] = "#ced4da";
        document.getElementById("inputEmail").style["border-color"] = "#ced4da";
        document.getElementById("inputSenha").style["border-color"] = "#ced4da";
        document.getElementById("inputCPF").style["border-color"] = "#ced4da";
        document.getElementById("inputRG").style["border-color"] = "#ced4da";
        document.getElementById("inputSexo").style["border-color"] = "#ced4da";
        document.getElementById("inputTelefone").style["border-color"] = "#ced4da";
        document.getElementById("inputEndereco").style["border-color"] = "#ced4da";
        document.getElementById("inputCEP").style["border-color"] = "#ced4da";
    }

    function cadastrar() {
        limparValidacao();
        let nome = document.querySelector("#inputNome").value;
        let email = document.querySelector("#inputEmail").value;
        let senha = document.querySelector("#inputSenha").value;
        let cpf = document.querySelector("#inputCPF").value;
        let rg = document.querySelector("#inputRG").value;
        let sexo = document.querySelector("#inputSexo").value;
        let telefone = document.querySelector("#inputTelefone").value;
        let endereco = document.querySelector("#inputEndereco").value;
        let cep = document.querySelector("#inputCEP").value;

        let listaErros = [];
        if(nome == "") {
            listaErros.push("inputNome");
        }
        if(email == "") {
            listaErros.push("inputEmail");
        }
        if(senha == "") {
            listaErros.push("inputSenha");
        }
        if(cpf == "") {
            listaErros.push("inputCPF");
        }
        if(rg == "") {
            listaErros.push("inputRG");
        }
        if(sexo == "") {
            listaErros.push("inputSexo");
        }
        if(telefone == "") {
            listaErros.push("inputTelefone");
        }
        if(endereco == "") {
            listaErros.push("inputEndereco");
        }
        if(cep == "") {
            listaErros.push("inputCEP");
        }


        if(listaErros.length == 0) {
            //enviar ao backend com fetch

            let obj = {
                nome: nome,
                email: email,
                senha: senha,
                cpf: cpf,
                rg: rg,
                sexo: sexo,
                telefone: telefone,
                endereco: endereco,
                cep: cep,
            }

            fetch("/login/cadastrar", {
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
                    alert(r.msg);
                    window.location.href="/login";
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