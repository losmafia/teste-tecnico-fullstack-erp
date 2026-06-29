Teste Técnico - Desenvolvedor Fullstack Pleno
Prazo: 2 a 3 dias
Olá!
Obrigado por participar do nosso processo seletivo para a vaga de Desenvolvedor Fullstack Pleno.
A proposta deste teste é avaliar sua capacidade de construir uma funcionalidade fullstack próxima do nosso contexto real: sistema ERP, monólito modular, regras de negócio, frontend, backend, banco de dados, cache, organização de código, Git e documentação.
O objetivo não é entregar uma aplicação grande, mas sim uma solução funcional, bem organizada e tecnicamente coerente.
Prazo
Você terá de 2 a 3 dias corridos para entregar o teste.
Não esperamos uma aplicação perfeita ou extensa. Esperamos uma entrega objetiva, funcional, com boas decisões técnicas e código que possa ser explicado em uma etapa posterior.
Stack obrigatória
Use obrigatoriamente:
·	Next.js
·	Node.js
·	TypeScript
·	Tailwind CSS
·	PostgreSQL
·	Redis
·	API REST
·	Git
Pode usar bibliotecas auxiliares, como:
·	Prisma ou Drizzle
·	Zod
·	React Hook Form
·	Zustand
·	TanStack Query
·	Axios
·	Docker
·	Jest ou Vitest
Desafio: Mini módulo de Clientes e Pedidos
Você deve construir uma pequena aplicação fullstack simulando um módulo de ERP.
O sistema deve permitir:
1.	autenticação simples;
2.	listagem e cadastro de clientes;
3.	ativação e inativação de clientes;
4.	criação de pedidos para clientes;
5.	associação de itens ao pedido;
6.	controle básico de permissões;
7.	regra de negócio impedindo pedido para cliente inativo;
8.	uso real de Redis em pelo menos um cenário.
Requisitos funcionais
Usuários e autenticação
Crie uma autenticação simples.
Pode ser login com usuário e senha fixos via seed.
Devem existir pelo menos dois perfis:
·	admin;
·	operador.
O usuário admin pode:
·	cadastrar clientes;
·	ativar e inativar clientes;
·	criar pedidos;
·	visualizar pedidos.
O usuário operador pode:
·	visualizar clientes;
·	criar pedidos;
·	visualizar pedidos.
O operador não pode:
·	ativar ou inativar clientes.
Não é necessário implementar cadastro de usuários.
Clientes
Cada cliente deve ter:
·	id;
·	nome;
·	documento;
·	email;
·	status: ativo ou inativo;
·	data de criação;
·	data de atualização.
Funcionalidades obrigatórias:
·	listar clientes;
·	cadastrar cliente;
·	alterar status do cliente;
·	filtrar clientes por nome ou status.
Regra obrigatória:
·	cliente inativo não pode receber novo pedido.
Pedidos
Cada pedido deve ter:
·	id;
·	cliente;
·	itens;
·	status;
·	valor total;
·	data de criação;
·	data de atualização.
Status possíveis:
·	draft;
·	confirmed;
·	cancelled.
Cada item do pedido deve ter:
·	descrição;
·	quantidade;
·	valor unitário;
·	subtotal.
Regras obrigatórias:
1.	pedido precisa ter pelo menos 1 item;
2.	quantidade do item deve ser maior que zero;
3.	valor unitário deve ser maior que zero;
4.	cliente inativo não pode receber pedido;
5.	valor total deve ser calculado no backend.
Não é obrigatório implementar fluxo completo de alteração de status do pedido, mas será considerado diferencial.
API REST obrigatória
Implemente pelo menos os seguintes endpoints:
POST /api/auth/login
POST /api/auth/logout

GET /api/customers
POST /api/customers
PATCH /api/customers/:id/status

GET /api/orders
POST /api/orders
GET /api/orders/:id

Endpoint diferencial:
PATCH /api/orders/:id/status

Você pode adicionar outros endpoints se achar necessário.
Banco de dados
Use PostgreSQL.
Modele pelo menos as seguintes entidades:
·	users;
·	customers;
·	orders;
·	order_items.
Esperamos ver:
·	migrations;
·	relacionamentos;
·	chaves estrangeiras;
·	dados obrigatórios bem definidos;
·	seed inicial, se necessário.
Não é necessário criar um modelo complexo de permissões com tabela separada. Pode usar um campo simples de perfil no usuário, desde que a regra esteja clara.
Redis
Use Redis de forma real em pelo menos um cenário.
Exemplos aceitáveis:
·	cache da listagem de clientes;
·	sessão de usuário;
·	cache de permissões do usuário;
·	cache de resumo simples de pedidos.
Você deve explicar no README:
·	onde Redis foi usado;
·	qual chave foi criada;
·	qual TTL foi escolhido;
·	quando o cache é invalidado;
·	por que Redis faz sentido nesse ponto.
Não basta apenas instalar Redis no projeto.
Frontend
Crie uma interface com Tailwind CSS contendo:
1.	tela de login;
2.	tela de listagem de clientes;
3.	formulário de cadastro de cliente;
4.	ação para ativar ou inativar cliente, respeitando permissão;
5.	tela de listagem de pedidos;
6.	formulário de criação de pedido;
7.	detalhe simples do pedido.
A interface deve ter:
·	estados de loading;
·	mensagens de erro;
·	mensagens de sucesso;
·	validações básicas;
·	layout minimamente organizado;
·	componentes reutilizáveis quando fizer sentido.
Não é necessário entregar um design avançado. O foco é clareza, usabilidade e organização.
Testes
Inclua pelo menos testes para as regras críticas.
Obrigatórios:
1.	não permitir pedido para cliente inativo;
2.	não permitir pedido sem itens;
3.	não permitir item com quantidade zero;
4.	não permitir ativar ou inativar cliente usando usuário operador.
Pode usar Jest, Vitest ou outra ferramenta.
Testes de interface são opcionais.
Git
Use commits organizados.
Não aceitaremos entrega com apenas um commit final.
Esperamos no mínimo 4 commits coerentes.
Exemplos de bons commits:
feat(auth): add login and role handling
feat(customers): implement customer list and status update
feat(orders): add order creation business rules
test(orders): cover inactive customer rule
docs: explain setup and Redis strategy

README obrigatório
O README deve conter:
5.	descrição do projeto;
6.	stack utilizada;
7.	como rodar localmente;
8.	variáveis de ambiente;
9.	como rodar migrations;
10.	como rodar testes;
11.	usuários de teste;
12.	explicação simples da arquitetura;
13.	explicação do uso de Redis;
14.	lista dos endpoints;
15.	decisões técnicas;
16.	pontos que você melhoraria com mais tempo;
17.	declaração sobre uso de IA, caso tenha utilizado.
Sobre IA: o uso de ferramentas como ChatGPT, Copilot, Cursor, Claude ou similares é permitido, desde que você declare onde usou e consiga explicar o código entregue.
Entrega
Envie:
·	link do repositório GitHub;
·	instruções para acesso, caso seja privado;
·	observações importantes para execução;
·	tempo aproximado gasto;
·	se usou IA, informe em quais partes.

