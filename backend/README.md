📘 Portal de Vagas Voluntárias – Backend (NestJS)

✅ Visão Geral

Este projeto é a API backend do Portal de Vagas Voluntárias, desenvolvido em NestJS com banco de dados PostgreSQL, usando autenticação JWT, TypeORM e arquitetura modular. O sistema permite o cadastro de usuários com perfis distintos e gerenciamento de vagas para trabalho voluntário.

🚀 Tecnologias Utilizadas

NestJS

TypeORM

PostgreSQL

JWT (JSON Web Token)

bcrypt

class-validator / class-transformer

@nestjs/config para leitura de variáveis de ambiente

🧱 Estrutura Inicial

👤 Users

Cadastro de usuários com perfis: candidato ou ofertante

Validações com class-validator

Senhas armazenadas de forma segura com bcrypt

Campos protegidos (como password) ocultados da API com @Exclude

🔐 Auth

Login com email e senha

Geração de token JWT válido por 5 minutos

Estratégia de validação de token via JwtStrategy

Proteção de rotas com JwtAuthGuard

📆 Variáveis de Ambiente (.env)

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=vagas
JWT_SECRET=A292FCF5664822974D91E6CF951DE

⚒️ Instalação e Execução

npm install
npm run start:dev

🔐 Autenticação

Endpoint de login

POST /auth/login

Retorna: { access_token: string }

Proteção de rotas

Utilize o header:

Authorization: Bearer <token>

📡 Endpoints Atuais

📁 Usuários

Método

Rota

Descrição

POST

/users

Cadastra novo usuário

GET

/users

Lista todos (rota protegida)

GET

/users/:id

Busca um usuário por ID

PATCH

/users/:id

Atualiza dados do usuário

DELETE

/users/:id

Remove usuário por ID

🔑 Autenticação

Método

Rota

Descrição

POST

/auth/login

Realiza o login e retorna o token JWT

♻️ Próximos passos (MVP)