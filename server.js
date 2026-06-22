const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoutes = require("./routes/usuarios");
app.use("/api/usuarios", usersRoutes);

const booksRoutes = require("./routes/livros");
app.use("/api/livros", booksRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/bibliotecario", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bibliotecario.html"));
});

app.get("/leitor", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "leitor.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
