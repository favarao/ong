document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#form")
    const nome = document.querySelector("#inputName");
    const cpf = document.querySelector("#inputCPF");
    const email = document.querySelector("#inputEmail4");
    const senha = document.querySelector("#inputPassword4");
    const tel = document.querySelector("#inputPhone");
    const end = document.querySelector("#inputAddress");
    const cidade = document.querySelector("#inputCity");
    const estado = document.querySelector("#inputState");

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (nome.value === '') {
            alert("Por favor, preencha o seu nome!");
        }

        if (end.value === '') {
            alert("Por favor, preencha um endereço valido!");
        }

        if (cidade.value === '') {
            alert("Por favor, preencha uma cidade valido!");
        }

        if (email.value === '' || !isEmailValid(email.value)) {
            alert("Por favor, preencha o seu email!");
        }

        if (!validatePassword(senha.value, 8)) {
            alert("A senha precisa ser no mínimo 8 dígitos.");
        }

        if (cpf.value === '' || !validateCpf(cpf.value)) {
            alert("CPF precisa ser no mínimo 11 dígitos.");
        }
        form.submit()
    })

    function validateCpf(cpf) {
        const cpfRegex = new RegExp(
            /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
        )
        if (cpfRegex.test(cpf)) {
            return true
        }

        return false
    }

    function validatePassword(password, minDigits) {

        if (password.length >= minDigits) {
            return true
        }

        return false
    }

    function isEmailValid(email) {

        const emailRegex = new RegExp(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/
        );

        if (emailRegex.test(email)) {
            return true
        }

        return false;
    }
});