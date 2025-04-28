// Importa o módulo Express
const express = require('express');
// Importa o módulo express-ejs-layouts
const expressEjsLayout = require('express-ejs-layouts');
const homeRoute = require('./routes/homeRoute');
const loginRoute = require('./routes/loginRoute');
const pagamentoRoute = require('./routes/pagamentoRoute');
const produtoRoute = require('./routes/produtoRoute');
const pedidoRoute = require("./routes/pedidoRoute");
const pedidoPatrimonioRoute = require("./routes/pedidoPatrimonioRoute");
const eventoRoute = require('./routes/eventoRoute');
const patrimonioRoute = require('./routes/patrimonioRoute');
const AuthMiddleware = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const projetoRoute = require('./routes/projetoRoute');
const doacaoRoute = require('./routes/doacaoRoute');
const devolucaoRoute = require('./routes/devolucaoRoute');
const saidaEventoRoute = require('./routes/saidaEventoRoute');
// Cria uma instância do aplicativo Express
const app = express();

//---- configura a localização da pasta views ----
// Configura a pasta de views
app.set("views", "./views");
// Define o EJS como o motor de views
app.set("view engine", "ejs");
// Define o layout padrão
app.set("layout", "./layout");

app.use(express.urlencoded({extended:true}));
// Middleware para parsear requests JSON
app.use(express.json());
// Serve arquivos estáticos da pasta public
app.use(express.static("public"));
// Usa o módulo express-ejs-layouts
app.use(expressEjsLayout);

app.use(cookieParser());

//---- Configuções de Rotas existentes no nosso sistema ----
app.use('/', homeRoute);
app.use('/login', loginRoute);

let auth = new AuthMiddleware();
app.use(auth.verificarUsuarioLogado);

// Disponibiliza o usuário para todas as views
app.use((req, res, next) => {
    res.locals.isAdmin = req.admin || null;
    res.locals.nome = req.nome || null;
    res.locals.doadorId = req.doadorId || null;
    next();
});

// Rotas acessíveis a todos os usuários logados
app.use('/pagamento', pagamentoRoute);
app.use('/produtos', produtoRoute);
app.use("/pedidos", pedidoRoute);
app.use("/pedidosPatrimonio", pedidoPatrimonioRoute);
app.use('/patrimonios', patrimonioRoute);
app.use('/projetos', projetoRoute);
app.use('/doacoes', doacaoRoute);
app.use('/devolucoes', devolucaoRoute);
app.use('/saidasEventos', saidaEventoRoute);


// Apenas a rota de eventos requer perfil admin
app.use('/eventos', auth.verificarAdmin.bind(auth), eventoRoute);

app.listen(5000, ()=>{
    console.log("Serv iniciado");
});