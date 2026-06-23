# 📚 BiblioSystem — Gerenciamento de Empréstimos de Livros

Sistema web para gerenciar empréstimos de livros em uma biblioteca, com controle de permissões para Bibliotecários e Leitores.

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** MySQL
- **Frontend:** HTML, CSS e JavaScript puro

## Instalação e execução

### 1. Pré-requisitos
- Node.js 18+
- MySQL (local ou remoto)

### 2. Banco de dados

Execute o script SQL para criar o banco:

```bash
mysql -u root -p < banco.sql
```

### 3. Configurar conexão

Edite `db.js` com suas credenciais MySQL:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SUA_SENHA",
  database: "biblioteca",
});
```

### 4. Instalar dependências e rodar

```bash
npm install
npm start
```

Acesse em: **http://localhost:3000**

## Funcionalidades

### Bibliotecário
- Cadastrar, editar e excluir livros
- Visualizar todos os empréstimos (ativos, atrasados, devolvidos)
- Aprovar devoluções (atualiza estoque automaticamente)

### Leitor
- Visualizar catálogo de livros disponíveis
- Solicitar empréstimo (com data de devolução prevista)
- Acompanhar empréstimos e status
- Solicitar devolução

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/usuarios/cadastrar` | Cadastrar usuário |
| POST | `/api/usuarios/login` | Login |
| GET | `/api/livros/listar` | Listar livros |
| POST | `/api/livros/cadastrar` | Cadastrar livro |
| PUT | `/api/livros/editar/:id` | Editar livro |
| DELETE | `/api/livros/excluir/:id` | Excluir livro |
| GET | `/api/emprestimos/listar` | Listar empréstimos |
| GET | `/api/emprestimos/leitor/:id` | Empréstimos do leitor |
| POST | `/api/emprestimos/solicitar` | Solicitar empréstimo |
| PUT | `/api/emprestimos/devolver/:id` | Registrar devolução |
| DELETE | `/api/emprestimos/cancelar/:id` | Cancelar empréstimo |
