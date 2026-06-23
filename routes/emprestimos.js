const express = require("express");
const router = express.Router();
const db = require("../db");

function atualizarAtrasados(callback) {
  const hoje = new Date().toISOString().split("T")[0];
  db.query(
    "UPDATE emprestimos SET status = 'atrasado' WHERE status = 'ativo' AND data_devolucao_prevista < ?",
    [hoje],
    callback,
  );
}

router.post("/solicitar", (req, res) => {
  const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

  if (!livro_id || !leitor_id || !data_devolucao_prevista) {
    return res
      .status(400)
      .json({ erro: "Campos obrigatórios não preenchidos." });
  }

  db.query(
    "SELECT quantidade_disponivel FROM livros WHERE id = ?",
    [livro_id],
    (err, results) => {
      if (err)
        return res.status(500).json({ erro: "Erro ao consultar livro." });
      if (results.length === 0)
        return res.status(404).json({ erro: "Livro não encontrado." });
      if (results[0].quantidade_disponivel <= 0) {
        return res.status(400).json({ erro: "Livro sem estoque disponível." });
      }

      const data_emprestimo = new Date().toISOString().split("T")[0];

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
          if (err)
            return res
              .status(500)
              .json({ erro: "Erro ao registrar empréstimo." });

          db.query(
            "UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?",
            [livro_id],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ erro: "Erro ao atualizar estoque." });

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
    },
  );
});

router.get("/listar", (req, res) => {
  atualizarAtrasados(() => {
    db.query(
      `SELECT e.id, e.livro_id, e.leitor_id, e.data_emprestimo, e.data_devolucao_prevista,
              e.data_devolucao_real, e.status,
              u.nome AS nome_leitor,
              l.titulo AS titulo_livro
       FROM emprestimos e
       JOIN usuarios u ON u.id = e.leitor_id
       JOIN livros l ON l.id = e.livro_id
       ORDER BY e.id DESC`,
      (err, results) => {
        if (err)
          return res.status(500).json({ erro: "Erro ao listar empréstimos." });
        res.json(results);
      },
    );
  });
});

router.get("/leitor/:id", (req, res) => {
  const { id } = req.params;
  atualizarAtrasados(() => {
    db.query(
      `SELECT e.id, e.livro_id, e.leitor_id, e.data_emprestimo, e.data_devolucao_prevista,
              e.data_devolucao_real, e.status,
              l.titulo AS titulo_livro
       FROM emprestimos e
       JOIN livros l ON l.id = e.livro_id
       WHERE e.leitor_id = ?
       ORDER BY e.id DESC`,
      [id],
      (err, results) => {
        if (err)
          return res.status(500).json({ erro: "Erro ao listar empréstimos." });
        res.json(results);
      },
    );
  });
});

router.put("/devolver/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM emprestimos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro interno." });
    if (results.length === 0)
      return res.status(404).json({ erro: "Empréstimo não encontrado." });

    const emprestimo = results[0];
    if (emprestimo.status === "devolvido") {
      return res
        .status(400)
        .json({ erro: "Este empréstimo já foi devolvido." });
    }

    const data_devolucao_real = new Date().toISOString().split("T")[0];

    db.query(
      "UPDATE emprestimos SET status = 'devolvido', data_devolucao_real = ? WHERE id = ?",
      [data_devolucao_real, id],
      (err) => {
        if (err)
          return res.status(500).json({ erro: "Erro ao registrar devolução." });

        db.query(
          "UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?",
          [emprestimo.livro_id],
          (err) => {
            if (err)
              return res
                .status(500)
                .json({ erro: "Erro ao atualizar estoque." });
            res.json({ mensagem: "Livro devolvido com sucesso." });
          },
        );
      },
    );
  });
});

router.delete("/cancelar/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM emprestimos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro interno." });
    if (results.length === 0)
      return res.status(404).json({ erro: "Empréstimo não encontrado." });

    const emp = results[0];

    db.query("DELETE FROM emprestimos WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao cancelar." });

      if (emp.status !== "devolvido") {
        db.query(
          "UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?",
          [emp.livro_id],
          () => res.sendStatus(204),
        );
      } else {
        res.sendStatus(204);
      }
    });
  });
});

module.exports = router;
