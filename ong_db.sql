-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Tempo de geração: 14/04/2025 às 15:18
-- Versão do servidor: 8.0.35
-- Versão do PHP: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `ong_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `doacao`
--

CREATE TABLE `doacao` (
  `id_doacao` int NOT NULL,
  `doador_id` int NOT NULL,
  `data` date NOT NULL,
  `valor` decimal(10,2) DEFAULT '0.00',
  `status` varchar(50) DEFAULT 'Agendada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `doacao`
--

INSERT INTO `doacao` (`id_doacao`, `doador_id`, `data`, `valor`, `status`) VALUES
(1, 7, '2025-04-14', 0.00, 'Agendada');

-- --------------------------------------------------------

--
-- Estrutura para tabela `doacao_item`
--

CREATE TABLE `doacao_item` (
  `id_doacao_item` int NOT NULL,
  `doacao_id` int NOT NULL,
  `produto_id` int NOT NULL,
  `quantidade` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `doacao_item`
--

INSERT INTO `doacao_item` (`id_doacao_item`, `doacao_id`, `produto_id`, `quantidade`) VALUES
(1, 1, 3, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `doador`
--

CREATE TABLE `doador` (
  `id_doador` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `CPF` varchar(14) NOT NULL,
  `RG` varchar(20) NOT NULL,
  `sexo` char(1) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `CEP` varchar(10) NOT NULL,
  `admin` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `doador`
--

INSERT INTO `doador` (`id_doador`, `nome`, `CPF`, `RG`, `sexo`, `email`, `senha`, `telefone`, `endereco`, `CEP`, `admin`) VALUES
(2, 'Joao', '256.473.770-68', '41.926.624-0', 'M', 'favaraovieira@gmail.com', '6467', '(18) 99790-6467', 'Rua das Flores, 123', '19010-999', 1),
(7, 'Lucas', '256.473.770-64', '41.926.624-9', 'M', 'lucas@email.com', '111', '(18) 99790-6467', 'Rua das Flores, 123', '19010-999', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `evento`
--

CREATE TABLE `evento` (
  `id_evento` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime NOT NULL,
  `local` varchar(255) NOT NULL,
  `projeto_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `evento`
--

INSERT INTO `evento` (`id_evento`, `nome`, `descricao`, `data_inicio`, `data_fim`, `local`, `projeto_id`) VALUES
(1, 'Eventao', 'Evento muito legal', '2025-02-26 00:00:00', '2025-02-26 00:00:00', 'Casa de eventos', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `patrimonio`
--

CREATE TABLE `patrimonio` (
  `id_patrimonio` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `quantidade` int NOT NULL,
  `projeto_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `patrimonio`
--

INSERT INTO `patrimonio` (`id_patrimonio`, `nome`, `descricao`, `quantidade`, `projeto_id`) VALUES
(1, 'Patrimonio', 'Baita patrimonio', 10, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `ped_id` int NOT NULL,
  `ped_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`ped_id`, `ped_data`) VALUES
(1, '2025-02-26 13:06:59'),
(2, '2025-02-27 15:59:46');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidopatrimonio`
--

CREATE TABLE `pedidopatrimonio` (
  `pedpat_id` int NOT NULL,
  `pedpat_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `quantidade` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `nome`, `descricao`, `preco`, `quantidade`) VALUES
(2, 'Camisa de algodo', 'Bem fofinha', 150.00, 49),
(3, 'Sapato', 'Sapato de couro', 230.00, 20);

-- --------------------------------------------------------

--
-- Estrutura para tabela `projetos`
--

