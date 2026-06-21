const express = require("express");

const router = express.Router();

const db = require("../db");

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

module.exports = router;
