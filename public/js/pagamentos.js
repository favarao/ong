document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("QRcode");
    btn.addEventListener("click", function () { gerarQRCode(); });
    const btnComprovante = document.getElementById("enviar-comprovante");
    btnComprovante.addEventListener("click", function () { HomePage(); });

    function gerarQRCode() {
        const valorPix = document.getElementById("valor-pix").value;
        const qrcodeContainer = document.getElementById("qrcode-container");
        const uploadComprovante = document.getElementById("comprovante");
        const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=pix:${encodeURIComponent(
            `chave=chave_pix&valor=${valorPix}`
        )}`;
        qrcodeContainer.innerHTML = `<img src="${qrcodeUrl}" alt="QR Code do Pix">`;
        uploadComprovante.style.display = "block";
        document.getElementById("enviar-comprovante").style.display = "block";
    }

    const pixOption = document.getElementById("pix-option");
    const cardOption = document.getElementById("card-option");
    const outrosOption = document.getElementById("outros-option");
    const radioButtons = document.querySelectorAll('input[name="payment-method"]');

    radioButtons.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (this.value === "pix") {
                pixOption.style.display = "block";
                cardOption.style.display = "none";
                outrosOption.style.display = "none";
            } else if (this.value === "card") {
                pixOption.style.display = "none";
                cardOption.style.display = "block";
                outrosOption.style.display = "none";
            } else if (this.value === "outros") {
                pixOption.style.display = "none";
                cardOption.style.display = "none";
                outrosOption.style.display = "block";
            }
        });
    });

    function HomePage() {
        alert('Comprovante enviado com sucesso!');
        var escolha = confirm('Deseja voltar para página inicial?');
        if (escolha == true) {
            window.location.href = "/"
        }
    }
});