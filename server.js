const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const usersRoutes = require("./routes/usuarios");
const booksRoutes = require("./routes/livros");

app.use(express.json());

app.use("/api/usuarios", usersRoutes);
app.use("/api/livros", booksRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
