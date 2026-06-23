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

  db.query(
    "SELECT COUNT(*) AS ativos FROM emprestimos WHERE livro_id = ? AND status IN ('ativo', 'atrasado')",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ erro: "Erro ao verificar empréstimos do livro." });
      }

      if (results[0].ativos > 0) {
        return res.status(409).json({
          erro: "Não é possível excluir: este livro possui empréstimo(s) ativo(s). Registre a devolução antes de excluir.",
        });
      }

      db.beginTransaction((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ erro: "Erro ao iniciar a exclusão." });
        }

        db.query(
          "DELETE FROM emprestimos WHERE livro_id = ?",
          [id],
          (err) => {
            if (err) {
              return db.rollback(() => {
                console.error(err);
                res
                  .status(500)
                  .json({ erro: "Erro ao remover o histórico de empréstimos." });
              });
            }

            db.query("DELETE FROM livros WHERE id = ?", [id], (err, result) => {
              if (err) {
                return db.rollback(() => {
                  console.error(err);
                  res.status(500).json({ erro: "Erro ao excluir o livro." });
                });
              }

              if (result.affectedRows === 0) {
                return db.rollback(() => {
                  res.status(404).json({ erro: "Livro não encontrado." });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(err);
                    res
                      .status(500)
                      .json({ erro: "Erro ao concluir a exclusão." });
                  });
                }
                res.sendStatus(204);
              });
            });
          },
        );
      });
    },
  );
});

module.exports = router;
