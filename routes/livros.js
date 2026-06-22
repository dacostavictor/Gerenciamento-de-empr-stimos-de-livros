const express = require("express");

const router = express.Router();

const db = require("../db");

router.post("/cadastrar", (req, res) => {
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
  db.query(
    "INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)",
    [titulo, autor, ano_publicacao, quantidade_disponivel],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.status(201).json({
        id: result.insertId,
        titulo,
        autor,
        ano_publicacao,
        quantidade_disponivel,
      });
    },
  );
});

router.get("/listar", (req, res) => {
  db.query("SELECT * FROM livros", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

router.put("/editar/:id", (req, res) => {
  const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ? WHERE id = ?",
    [titulo, autor, ano_publicacao, quantidade_disponivel, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ id, titulo, autor, ano_publicacao, quantidade_disponivel });
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
