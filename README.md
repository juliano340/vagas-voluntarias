# Portal de Vagas Voluntárias

Este projeto é um sistema web para divulgação e gestão de **vagas de trabalho voluntário**. Foi desenvolvido como parte do Projeto Integrador da faculdade, com o objetivo de promover oportunidades sociais e facilitar o contato entre **ONGs** e **voluntários**.

## 🔧 Tecnologias Utilizadas

### 📦 Backend (API)

* **NestJS**
* **TypeScript**
* **TypeORM**
* **PostgreSQL**
* **JWT** para autenticação
* **CORS** habilitado para comunicação com o frontend

### 🎨 Frontend (Cliente)

* **Angular**
* **Bootstrap** (estilização)
* **Consumo de API RESTful**
* **Guards** para rotas protegidas

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

* Node.js (versão recomendada: 18+)
* PostgreSQL
* Angular CLI

### Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do backend com as seguintes variáveis:
# Exemplo:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=seu_usuario
# DB_PASSWORD=sua_senha
# DB_NAME=nome_do_banco
# JWT_SECRET=sua_chave_jwt

# Inicie a API
npm run start:dev
```

### Frontend

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação
ng serve
```

Acesse a aplicação em: [http://localhost:4200](http://localhost:4200)
A API estará em: [http://localhost:3000](http://localhost:3000)

## 🧩 Funcionalidades

### Para ONG (Ofertante)

* Cadastro e login
* Criação, edição e exclusão de vagas
* Visualização de candidatos inscritos
* Envio de mensagens para candidatos (em desenvolvimento)

### Para Candidato

* Cadastro e login
* Visualização de vagas disponíveis
* Candidatura às vagas
* Histórico de candidaturas

## 📁 Estrutura do Repositório

```
projeto-integrador/
├── frontend/      # Projeto Angular
└── backend/       # Projeto NestJS
```

## 📌 Observações

* Sistema utiliza autenticação JWT com proteção de rotas.
* Arquitetura desacoplada entre frontend e backend.
* Responsivo e preparado para expansão de funcionalidades.

## 📚 Licença

Este projeto é de uso acadêmico.