CREATE TABLE `projetos` (
  `id_projeto` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `objetivo` text,
  `orcamento` decimal(15,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `projetos`
--

INSERT INTO `projetos` (`id_projeto`, `nome`, `descricao`, `data_inicio`, `data_fim`, `objetivo`, `orcamento`, `status`) VALUES
(1, 'Projetinho', 'Um projeto legal', '2025-02-06', '2025-02-18', 'ganhar dinheiro', 5000.00, '1');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_pedidoitens`
--

CREATE TABLE `tb_pedidoitens` (
  `pit_id` int NOT NULL,
  `ped_id` int NOT NULL,
  `id_produto` int NOT NULL,
  `pit_quantidade` int NOT NULL,
  `pit_valorunitario` decimal(10,2) NOT NULL,
  `pit_valortotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `tb_pedidoitens`
--

INSERT INTO `tb_pedidoitens` (`pit_id`, `ped_id`, `id_produto`, `pit_quantidade`, `pit_valorunitario`, `pit_valortotal`) VALUES
(1, 2, 2, 1, 150.00, 150.00),
(2, 2, 3, 1, 230.00, 230.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_pedidoitenspatrimonio`
--

CREATE TABLE `tb_pedidoitenspatrimonio` (
  `pitpat_id` int NOT NULL,
  `pedpat_id` int NOT NULL,
  `id_patrimonio` int NOT NULL,
  `pitpat_quantidade` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `doacao`
--
ALTER TABLE `doacao`
  ADD PRIMARY KEY (`id_doacao`),
  ADD KEY `doador_id` (`doador_id`);

--
-- Índices de tabela `doacao_item`
--
ALTER TABLE `doacao_item`
  ADD PRIMARY KEY (`id_doacao_item`),
  ADD KEY `doacao_id` (`doacao_id`),
  ADD KEY `produto_id` (`produto_id`);

--
-- Índices de tabela `doador`
--
ALTER TABLE `doador`
  ADD PRIMARY KEY (`id_doador`),
  ADD UNIQUE KEY `CPF` (`CPF`),
  ADD UNIQUE KEY `RG` (`RG`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `projeto_id` (`projeto_id`);

--
-- Índices de tabela `patrimonio`
--
ALTER TABLE `patrimonio`
  ADD PRIMARY KEY (`id_patrimonio`),
  ADD KEY `projeto_id` (`projeto_id`);

--
-- Índices de tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ped_id`);

--
-- Índices de tabela `pedidopatrimonio`
--
ALTER TABLE `pedidopatrimonio`
  ADD PRIMARY KEY (`pedpat_id`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices de tabela `projetos`
--
ALTER TABLE `projetos`
  ADD PRIMARY KEY (`id_projeto`);

--
-- Índices de tabela `tb_pedidoitens`
--
ALTER TABLE `tb_pedidoitens`
  ADD PRIMARY KEY (`pit_id`),
  ADD KEY `ped_id` (`ped_id`),
  ADD KEY `id_produto` (`id_produto`);

--
-- Índices de tabela `tb_pedidoitenspatrimonio`
--
ALTER TABLE `tb_pedidoitenspatrimonio`
  ADD PRIMARY KEY (`pitpat_id`),
  ADD KEY `pedpat_id` (`pedpat_id`),
  ADD KEY `id_patrimonio` (`id_patrimonio`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `doacao`
--
ALTER TABLE `doacao`
  MODIFY `id_doacao` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `doacao_item`
--
ALTER TABLE `doacao_item`
  MODIFY `id_doacao_item` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `doador`
--
ALTER TABLE `doador`
  MODIFY `id_doador` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `patrimonio`
--
ALTER TABLE `patrimonio`
  MODIFY `id_patrimonio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ped_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `pedidopatrimonio`
--
ALTER TABLE `pedidopatrimonio`
  MODIFY `pedpat_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_produto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `projetos`
--
ALTER TABLE `projetos`
  MODIFY `id_projeto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `tb_pedidoitens`
--
ALTER TABLE `tb_pedidoitens`
  MODIFY `pit_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tb_pedidoitenspatrimonio`
--
ALTER TABLE `tb_pedidoitenspatrimonio`
  MODIFY `pitpat_id` int NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `doacao`
--
ALTER TABLE `doacao`
  ADD CONSTRAINT `doacao_ibfk_1` FOREIGN KEY (`doador_id`) REFERENCES `doador` (`id_doador`);

--
-- Restrições para tabelas `doacao_item`
--
ALTER TABLE `doacao_item`
  ADD CONSTRAINT `doacao_item_ibfk_1` FOREIGN KEY (`doacao_id`) REFERENCES `doacao` (`id_doacao`),
  ADD CONSTRAINT `doacao_item_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produto` (`id_produto`);

--
-- Restrições para tabelas `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id_projeto`);

--
-- Restrições para tabelas `patrimonio`
--
ALTER TABLE `patrimonio`
  ADD CONSTRAINT `patrimonio_ibfk_1` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id_projeto`);

--
-- Restrições para tabelas `tb_pedidoitens`
--
ALTER TABLE `tb_pedidoitens`
  ADD CONSTRAINT `tb_pedidoitens_ibfk_1` FOREIGN KEY (`ped_id`) REFERENCES `pedido` (`ped_id`),
  ADD CONSTRAINT `tb_pedidoitens_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`);

--
-- Restrições para tabelas `tb_pedidoitenspatrimonio`
--
ALTER TABLE `tb_pedidoitenspatrimonio`
  ADD CONSTRAINT `tb_pedidoitenspatrimonio_ibfk_1` FOREIGN KEY (`pedpat_id`) REFERENCES `pedidopatrimonio` (`pedpat_id`),
  ADD CONSTRAINT `tb_pedidoitenspatrimonio_ibfk_2` FOREIGN KEY (`id_patrimonio`) REFERENCES `patrimonio` (`id_patrimonio`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
