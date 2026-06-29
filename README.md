# Teste Técnico - ERP

🌟 **Demonstração Online:** [https://teste-tecnico-fullstack-erp.vercel.app](https://teste-tecnico-fullstack-erp.vercel.app)  
*(Você pode usar o usuário `admin` e a senha `123` para acessar a versão online)*
 *(Ferramentas utilizadas: Vercel + Render + Supabase)*

## Descrição do Projeto
Este projeto é um simulador de módulo de ERP como teste no processo Seletivo para vaga de fullstack RioPae com foco na gestão de clientes e pedidos. Ele contempla a autenticação, controle de permissões por perfil (Administrador e Operador), regras de negócios específicas (ex.: bloqueio de pedidos para clientes inativos). A aplicação foi desenvolvida considerando performance, segurança e uma arquitetura separada entre Frontend e Backend.

## Stack Utilizada
- Frontend: Next.js, React, TypeScript, Tailwind CSS, Axios
- Backend: Node.js, Express, TypeScript, JWT
- Banco de Dados: PostgreSQL
- ORM: Prisma
- Cache: Redis
- Testes: Vitest, Supertest
- Infraestrutura: Docker, Docker Compose

## Como rodar localmente
A aplicação foi empacotada utilizando Docker para garantir consistência e facilitar a avaliação.

Pré-requisito: Docker e Docker Compose instalados na máquina.

1. Clone o repositório.
2. Na raiz do projeto, execute o comando:
   docker compose up --build

O Docker irá inicializar os containers do PostgreSQL, Redis, Backend (porta 3333) e Frontend (porta 3000).
Acesse a aplicação frontend em: http://localhost:3000

## Variáveis de Ambiente
Os arquivos de ambiente já estão configurados no arquivo docker-compose.yml para facilitar a execução local. Caso deseje rodar manualmente fora do Docker, as seguintes variáveis são utilizadas:

Backend:
PORT=3333
DATABASE_URL=postgresql://erp_user:erp_password@localhost:5432/erp_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=super_secret_jwt_key_for_testing

Frontend:
NEXT_PUBLIC_API_URL=http://localhost:3333/api

## Como rodar as migrations e seed
Ao utilizar o Docker Compose, o próprio container do backend já executa o comando "npx prisma migrate dev" ao iniciar, o que aplica as migrations no banco vazio e automaticamente roda a seed de usuários. Não é necessária nenhuma ação manual para popular o banco.

Caso esteja rodando de forma manual, acesse a pasta backend e execute:
npx prisma migrate dev

## Como rodar os testes
Os testes das regras de negócio críticas foram escritos usando Vitest e Supertest.
Para executá-los, acesse a pasta backend pelo terminal e rode:
npm install
npm run test

Os testes validam com sucesso as 4 regras obrigatórias solicitadas (bloqueio de clientes inativos, restrição de operador e totalizadores).

## Usuários de Teste
Os seguintes usuários são criados automaticamente pela Seed:

Administrador:
- Username: admin
- Senha: 123

Operador:
- Username: operador
- Senha: 123

## Explicação da Arquitetura
A arquitetura foi dividida em dois módulos principais:
- Backend: API REST construída em Node.js (Express), estruturada em camadas de rotas, middlewares (como a autenticação JWT) e controllers, consumindo o PostgreSQL via Prisma ORM.
- Frontend: Aplicação React estruturada em Next.js (App Router), adotando Tailwind CSS. A integração é feita chamando a API backend via Axios.

## Explicação do uso de Redis
O Redis foi implementado na listagem de clientes (GET /api/customers) para otimização de performance.
- Chave criada: customers_list_all
- TTL: 60 segundos
- Invalidação: Sempre que um cliente novo é criado ou seu status é alterado, o cache é deletado.
- Por que faz sentido: A listagem básica de clientes é frequentemente acessada. Servir essa lista em memória reduz significativamente a sobrecarga de consultas vindas do PostgreSQL. Consultas complexas usando filtros de busca fazem bypass do cache e vão direto ao banco.

## Lista dos Endpoints
Auth:
- POST /api/auth/login
- POST /api/auth/logout

Customers:
- GET /api/customers
- POST /api/customers
- PATCH /api/customers/:id/status

Orders:
- GET /api/orders
- POST /api/orders
- GET /api/orders/:id
- PATCH /api/orders/:id/status
- DELETE /api/orders/:id

## Decisões Técnicas
- Vitest: Adotado para os testes de integração backend pela integração fluida com TypeScript e execução nativa mais rápida que o Jest em módulos ES.
- Docker: Inclusão do docker-compose centralizado para garantir o padrão "Zero Config" durante a avaliação técnica.
- Segurança de Cálculos: Todos os cálculos e checagens críticas são re-validados no backend (controllers) blindando o banco de injeções client-side.

## Pontos de Melhoria com Mais Tempo
- Implementar um controle dinâmico de acesso com tabelas exclusivas no banco de dados.
- Adicionar Cypress para uma cobertura automatizada de testes do frontend.
- Migrar de armazenamento de JWT no LocalStorage para HTTPOnly Cookies para aumentar a segurança.
- Adicionar Logs ao sistema e armazenalos de forma simples no banco para controle e indicadores.
- Adicionar criptografica com bcrypt ou AES para dados sensiveis do cliente.
- Adicionar cache nos endpoints mais acessados.

## Declaração sobre o uso de IA
O uso de ferramentas de inteligência artificial(ANTIGRAVITY - GEMINI) foi feito de maneira pontual e assistencial ao longo de todo o projeto. As principais finalidades foram:
- Agilidade na estruturação base de sintaxe do Dockerfile e docker-compose.
- Revisão ortográfica e auxílio na documentação técnica deste projeto (pontuação e formalização).
Ressalto que toda a concepção arquitetônica, o design e o refino final das regras de negócio foram implementados, controlados e validados por mim, visando assegurar total domínio sobre a solução.
