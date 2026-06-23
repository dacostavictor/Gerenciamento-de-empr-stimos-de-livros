const usuarioId = sessionStorage.getItem("usuario_id");
const usuarioNome = sessionStorage.getItem("usuario_nome");
const usuarioPerfil = sessionStorage.getItem("usuario_perfil");

if (!usuarioId || usuarioPerfil !== "leitor") {
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
          '<tr><td colspan="6" style="text-align:center;color:#64748b">Nenhum livro no acervo.</td></tr>';
        return;
      }
      data.forEach((livro) => {
        const disponivel = livro.quantidade_disponivel > 0;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${livro.id}</td>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.ano_publicacao || "—"}</td>
          <td>${livro.quantidade_disponivel}</td>
          <td>${
            disponivel
              ? `<button class="btn btn-primary btn-sm" onclick="abrirModal(${livro.id})">Solicitar</button>`
              : '<span style="color:#64748b;font-size:.85rem">Indisponível</span>'
          }</td>`;
        tbody.appendChild(tr);
      });
    });
}

let livroSelecionado = null;

function abrirModal(livroId) {
  livroSelecionado = livroId;
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const input = document.getElementById("dataDevolucaoPrevista");
  input.min = amanha.toISOString().split("T")[0];
  input.value = "";
  const modal = document.getElementById("modalEmprestimo");
  modal.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalEmprestimo").style.display = "none";
  livroSelecionado = null;
}

function confirmarEmprestimo() {
  const dataDevolucao = document.getElementById("dataDevolucaoPrevista").value;
  if (!dataDevolucao) {
    alert("Informe a data prevista de devolução.");
    return;
  }

  fetch("/api/emprestimos/solicitar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      livro_id: livroSelecionado,
      leitor_id: usuarioId,
      data_devolucao_prevista: dataDevolucao,
    }),
  })
    .then(async (r) => {
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro);
      fecharModal();
      mostrarMsg(
        "msgCatalogo",
        "Empréstimo solicitado com sucesso!",
        "sucesso",
      );
      listarLivros();
      listarMeusEmprestimos();
    })
    .catch((e) => {
      fecharModal();
      mostrarMsg(
        "msgCatalogo",
        e.message || "Erro ao solicitar empréstimo.",
        "erro",
      );
    });
}

function listarMeusEmprestimos() {
  fetch(`/api/emprestimos/leitor/${usuarioId}`)
    .then((r) => r.json())
    .then((data) => {
      const tbody = document.getElementById("tbodyEmprestimos");
      tbody.innerHTML = "";
      if (!data.length) {
        tbody.innerHTML =
          '<tr><td colspan="6" style="text-align:center;color:#64748b">Você não tem empréstimos.</td></tr>';
        return;
      }
      data.forEach((emp) => {
        const statusBadge = `<span class="badge badge-${emp.status}">${emp.status}</span>`;
        const acaoBotao =
          emp.status !== "devolvido"
            ? `<button class="btn btn-warning btn-sm" onclick="solicitarDevolucao(${emp.id})">Solicitar devolução</button>`
            : "—";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.titulo_livro}</td>
          <td>${formatarData(emp.data_emprestimo)}</td>
          <td>${formatarData(emp.data_devolucao_prevista)}</td>
          <td>${statusBadge}</td>
          <td>${acaoBotao}</td>`;
        tbody.appendChild(tr);
      });
    });
}

function solicitarDevolucao(id) {
  if (!confirm("Confirmar solicitação de devolução?")) return;
  fetch(`/api/emprestimos/devolver/${id}`, { method: "PUT" })
    .then(async (r) => {
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro);
      mostrarMsg(
        "msgEmprestimo",
        "Devolução registrada com sucesso!",
        "sucesso",
      );
      listarMeusEmprestimos();
      listarLivros();
    })
    .catch((e) =>
      mostrarMsg("msgEmprestimo", e.message || "Erro ao devolver.", "erro"),
    );
}

listarLivros();
listarMeusEmprestimos();
