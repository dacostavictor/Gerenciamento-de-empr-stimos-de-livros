const express = require("express");

const router = express.Router();

const db = require("../db");

const { redirecionarPorPerfil } = require("../middlewares/redirecionarPorPerfil");

router.post("/cadastrar", (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  db.query(
    "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
    [nome, email, senha, perfil],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.status(201).json({ id: result.insertId, nome, email, senha, perfil });
    },
  );
});

router.get("/listar", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

router.put("/editar/:id", (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE usuarios SET nome = ?, email = ?, senha = ?, perfil = ? WHERE id = ?",
    [nome, email, senha, perfil, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ id, nome, email, senha, perfil });
    },
  );
});

router.delete("/excluir/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.sendStatus(204);
  });
});

router.post(
  "/login",
  (req, res, next) => {
    const { email, senha } = req.body;

    db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
      async (err, resultados) => {
        if (err) {
          console.error("Erro na consulta:", err.message);
          return res.status(500).json({ erro: "Erro interno no servidor." });
        }

        if (resultados.length === 0) {
          return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }

        const usuario = resultados[0];

        if (senha != usuario.senha) {
          return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }

        // Autenticado: guarda o usuário e passa para o middleware
        // que decide a página de destino conforme o perfil.
        req.usuario = usuario;
        next();
      },
    );
  },
  redirecionarPorPerfil,
);

module.exports = router;
