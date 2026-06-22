const express = require("express");

const router = express.Router();

const db = require("../db");

router.post("/solicitar", (req, res) => {
  const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

  const data_emprestimo = new Date();

  db.query(
    "INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, ?, ?, ?)",
    [
      livro_id,
      leitor_id,
      data_emprestimo,
      data_devolucao_prevista,
      "ativo",
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      db.query(
        "UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?",
        [livro_id],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send(err);
          }

          res.status(201).json({
            id: result.insertId,
            livro_id,
            leitor_id,
            data_emprestimo,
            data_devolucao_prevista,
            status: "ativo",
          });
        },
      );
    },
  );
});

router.get("/listar", (req, res) => {
  db.query("SELECT * FROM emprestimos", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json(results);
  });
});

router.get("/leitor/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM emprestimos WHERE leitor_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json(results);
    },
  );
});

router.put("/devolver/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM emprestimos WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          erro: "Empréstimo não encontrado",
        });
      }

      const emprestimo = results[0];

      const data_devolucao_real = new Date();

      db.query(
        "UPDATE emprestimos SET status = ?, data_devolucao_real = ? WHERE id = ?",
        ["devolvido", data_devolucao_real, id],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send(err);
          }

          db.query(
            "UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?",
            [emprestimo.livro_id],
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }

              res.json({
                mensagem: "Livro devolvido com sucesso",
              });
            },
          );
        },
      );
    },
  );
});

module.exports = router;