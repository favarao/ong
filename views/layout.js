<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Painel de controle</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="/css/fontawesome-free/css/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="/css/adminlte.min.css">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

  <link rel="stylesheet" href="/css/style.css">

  <link rel="stylesheet" href="/css/fontawesome-free/css/all.min.css">

  <link rel="stylesheet" type="text/css" media="print" href="/css/print.css">

</head>

<body class="hold-transition sidebar-mini layout-fixed">
  <div class="wrapper">
    <!-- Navbar lateral-->
    <aside id="sidebar" class="expand">
      <div class="d-flex">
        <button class="toggle-btn" type="button">
          <i class="fas fa-bars"></i>
        </button>
        <div class="sidebar-logo">
          <a href="/">ARTECH</a>
        </div>
      </div>
      <ul class="sidebar-nav">
        <% if (usuarioLogado && usuarioLogado.admin === 1) { %>
        <li class="sidebar-item">
          <a href="/eventos" class="sidebar-link">
            <i class="fas fa-lightbulb"></i>
            <span>Eventos</span>
          </a>
        </li>
        <% } %>

        <li class="sidebar-item">
          <a href="/produtos" class="sidebar-link">
            <i class="fas fa-tshirt"></i>
            <span>Produtos</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a href="/patrimonios" class="sidebar-link">
            <i class="fas fa-building"></i>
            <span>Patrimonios</span>
          </a>
        </li>

        <li class="sidebar-item">
          <a href="/projetos" class="sidebar-link">
            <i class="fas fa-project-diagram"></i>
            <span>Projetos</span>
          </a>
      </ul>
      <div class="sidebar-footer d-flex justify-content-center mb-3">
        <a href="/login/logout" class="btn btn-dark">Logout</a>
      </div>
    </aside>

    <div class="main">

      <main class="content px-3 py-4">
        <%- body %>
      </main>
      <footer class="footer">
        <strong>Copyright &copy; 2023-2024 <a class="text-primary">Artech</a></strong>
        All rights reserved.
        <div class="float-right d-none d-sm-inline-block">
          <b>Version</b> 3.2.0
        </div>
      </footer>
    </div>

  </div>
  <!-- jQuery -->
  <script src="/js/jquery/jquery.min.js"></script>
  <!-- jQuery UI 1.11.4 -->
  <!-- Bootstrap 4 -->
  <script src="/js/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- AdminLTE App -->
  <script src="/js/adminlte.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
  integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
  crossorigin="anonymous"></script>
  <script src="/js/script.js"></script>
</body>

</html>