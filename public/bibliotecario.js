const usuarioId = sessionStorage.getItem("usuario_id");
const usuarioNome = sessionStorage.getItem("usuario_nome");
const usuarioPerfil = sessionStorage.getItem("usuario_perfil");

if (!usuarioId || usuarioPerfil !== "bibliotecario") {
  window.location.href = "/";
}

document.getElementById("nomeUsuario").textContent = usuarioNome || "";

function sair() {
  sessionStorage.clear();
  window.location.href = "/";
}

function mostrarMsg(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "mensagem " + tipo;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 4000);
}

function formatarData(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("pt-BR");
}

function listarLivros() {
  fetch("/api/livros/listar")
    .then((r) => r.json())
    .then((data) => {
      const tbody = document.getElementById("tbodyLivros");
      tbody.innerHTML = "";
      if (!data.length) {
        tbody.innerHTML =
          '<tr><td colspan="6" style="text-align:center;color:#64748b">Nenhum livro cadastrado.</td></tr>';
        return;
      }
      data.forEach((livro) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${livro.id}</td>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.ano_publicacao || "—"}</td>
          <td>${livro.quantidade_disponivel}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="abrirEdicao(${livro.id}, '${encodeURIComponent(livro.titulo)}', '${encodeURIComponent(livro.autor)}', '${livro.ano_publicacao || ""}', ${livro.quantidade_disponivel})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="excluirLivro(${livro.id})">Excluir</button>
          </td>`;
        tbody.appendChild(tr);
      });
    });
}

function abrirEdicao(id, tituloEnc, autorEnc, ano, qtd) {
  const titulo = decodeURIComponent(tituloEnc);
  const autor = decodeURIComponent(autorEnc);
  const novoTitulo = prompt("Título:", titulo);
  if (novoTitulo === null) return;
  const novoAutor = prompt("Autor:", autor);
  if (novoAutor === null) return;
  const novoAno = prompt("Ano de publicação:", ano);
  if (novoAno === null) return;
  const novaQtd = prompt("Quantidade disponível:", qtd);
  if (novaQtd === null) return;

  fetch(`/api/livros/editar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: novoTitulo,
      autor: novoAutor,
      ano_publicacao: novoAno || null,
      quantidade_disponivel: parseInt(novaQtd),
    }),
  })
    .then((r) => {
      if (!r.ok) throw new Error();
      mostrarMsg("msgLivro", "Livro atualizado com sucesso!", "sucesso");
      listarLivros();
    })
    .catch(() => mostrarMsg("msgLivro", "Erro ao editar livro.", "erro"));
}

function excluirLivro(id) {
  if (!confirm("Excluir este livro?")) return;
  fetch(`/api/livros/excluir/${id}`, { method: "DELETE" })
    .then((r) => {
      if (!r.ok)
        return r.json().then((d) => {
          throw new Error(d.erro);
        });
      mostrarMsg("msgLivro", "Livro excluído.", "sucesso");
      listarLivros();
    })
    .catch((e) =>
      mostrarMsg("msgLivro", e.message || "Erro ao excluir.", "erro"),
    );
}

document.getElementById("registrarLivro").addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const ano_publicacao =
    document.getElementById("ano_publicacao").value || null;
  const quantidade_disponivel = parseInt(
    document.getElementById("quantidade_disponivel").value,
  );

  fetch("/api/livros/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo,
      autor,
      ano_publicacao,
      quantidade_disponivel,
    }),
  })
    .then((r) => {
      if (!r.ok) throw new Error();
      mostrarMsg("msgLivro", "Livro cadastrado com sucesso!", "sucesso");
      e.target.reset();
      listarLivros();
    })
    .catch(() => mostrarMsg("msgLivro", "Erro ao cadastrar livro.", "erro"));
});

function listarEmprestimos() {
  fetch("/api/emprestimos/listar")
    .then((r) => r.json())
    .then((data) => {
      const tbody = document.getElementById("tbodyEmprestimos");
      tbody.innerHTML = "";
      if (!data.length) {
        tbody.innerHTML =
          '<tr><td colspan="7" style="text-align:center;color:#64748b">Nenhum empréstimo registrado.</td></tr>';
        return;
      }
      data.forEach((emp) => {
        const statusBadge = `<span class="badge badge-${emp.status}">${emp.status}</span>`;
        const acaoBotao =
          emp.status !== "devolvido"
            ? `<button class="btn btn-success btn-sm" onclick="aprovarDevolucao(${emp.id})">Aprovar devolução</button>`
            : "—";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.nome_leitor}</td>
          <td>${emp.titulo_livro}</td>
          <td>${formatarData(emp.data_emprestimo)}</td>
          <td>${formatarData(emp.data_devolucao_prevista)}</td>
          <td>${statusBadge}</td>
          <td>${acaoBotao}</td>`;
        tbody.appendChild(tr);
      });
    });
}

function aprovarDevolucao(id) {
  if (!confirm("Confirmar devolução deste empréstimo?")) return;
  fetch(`/api/emprestimos/devolver/${id}`, { method: "PUT" })
    .then((r) => {
      if (!r.ok)
        return r.json().then((d) => {
          throw new Error(d.erro);
        });
      mostrarMsg(
        "msgEmprestimo",
        "Devolução registrada com sucesso!",
        "sucesso",
      );
      listarEmprestimos();
      listarLivros();
    })
    .catch((e) =>
      mostrarMsg(
        "msgEmprestimo",
        e.message || "Erro ao registrar devolução.",
        "erro",
      ),
    );
}

listarLivros();
listarEmprestimos();
